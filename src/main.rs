use std::io::{BufRead, BufReader, Read, Write};
use std::net::{TcpStream, UdpSocket};
use std::process::Command;
use std::thread;
use std::time::Duration;

const LOG_PATH: &str = "/tmp/ecjtunetlogin2.log";
const LOGIN_HOST: &str = "172.16.2.100:801";
const STATIC_MAC: &str = "00-00-00-00-00-00";

macro_rules! log {
    ($($arg:tt)*) => {{
        let msg = format!($($arg)*);
        let _ = std::fs::OpenOptions::new()
            .append(true).create(true).open(LOG_PATH)
            .map(|mut f| f.write_all(format!("{}\n", msg).as_bytes()));
        println!("{}", msg);
    }};
}

fn uci_get(key: &str, default: &str) -> String {
    Command::new("uci")
        .args(["get", &format!("ecjtunetlogin2.main.{key}")])
        .output()
        .ok()
        .filter(|o| o.status.success())
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .map(|s| s.trim().to_owned())
        .filter(|s| !s.is_empty())
        .unwrap_or_else(|| default.to_owned())
}

fn get_local_ip() -> Option<String> {
    let sock = UdpSocket::bind("0.0.0.0:0").ok()?;
    sock.connect("8.8.8.8:80").ok()?;
    sock.local_addr().ok().map(|a| a.ip().to_string())
}

fn urlencode(s: &str) -> String {
    s.bytes()
        .map(|b| match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => String::from(b as char),
            _ => format!("%{:02X}", b),
        })
        .collect()
}

/// HTTP 请求: (状态码, Location, 响应体)
fn http(m: &str, host: &str, path: &str, hdrs: &[(&str, &str)], body: Option<&str>) -> Option<(u16, String, String)> {
    let mut sock = TcpStream::connect(host).ok()?;
    sock.set_read_timeout(Some(Duration::from_secs(10))).ok()?;
    sock.set_write_timeout(Some(Duration::from_secs(5))).ok()?;
    let mut req = format!("{m} {path} HTTP/1.0\r\nHost: {host}\r\n");
    for (k, v) in hdrs { req.push_str(&format!("{k}: {v}\r\n")); }
    if let Some(b) = body { req.push_str(&format!("Content-Length: {}\r\n", b.len())); }
    req.push_str("Connection: close\r\n\r\n");
    if let Some(b) = body { req.push_str(b); }
    sock.write_all(req.as_bytes()).ok()?;
    let mut r = BufReader::new(sock);
    let mut line = String::new();
    r.read_line(&mut line).ok()?;
    let st = line.split_whitespace().nth(1).and_then(|s| s.parse().ok()).unwrap_or(0);
    let mut loc = String::new();
    loop {
        let mut l = String::new();
        if r.read_line(&mut l).ok()? == 0 || l == "\r\n" || l == "\n" { break; }
        if l.to_lowercase().starts_with("location:") { loc = l["location:".len()..].trim().to_owned(); }
    }
    let mut resp = String::new();
    r.read_to_string(&mut resp).ok();
    Some((st, loc, resp))
}

/// 下载 URL 到文件（uclient-fetch）
fn fetch_to_file(url: &str, out: &str) -> bool {
    Command::new("uclient-fetch")
        .args(["-q", "-O", out, url])
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}

/// Python check_connection: HEAD, allow_redirects，用 uclient-fetch 实现
fn check_connection() -> bool {
    log!("[*] 正在验证互联网连接...");
    // uclient-fetch -q --spider 或直接下载判断
    let out = Command::new("uclient-fetch")
        .args(["-q", "-O", "/dev/null", "http://detectportal.firefox.com/success.txt"])
        .status();
    match out {
        Ok(s) if s.success() => {
            log!("[*] 互联网连接已验证。");
            true
        }
        _ => {
            log!("[*] 仍被重定向或无法访问检查 URL。");
            false
        }
    }
}

/// Python get_portal_redirect_params: 下载 a70.htm 并用正则提取 v46ip / ss1
fn get_portal_redirect_params() -> Option<(String, String)> {
    log!("[*] 访问登录页面获取真实参数: http://172.16.2.100/a70.htm");
    let tmp = "/tmp/a70.htm";
    if !fetch_to_file("http://172.16.2.100/a70.htm", tmp) {
        log!("[!] 访问登录页面超时。");
        return None;
    }
    let body = match std::fs::read(tmp) {
        Ok(b) => String::from_utf8_lossy(&b).into_owned(),
        Err(e) => { log!("[!] 读取页面失败: {e}"); return None; }
    };
    log!("[*] 已获取登录页面 HTML ({} 字节)，正在提取参数...", body.len());

    let mut ip = None;
    let mut mac = None;
    // v46ip='10.32.6.118'
    if let Some(pos) = body.find("v46ip='") {
        let s = &body[pos + 7..];
        if let Some(end) = s.find('\'') {
            let val = s[..end].to_owned();
            if !val.is_empty() { log!("[*] 从 v46ip 提取到真实 IP: {val}"); ip = Some(val); }
        }
    }
    if ip.is_none() { log!("[!] 未在页面中找到 v46ip。"); }
    // ss1="0010f367e3e2" → XX-XX-XX-XX-XX-XX
    if let Some(pos) = body.find("ss1=\"") {
        let s = &body[pos + 5..];
        if let Some(end) = s.find('"') {
            let raw = s[..end].to_owned();
            if raw.len() == 12 && raw.chars().all(|c| c.is_ascii_hexdigit()) {
                let m = (0..12).step_by(2).map(|i| raw[i..i+2].to_owned()).collect::<Vec<_>>().join("-");
                log!("[*] 从 ss1 提取到真实 MAC: {m}"); mac = Some(m);
            } else { mac = Some(raw.clone()); log!("[*] 从 ss1 提取到 MAC: {raw}"); }
        }
    }
    if mac.is_none() { log!("[!] 未在页面中找到 ss1 (MAC)。"); }
    match (ip, mac) { (Some(i), Some(m)) => Some((i, m)), _ => { log!("[!] 未能提取到完整参数。"); None } }
}

/// Python login: 优先门户参数，回退本地 IP + 静态 MAC
fn login(user: &str, pass: &str, suffix: &str) -> bool {
    let (real_ip, real_mac) = if let Some((ip, mac)) = get_portal_redirect_params() {
        log!("[*] 使用门户提供的真实参数进行登录: IP={ip}, MAC={mac}"); (ip, mac)
    } else {
        log!("[!] 无法从门户获取参数，回退到本地 IP 检测方式...");
        let ip = match get_local_ip() {
            Some(i) => { log!("[*] 检测到本地 IP 地址: {i}"); i }
            None => { log!("[!] 未能检测到必要的 IP 地址。无法继续。"); return false; }
        };
        log!("[!] 警告: 使用本地检测 IP={ip}, 静态 MAC={STATIC_MAC}。");
        (ip, STATIC_MAC.to_owned())
    };

    let query = format!(
        "c=ACSetting&a=Login&protocol=http:&hostname=172.16.2.100&\
         iTermType=1&wlanuserip={real_ip}&wlanacip=null&wlanacname=null&\
         mac={real_mac}&ip={real_ip}&enAdvert=0&queryACIP=0&loginMethod=1"
    );
    let path = format!("/eportal/?{query}");
    let ddddd = format!(",0,{user}{suffix}");
    let post_body = format!(
        "DDDDD={}&upass={}&R1=0&R2=0&R3=0&R6=0&para=00&0MKKey=123456&\
         buttonClicked=&redirect_url=&err_flag=&username=&password=&user=&cmd=&Login=",
        urlencode(&ddddd), urlencode(pass),
    );

    log!("[*] 尝试登录到: http://{LOGIN_HOST}{path}");
    log!("[*] 发送 POST 数据: DDDDD={ddddd}, upass=******");

    let hdrs = [
        ("Host", "172.16.2.100:801"),
        ("Origin", "http://172.16.2.100"),
        ("Referer", "http://172.16.2.100/"),
        ("Content-Type", "application/x-www-form-urlencoded"),
        ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"),
    ];

    match http("POST", LOGIN_HOST, &path, &hdrs, Some(&post_body)) {
        Some((302, loc, _)) => {
            log!("[+] 收到登录重定向: {loc}");
            let ok3 = loc.starts_with("http://172.16.2.100/3.htm") || loc.starts_with("http://172.16.2.100:80/3.htm");
            let ok1 = loc.starts_with("http://172.16.2.100/1.htm") || loc.starts_with("http://172.16.2.100:80/1.htm");
            if ok3 || ok1 {
                log!("[+] 重定向 URL 符合预期，登录可能成功。");
                thread::sleep(Duration::from_secs(3));
                if check_connection() { log!("[+] 登录已确认！互联网访问已验证。"); return true; }
                log!("[!] 登录重定向成功，但后续网络检查未立即成功。基于重定向，假定登录成功。");
                return true;
            }
            log!("[-] 重定向 URL 与预期的成功页面不匹配。");
            false
        }
        Some((code, _, body)) => {
            log!("[-] 登录请求未收到预期的 302 重定向。状态码: {code}");
            if !body.is_empty() { log!("[-] 响应内容预览: {}...", &body[..body.len().min(500)]); }
            false
        }
        None => { log!("[!] 登录时发生网络错误。"); false }
    }
}

fn main() {
    let user = uci_get("username", "2022011007000206");
    let pass = uci_get("password", "hxa36580");
    let suffix = uci_get("operator_suffix", "@telecom");
    let interval: u64 = uci_get("check_interval", "10").parse().unwrap_or(10);

    log!("[*] 当前配置的账号: {user}{suffix}");
    log!("[*] 日志文件: {LOG_PATH}");
    log!("[*] 开始校园网自动登录脚本 (门户重定向获取真实参数模式)...");
    log!("[*] 检测间隔: {interval} 秒");

    loop {
        log!("");
        log!("[*] 开始一次联网状态检测...");
        if check_connection() {
            log!("[*] 当前已联网，{interval} 秒后再次检测。");
        } else {
            log!("[*] 网络未连接或检测到强制门户。正在尝试登录...");
            if login(&user, &pass, &suffix) {
                log!("[*] 本次自动登录成功。");
            } else {
                log!("[!] 本次自动登录失败。");
            }
        }
        log!("[*] 等待 {interval} 秒后进行下一次检测...");
        thread::sleep(Duration::from_secs(interval));
    }
}
