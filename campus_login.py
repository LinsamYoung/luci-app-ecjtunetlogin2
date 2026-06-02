#!/usr/bin/python3
import os
import requests
import urllib.parse
import time
import sys
import socket  # 用于获取 IP
import subprocess  # 用于从 UCI 读取配置
import traceback
import re  # 用于从 HTML 中提取 URL

LOG_PATH = "/tmp/ecjtunetlogin2.log"

class TeeStream:
    def __init__(self, original_stream, log_stream):
        self.original_stream = original_stream
        self.log_stream = log_stream
        self.encoding = getattr(original_stream, "encoding", "utf-8")
        self.errors = getattr(original_stream, "errors", "replace")

    def write(self, data):
        if not data:
            return 0
        self.original_stream.write(data)
        self.log_stream.write(data)
        return len(data)

    def flush(self):
        self.original_stream.flush()
        self.log_stream.flush()

    def isatty(self):
        return getattr(self.original_stream, "isatty", lambda: False)()

    def writelines(self, lines):
        for line in lines:
            self.write(line)


def setup_logging():
    try:
        log_dir = os.path.dirname(LOG_PATH)
        if log_dir:
            os.makedirs(log_dir, exist_ok=True)
        log_stream = open(LOG_PATH, "a", encoding="utf-8", buffering=1)
    except OSError as e:
        print(f"[!] 无法打开日志文件 {LOG_PATH}: {e}", file=sys.__stderr__)
        return

    sys.stdout = TeeStream(sys.stdout, log_stream)
    sys.stderr = TeeStream(sys.stderr, log_stream)

    def handle_exception(exc_type, exc_value, exc_tb):
        if issubclass(exc_type, KeyboardInterrupt):
            sys.__excepthook__(exc_type, exc_value, exc_tb)
            return
        print("[!] 脚本发生未捕获异常：", file=sys.stderr)
        traceback.print_exception(exc_type, exc_value, exc_tb, file=sys.stderr)

    sys.excepthook = handle_exception


setup_logging()

# --- 从 UCI 读取用户凭据和日志配置 ---
def get_uci_option(section, option, default=""):
    try:
        value = subprocess.check_output(
            ["uci", "get", f"ecjtunetlogin2.{section}.{option}"],
            stderr=subprocess.DEVNULL,
            text=True
        ).strip()
        if value == "":
            return default
        return value
    except (subprocess.CalledProcessError, FileNotFoundError):
        return default


UCI_SECTION = "main" 

USERNAME = get_uci_option(UCI_SECTION, "username", "2022011007000206")
PASSWORD = get_uci_option(UCI_SECTION, "password", "hxa36580")
OPERATOR_SUFFIX = get_uci_option(UCI_SECTION, "operator_suffix", "@telecom")

# --- 用户可读提示 ---
print(f"[*] 当前配置的账号: {USERNAME}{OPERATOR_SUFFIX}")
print(f"[*] 日志文件: {LOG_PATH}")

# --- 网络配置 ---
LOGIN_PAGE_IP = "172.16.2.100"
EPORTAL_PORT = "801"
# 使用固定的 MAC 地址 (来自 HAR 文件，可能无效)
STATIC_MAC = '00-00-00-00-00-00' #

# --- URLs ---
CHECK_URL = "http://detectportal.firefox.com/success.txt" # 仍用于登录后验证
LOGIN_ACTION_BASE_URL = f"http://{LOGIN_PAGE_IP}:{EPORTAL_PORT}/eportal/"

# --- Headers ---
# 基于 HAR 文件分析的关键请求头
POST_HEADERS = {
    'Host': f'{LOGIN_PAGE_IP}:{EPORTAL_PORT}',
    'Origin': f'http://{LOGIN_PAGE_IP}',
    'Referer': f'http://{LOGIN_PAGE_IP}/', # Referer 基于 HAR 分析
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
}

def get_local_ip():
    """尝试获取连接到互联网的本地 IP 地址"""
    s = None
    try:
        # 连接到一个已知的外部服务器（不必实际可达）
        # 使用谷歌的 DNS 服务器 IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # 设置短超时时间以避免在目标真正不可达时挂起
        s.settimeout(1)
        s.connect(("8.8.8.8", 80))
        ip_address = s.getsockname()[0]
        print(f"[*] 检测到本地 IP 地址: {ip_address}")
        return ip_address
    except socket.error as e:
        print(f"[!] 使用 socket 方法无法确定本地 IP 地址: {e}")
        # 备选方案 (可靠性较低, 可能返回 127.0.0.1 或错误的网络接口)
        try:
            hostname = socket.gethostname()
            ip_address = socket.gethostbyname(hostname)
            # 尽可能避免返回环回地址
            if ip_address and not ip_address.startswith("127."):
                print(f"[*] 检测到本地 IP 地址 (备选方案): {ip_address}")
                return ip_address
            else:
                 print(f"[!] 备选 IP 检测返回了环回地址或为空: {ip_address}")
                 # 尝试遍历接口 (更复杂, 可能需要 psutil) - 暂时跳过
                 print("[!] 尝试另一个备选方案: 检查所有主机 IP...")
                 all_ips = socket.gethostbyname_ex(hostname)[-1]
                 # 过滤掉环回地址和链路本地地址, 优先选择私有 IP
                 valid_ips = [ip for ip in all_ips if not ip.startswith("127.") and not ip.startswith("169.254.")]
                 private_ips = [ip for ip in valid_ips if ip.startswith(("10.", "172.", "192.168."))] # 如果需要，调整 172 网段
                 if private_ips:
                     print(f"[*] 通过备选方案找到私有 IP: {private_ips[0]}")
                     return private_ips[0]
                 elif valid_ips:
                     print(f"[*] 通过备选方案找到非环回 IP: {valid_ips[0]}")
                     return valid_ips[0]
                 else:
                     print("[!] 所有备选 IP 检测方法均失败。")
                     return None
        except socket.error as e_fallback:
             print(f"[!] 备选 IP 检测失败: {e_fallback}")
             return None
    finally:
        if s:
            s.close()

def check_connection():
    """检查是否能访问外部网站"""
    print("[*] 正在验证互联网连接...")
    try:
        # 使用 HEAD 请求更快，且仍会被 portal 拦截, 允许重定向以处理强制门户检查
        response = requests.head(CHECK_URL, timeout=3, allow_redirects=True)
        # 检查最终 URL 是否是预期的 URL 且状态码为 OK
        if response.ok and CHECK_URL in response.url:
            print("[*] 互联网连接已验证。")
            return True
        else:
             print("[*] 仍被重定向或无法访问检查 URL。")
             return False
    except requests.exceptions.Timeout:
        print("[!] 验证连接超时。")
        return False
    except requests.exceptions.RequestException as e:
        print(f"[!] 连接验证期间出错: {e}")
        return False

def get_portal_redirect_params():
    """
    访问门户页面 http://172.16.2.100/a70.htm，从服务器嵌入的 JavaScript
    变量中提取校园网分配的真实 v46ip（IPv4 地址）和 ss1（MAC 地址）。
    在软路由环境下直接检测本机 IP 会拿到上游路由器 IP，
    而门户服务器端会根据真实客户端 IP 在页面中嵌入正确的 v46ip 值。
    """
    # a70.htm 是登录页面，服务器端会嵌入真实客户端 IP
    login_page_url = f"http://{LOGIN_PAGE_IP}/a70.htm"
    print(f"[*] 访问登录页面获取真实参数: {login_page_url}")

    browser_headers = {
        'User-Agent': POST_HEADERS['User-Agent'],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    }

    try:
        response = requests.get(login_page_url, timeout=15,
                                 headers=browser_headers)

        if not response.ok:
            print(f"[!] 登录页面返回状态码: {response.status_code}")
            return None

        html = response.text
        print(f"[*] 已获取登录页面 HTML ({len(html)} 字节)，正在提取参数...")

        params = {}

        # 提取真实 IPv4 地址: v46ip='10.32.6.118'
        m = re.search(r"v46ip='([^']+)'", html)
        if m and m.group(1).strip():
            params['wlanuserip'] = m.group(1).strip()
            print(f"[*] 从 v46ip 提取到真实 IP: {params['wlanuserip']}")
        else:
            print("[!] 未在页面中找到 v46ip。")

        # 提取真实 MAC 地址: ss1="0010f367e3e2"
        m = re.search(r'ss1="([^"]+)"', html)
        if m and m.group(1).strip():
            raw_mac = m.group(1).strip()
            # 格式化为 XX-XX-XX-XX-XX-XX
            if len(raw_mac) == 12 and raw_mac.isalnum():
                params['mac'] = '-'.join(raw_mac[i:i+2] for i in range(0, 12, 2)).lower()
            else:
                params['mac'] = raw_mac
            print(f"[*] 从 ss1 提取到真实 MAC: {params['mac']}")
        else:
            print("[!] 未在页面中找到 ss1 (MAC)。")

        if 'wlanuserip' in params and 'mac' in params:
            print(f"[*] 成功从页面提取参数: {params}")
            return params
        else:
            print("[!] 未能提取到完整参数。")
            return None

    except requests.exceptions.Timeout:
        print("[!] 访问登录页面超时。")
        return None
    except requests.exceptions.RequestException as e:
        print(f"[!] 访问登录页面时发生网络错误: {e}")
        return None


def login():
    """通过门户重定向获取真实 IP/MAC 等参数，并发送登录 POST 请求"""
    print("[*] 正在从门户获取真实网络参数...")

    # 优先从门户重定向中获取真实参数
    portal_params = get_portal_redirect_params()

    if portal_params:
        # 使用门户返回的真实 IP 和 MAC
        real_ip = portal_params['wlanuserip']
        real_mac = portal_params['mac']
        print(f"[*] 使用门户提供的真实参数进行登录: IP={real_ip}, MAC={real_mac}")
    else:
        # 回退：无法从门户获取参数时，尝试本地 IP 检测 + 静态 MAC
        print("[!] 无法从门户获取参数，回退到本地 IP 检测方式...")
        real_ip = get_local_ip()
        if not real_ip:
            print("[!] 未能检测到必要的 IP 地址。无法继续。")
            return False
        real_mac = STATIC_MAC
        print(f"[!] 警告: 使用本地检测 IP={real_ip}, 静态 MAC={STATIC_MAC}。"
              f"如果服务器需要有效的 MAC 地址，登录可能会失败。")

    # 构建登录查询参数
    login_query_params = {
        'c': 'ACSetting',
        'a': 'Login',
        'protocol': 'http:',
        'hostname': LOGIN_PAGE_IP,
        'iTermType': '1', # 假设是 PC
        'wlanuserip': real_ip,
        'wlanacip': 'null',
        'wlanacname': 'null',
        'mac': real_mac,
        'ip': real_ip,
        'enAdvert': '0',
        'queryACIP': '0',
        'loginMethod': '1'
    }
    login_action_url = LOGIN_ACTION_BASE_URL + "?" + urllib.parse.urlencode(login_query_params)

    # 构建 POST 数据
    ddddd_value = f",0,{USERNAME}{OPERATOR_SUFFIX}"
    post_data = {
        'DDDDD': ddddd_value,
        'upass': PASSWORD,
        'R1': '0', 'R2': '0', 'R3': '0', 'R6': '0', 'para': '00', '0MKKey': '123456', #
        'buttonClicked': '', 'redirect_url': '', 'err_flag': '', #
        'username': '', 'password': '', 'user': '', 'cmd': '', 'Login': '' #
    }

    print(f"[*] 尝试登录到: {login_action_url}")
    print(f"[*] 发送 POST 数据: DDDDD={ddddd_value}, upass=******")

    try:
        # 发送 POST 请求，禁止自动重定向以便检查 302 状态码
        response = requests.post(login_action_url, headers=POST_HEADERS, data=post_data, timeout=10, allow_redirects=False)

        # 检查响应是否为成功的重定向
        if response.status_code == 302:
            redirect_location = response.headers.get('Location', '')
            print(f"[+] 收到登录重定向: {redirect_location}")

            # 预期的成功页面 URL 前缀
            expected_success_url_3 = f"http://{LOGIN_PAGE_IP}/3.htm"
            expected_success_url_1 = f"http://{LOGIN_PAGE_IP}/1.htm"
            # 有些系统可能在重定向上明确包含 :80 端口
            expected_success_url_3_port = f"http://{LOGIN_PAGE_IP}:80/3.htm"
            expected_success_url_1_port = f"http://{LOGIN_PAGE_IP}:80/1.htm"

            # 检查重定向 URL 是否以预期的成功页面路径开头
            if (redirect_location.startswith(expected_success_url_3) or
                redirect_location.startswith(expected_success_url_1) or
                redirect_location.startswith(expected_success_url_3_port) or # 增加带端口的检查
                redirect_location.startswith(expected_success_url_1_port)):  # 增加带端口的检查
                 print("[+] 重定向 URL 符合预期，登录可能成功。")
                 time.sleep(3) # 等待网络状态可能更新
                 if check_connection(): # 通过尝试访问互联网来验证
                     print("[+] 登录已确认！互联网访问已验证。")
                     return True
                 else:
                     # 即使重定向成功，也可能因为其他原因（如网络延迟）导致 check_connection 失败
                     # 但既然重定向到 3.htm 就意味着成功，我们这里也报告成功
                     print("[!] 登录重定向成功，但后续网络检查未立即成功（可能是网络延迟）。基于重定向，假定登录成功。")
                     return True # 假定成功
            else:
                 print(f"[-] 重定向 URL ({redirect_location}) 与预期的成功页面 ({expected_success_url_3} 或 {expected_success_url_1}) 不匹配。")
                 return False
        else:
            print(f"[-] 登录请求未收到预期的 302 重定向。状态码: {response.status_code}")
            try:
                # 打印响应内容的前 500 个字符以供调试
                print(f"[-] 响应内容预览: {response.text[:500]}...")
            except Exception:
                pass # 如果获取响应文本失败则忽略
            return False

    except requests.exceptions.Timeout:
        print("[!] 登录请求超时。")
        return False
    except requests.exceptions.RequestException as e:
        print(f"[!] 登录时发生网络错误: {e}")
        return False

# --- 主执行逻辑 ---
if __name__ == "__main__":
    print("[*] 开始校园网自动登录脚本 (门户重定向获取真实参数模式)...")

    # 轮询间隔（秒），可从 UCI 读取，默认 10s
    try:
        interval = int(get_uci_option(UCI_SECTION, "check_interval", "10"))
    except ValueError:
        interval = 10

    print(f"[*] 检测间隔: {interval} 秒")



    while True:
        print("\n[*] 开始一次联网状态检测...")
        if check_connection():
            print(f"[*] 当前已联网，{interval} 秒后再次检测。")
        else:
            print("[*] 网络未连接或检测到强制门户。正在尝试登录...")
            login_result = login()
            if login_result:
                print("[*] 本次自动登录成功。")
            else:
                print("[!] 本次自动登录失败。")

        print(f"[*] 等待 {interval} 秒后进行下一次检测...")
        try:
            time.sleep(interval)
        except KeyboardInterrupt:
            print("[*] 收到中断信号，退出脚本。")
            sys.exit(0)
