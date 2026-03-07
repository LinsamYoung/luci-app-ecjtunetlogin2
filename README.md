# luci-app-ecjtunetlogin2 
## 华东交通大学校园网自动登录插件（OpenWrt LuCI 应用）

ECJTU 校园网自动登录（OpenWrt LuCI 应用）。本项目提供：
- 一个 LuCI 界面用于配置校园网账号与运行参数
- 一个 procd 管理的开机自启服务
- 一个 Python 自动登录脚本，周期检测网络并在被强制门户拦截时发起登录
  
![ECJTUNet Demo](https://raw.githubusercontent.com/LinsamYoung/pic/8710ac0c6dc82cfcd8a5708f4fc0530973912f81/ecjtunetdemo.png)

- LuCI 控制器：[`luci.controller.ecjtunetlogin2`](luasrc/controller/ecjtunetlogin2.lua)
- LuCI CBI 配置页：[`luasrc/model/cbi/ecjtunetlogin2/main.lua`](luasrc/model/cbi/ecjtunetlogin2/main.lua)
- 初始化脚本（procd）：[`ecjtunetlogin2.init`](ecjtunetlogin2.init)
- 默认配置：[`ecjtunetlogin2.config`](ecjtunetlogin2.config)
- 核心登录脚本：[`campus_login.py`](campus_login.py)
- OpenWrt 打包脚本：[`Makefile`](Makefile)

## 功能特性

- LuCI 页面配置学号/密码、运营商后缀、检查间隔与自启开关
- 后台服务按间隔检测连通性，自动登录门户
- 使用 procd 管理，异常退出自动重启
- 轻量依赖：`python3` 和 `python3-requests`

## 目录结构

```
luci-app-ecjtunetlogin2/
|- Makefile                                OpenWrt 打包定义
|- ecjtunetlogin2.config                   默认 UCI 配置
|- ecjtunetlogin2.init                     procd 服务定义，启动 `/usr/bin/python3 /usr/share/ecjtunetlogin2/campus_login.py`
|- campus_login.py                         自动登录主脚本
|- luasrc/
|  |- controller/
|  |  |- ecjtunetlogin2.lua                注册菜单，路径“系统管理 > 服务 > ECJTU 校园网自动登录”
|  |- model/
|     |- cbi/
|        |- ecjtunetlogin2/
|           |- main.lua                    CBI 表单（用户名、密码、运营商、自启、检测间隔）与服务状态展示
```

- [luasrc/controller/ecjtunetlogin2.lua](luasrc/controller/ecjtunetlogin2.lua)：
- [luasrc/model/cbi/ecjtunetlogin2/main.lua](luasrc/model/cbi/ecjtunetlogin2/main.lua)：
- [ecjtunetlogin2.init](ecjtunetlogin2.init)：
- [ecjtunetlogin2.config](ecjtunetlogin2.config)：
- [campus_login.py](campus_login.py)：
- [Makefile](Makefile)：

## 工作原理

- LuCI 界面写入 UCI 配置 `ecjtunetlogin2.main.*`
- 开机时由 init 脚本读取 `start_on_boot` 决定是否启动服务
- 后台脚本循环：
  1. 检测互联网可达性（[`campus_login.check_connection`](campus_login.py)）
  2. 不可达则尝试登录（[`campus_login.login`](campus_login.py)）
  3. 读取配置（[`campus_login.get_uci_option`](campus_login.py)）
  4. 自动获取本机 IP（[`campus_login.get_local_ip`](campus_login.py)）
- LuCI 状态通过 pgrep 检测脚本进程显示“运行中/未运行”

提示：
- 当前脚本使用固定 MAC（STATIC_MAC），如目标门户需要真实 MAC，可能导致登录失败。请按需修改 [`campus_login.py`](campus_login.py) 中的配置。

## 依赖

- OpenWrt（含 LuCI）
- 包依赖：`luci-base`、`python3`、`python3-requests`（见 [Makefile](Makefile)）

## 安装

1) 使用 OpenWrt SDK 编译 IPK
- 将本仓库放入 SDK 的 `package/` 目录
- 选择包并编译

```bash
# 进入 OpenWrt SDK 根目录
make menuconfig
# LuCI -> Applications -> luci-app-ecjtunetlogin2 选中 <*> 或 <M>
make package/luci-app-ecjtunetlogin2/compile V=s
```

- 安装生成的 IPK（路径参考 SDK bin 目录）

```bash
opkg install /path/to/luci-app-ecjtunetlogin2_*.ipk
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
