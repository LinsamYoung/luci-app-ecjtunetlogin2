# ecjtunetlogin2 (Rust)

## 华东交通大学校园网自动登录（OpenWrt LuCI + Rust 守护进程）

v2.0 已用 Rust 重写核心登录守护进程，编译为单个静态二进制，零运行时依赖。兼容 OpenWrt 25.12+ APK 包管理。

- LuCI 控制器：[`luasrc/controller/ecjtunetlogin2.lua`](luasrc/controller/ecjtunetlogin2.lua)
- LuCI CBI 配置页：[`luasrc/model/cbi/ecjtunetlogin2/main.lua`](luasrc/model/cbi/ecjtunetlogin2/main.lua)
- procd init：[`ecjtunetlogin2.init`](ecjtunetlogin2.init)
- 默认 UCI 配置：[`ecjtunetlogin2.config`](ecjtunetlogin2.config)
- Rust 守护进程：[`src/main.rs`](src/main.rs)
- 构建定义：[`Cargo.toml`](Cargo.toml) / [`Makefile`](Makefile)

## 功能特性

- LuCI 页面配置学号/密码、运营商后缀、检测间隔、自启开关
- Rust 守护进程循环检测连通性并自动登录校园网门户
- procd 管理，异常退出自动重启
- **零运行时依赖**（Rust 编译为静态二进制，无需 python3）
- 兼容 OpenWrt 25.12+ APK 包管理

## 目录结构

```
├── Cargo.toml                  Rust 项目定义
├── src/
│   └── main.rs                 登录守护进程（Rust）
├── Makefile                    OpenWrt APK 打包
├── ecjtunetlogin2.config       默认 UCI 配置
├── ecjtunetlogin2.init         procd init 脚本
└── luasrc/
    ├── controller/
    │   └── ecjtunetlogin2.lua  LuCI 菜单注册
    └── model/cbi/ecjtunetlogin2/
        └── main.lua            LuCI 配置页面
```

## 依赖

- OpenWrt 25.12+（LuCI + APK）
- 包依赖：`+luci-base`（Rust 守护进程无运行时依赖）
- 编译依赖：Rust 工具链（`rust/host`）

## 编译 & 安装

### 1. 使用 OpenWrt SDK 编译 APK

```bash
# 将项目放入 SDK 的 package/ 目录
make menuconfig
#   Target System  → (你的目标)
#   LuCI → Applications → ecjtunetlogin2  <M>

make package/ecjtunetlogin2/compile V=s
```

### 2. 安装

```bash
# OpenWrt 25.12+ 使用 apk 管理包
apk add /path/to/ecjtunetlogin2_*.apk
```

### 3. 手动部署（开发测试）

```bash
# 交叉编译 Rust 二进制
cargo build --release --target mipsel-unknown-linux-musl

# 拷贝到设备
scp target/mipsel-unknown-linux-musl/release/ecjtunetlogin2 root@router:/usr/bin/
scp ecjtunetlogin2.init root@router:/etc/init.d/ecjtunetlogin2
scp ecjtunetlogin2.config root@router:/etc/config/ecjtunetlogin2
scp -r luasrc/* root@router:/usr/lib/lua/luci/

# 启动
ssh root@router '/etc/init.d/ecjtunetlogin2 enable && /etc/init.d/ecjtunetlogin2 start'
```

## 工作原理

```
┌──────────┐    UCI 配置     ┌──────────────┐
│  LuCI    │ ──────────────> │ /etc/config/  │
│  页面    │                 │ ecjtunetlogin2│
└──────────┘                 └──────┬───────┘
                                    │ uci get
┌──────────┐   procd 管理    ┌──────▼───────┐
│  init.d  │ ──────────────> │ecjtunetlogin2 │  Rust 守护进程
│  脚本    │                 │  /usr/bin/    │
└──────────┘                 └──────┬───────┘
                                    │ 循环检测
                              ┌──────▼───────┐
                              │ check_conn() │  HTTP HEAD
                              │ login()      │  POST 登录
                              └──────────────┘
```

1. LuCI 写入 UCI 配置 `ecjtunetlogin2.main.*`
2. init 脚本读取 `start_on_boot` 决定是否启动守护进程
3. Rust 守护进程循环：检测连通性 → 不可达则 POST 登录校园网 → sleep → 重复

提示：
- 当前脚本使用固定 MAC（STATIC_MAC），如目标门户需要真实 MAC，可能导致登录失败。请按需修改 [`campus_login.py`](campus_login.py) 中的配置。

## 依赖

- OpenWrt（含 LuCI）
- 包依赖：`luci-base`、`python3`、`python3-requests`（见 [Makefile](Makefile)）

## 安装

1) 使用 OpenWrt SDK 编译 IPK
- 将本仓库放入 SDK 的 `package/` 目录


```bash
#在 OpenWrt 目录执行：
make dirclean
#然后重新配置：
make menuconfig
#根据目标环境选择：
Target System  → x86
Subtarget      → x86_64
Target Profile → Generic x86/64

#选择编译包：
# LuCI -> Applications -> luci-app-ecjtunetlogin2 选中 <*> 或 <M>

#然后先编译 工具链：
make toolchain/install -j$(nproc) V=s
#最后编译包：
make package/luci-app-ecjtunetlogin2/compile V=s
```

- 安装生成的 IPK（路径参考 SDK bin 目录）

```bash
opkg install /path/to/luci-app-ecjtunetlogin2.ipk
```

2) 或者手动部署（开发测试）
- 将文件按 [Makefile](Makefile) 的安装路径拷贝至设备
- 确保 `/usr/bin/python3` 与 `requests` 可用

## 配置

可通过 LuCI 页面或 UCI 命令行设置，配置文件位于 `/etc/config/ecjtunetlogin2`（样例见 [ecjtunetlogin2.config](ecjtunetlogin2.config)）。

- username：学号/用户名（必填）
- password：密码（必填）
- operator_suffix：`@cmcc` / `@telecom` / `@unicom`
- start_on_boot：是否随系统启动服务（1/0）
- check_interval：网络检测与登录尝试周期（秒）

示例（UCI）：

```bash
uci set ecjtunetlogin2.main.username='2022012345'
uci set ecjtunetlogin2.main.password='your_password'
uci set ecjtunetlogin2.main.operator_suffix='@cmcc'   # 或 @telecom / @unicom
uci set ecjtunetlogin2.main.start_on_boot='1'
uci set ecjtunetlogin2.main.check_interval='10'
uci commit ecjtunetlogin2
```

## 使用

- LuCI 界面：系统管理 -> 服务 -> ECJTU 校园网自动登录
- 服务管理：

```bash
/etc/init.d/ecjtunetlogin2 start
/etc/init.d/ecjtunetlogin2 stop
/etc/init.d/ecjtunetlogin2 restart
/etc/init.d/ecjtunetlogin2 enable    # 开机自启（仍需 UCI 中 start_on_boot=1 才会实际启动）
/etc/init.d/ecjtunetlogin2 disable
```

- 查看状态与日志：

```bash
# 进程状态
pgrep -f /usr/share/ecjtunetlogin2/campus_login.py
ps | grep campus_login.py

# 系统日志
logread -f
```

- 手动运行脚本（便于前台观察输出）：

```bash
python3 /usr/share/ecjtunetlogin2/campus_login.py
```

## 自定义与扩展

- 如果门户要求真实网卡 MAC，请修改 [`campus_login.py`](campus_login.py) 中的 STATIC_MAC，或改为动态读取实际接口 MAC（例如从 `ip link`/`ubus` 获取）
- 如需调整门户地址/端口，修改脚本中的 `LOGIN_PAGE_IP` 与 `EPORTAL_PORT`
- LuCI 字段与验证逻辑见 [`luasrc/model/cbi/ecjtunetlogin2/main.lua`](luasrc/model/cbi/ecjtunetlogin2/main.lua)

关键函数：
- 配置读取：[`campus_login.get_uci_option`](campus_login.py)
- 本机 IP 发现：[`campus_login.get_local_ip`](campus_login.py)
- 联网检查：[`campus_login.check_connection`](campus_login.py)
- 登录实现：[`campus_login.login`](campus_login.py)

## 常见问题

- LuCI 显示“未运行”
  - 确认 `/etc/init.d/ecjtunetlogin2 enable` 且 `uci get ecjtunetlogin2.main.start_on_boot` 为 1
  - 检查 `logread` 输出中的异常
- 登录失败
  - 门户可能校验 MAC，请参见“自定义与扩展”
  - 检查 `LOGIN_PAGE_IP`/`EPORTAL_PORT` 是否与校园网一致
  - 适当增大 `check_interval`，避免过于频繁

## 开发

- 控制器：[`luci.controller.ecjtunetlogin2.index`](luasrc/controller/ecjtunetlogin2.lua)
- CBI 表单：[`luasrc/model/cbi/ecjtunetlogin2/main.lua`](luasrc/model/cbi/ecjtunetlogin2/main.lua)
- 服务脚本：[`ecjtunetlogin2.init`](ecjtunetlogin2.init)
- 登录逻辑：[`campus_login.py`](campus_login.py)

欢迎提交 Issue/PR。

## 许可证

MIT（见 [Makefile](Makefile) 中 `PKG_LICENSE`）
