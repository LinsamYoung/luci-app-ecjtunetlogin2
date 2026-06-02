use std::io::Write;
use std::net::UdpSocket;
use std::process::Command;
use std::thread;
use std::time::Duration;

const LOG_PATH: &str = "/tmp/ecjtunetlogin2.log";
const LOGIN_HOST: &str = "172.16.2.100:801";
const CHECK_URL: &str = "http://detectportal.firefox.com/success.txt";

macro_rules! log {
    ($($arg:tt)*) => {{
        let msg = format!($($arg)*);
        let line = format!("{}\n", msg);
        let _ = std::fs::OpenOptions::new()
            .append(true).create(true)
            .open(LOG_PATH)
            .map(|mut f| f.write_all(line.as_bytes()));
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

fn local_ip() -> Option<String> {
    let sock = UdpSocket::bind("0.0.0.0:0").ok()?;
    sock.connect("8.8.8.8:80").ok()?;
    sock.local_addr().ok().map(|a| a.ip().to_string())
}

/// 简易百分号编码，仅编码非 ASCII 字母数字的字节
fn urlencode(s: &str) -> String {
    s.bytes()
        .map(|b| match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                String::from(b as char)
            }
            _ => format!("%{:02X}", b),
        })
        .collect()
}

fn check_connection() -> bool {
    log!("[*] 正在验证互联网连接…");
    match ureq::head(CHECK_URL)
        .set("User-Agent", "Mozilla/5.0")
        .timeout(Duration::from_secs(3))
        .call()
    {
        Ok(r) if r.status() == 200 => {
            log!("[*] 互联网连接已验证。");
            true
        }
        Ok(r) => {
            log!("[*] 状态码: {}，可能被门户拦截。", r.status());
            false
        }
        Err(e) => {
            log!("[!] 连接验证失败: {e}");
            false
        }
    }
}

fn login(username: &str, password: &str, suffix: &str) -> bool {
    log!("[*] 正在检测本机 IP…");
    let ip = match local_ip() {
        Some(ip) => {
            log!("[*] 检测到 IP: {ip}");
            ip
        }
        None => {
            log!("[!] 无法检测 IP，取消登录。");
            return false;
        }
    };

    let query = format!(
        "c=ACSetting&a=Login&protocol=http:&hostname=172.16.2.100&\
         iTermType=1&wlanuserip={ip}&wlanacip=null&wlanacname=null&\
         mac=00-00-00-00-00-00&ip={ip}&enAdvert=0&queryACIP=0&loginMethod=1"
    );
    let url = format!("http://{LOGIN_HOST}/eportal/?{query}");

    let ddddd = format!(",0,{username}{suffix}");
    let body = format!(
        "DDDDD={}&upass={}&R1=0&R2=0&R3=0&R6=0&para=00&0MKKey=123456&\
         buttonClicked=&redirect_url=&err_flag=&username=&password=&user=&cmd=&Login=",
        urlencode(&ddddd),
        urlencode(password),
    );

    log!("[*] 正在登录: {url}");
    log!("[*] POST DDDDD={ddddd}, upass=******");

    // 使用不允许重定向的 agent，以便捕获 302
    let agent = ureq::AgentBuilder::new().redirects(0).build();

    match agent
        .post(&url)
        .set("Host", LOGIN_HOST)
        .set("Origin", "http://172.16.2.100")
        .set("Referer", "http://172.16.2.100/")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set(
            "User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        )
        .timeout(Duration::from_secs(10))
        .send_string(&body)
    {
        Ok(resp) if resp.status() == 302 => {
            let loc = resp.header("Location").unwrap_or("");
            log!("[+] 收到重定向: {loc}");
            if loc.contains("/3.htm") || loc.contains("/1.htm") {
                log!("[+] 登录成功。");
                thread::sleep(Duration::from_secs(3));
                true
            } else {
                log!("[-] 重定向目标异常: {loc}");
                false
            }
        }
        Ok(resp) => {
            log!("[-] 未收到 302 重定向，状态码: {}", resp.status());
            false
        }
        Err(e) => {
            log!("[!] 登录请求失败: {e}");
            false
        }
    }
}

fn main() {
    let username = uci_get("username", "20220xxxxx");
    let password = uci_get("password", "xxxxx");
    let suffix = uci_get("operator_suffix", "@cmcc");
    let interval: u64 = uci_get("check_interval", "10").parse().unwrap_or(10);

    log!("[*] ECJTU 校园网自动登录启动");
    log!("[*] 账号: {username}{suffix}");
    log!("[*] 检测间隔: {interval} 秒");

    loop {
        log!("");
        log!("[*] 开始联网检测…");
        if check_connection() {
            log!("[*] 已联网，{interval} 秒后再次检测。");
        } else {
            log!("[*] 网络未连接，尝试登录…");
            if login(&username, &password, &suffix) {
                log!("[*] 自动登录成功。");
            } else {
                log!("[!] 自动登录失败。");
            }
        }
        thread::sleep(Duration::from_secs(interval));
    }
}
