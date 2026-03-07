-- ECJTU 校园网自动登录配置页面 (CBI 模型)

local fs   = require "nixio.fs"
local uci  = require "luci.model.uci".cursor()
local sys  = require "luci.sys"
local util = require "luci.util"

local PROG_PATH = "/usr/share/ecjtunetlogin2/campus_login.py"
local LOG_PATH  = "/tmp/ecjtunetlogin2.log"
local LOG_LINES = 120

local function service_running()
    return sys.call(string.format("pgrep -f '%s' >/dev/null", PROG_PATH)) == 0
end

local function read_log_tail()
    if not fs.access(LOG_PATH) then
        return translate("暂无日志，脚本启动后会在这里显示输出。")
    end

    local content = sys.exec(string.format("tail -n %d %s 2>/dev/null", LOG_LINES, LOG_PATH))
    if not content or content == "" then
        return translate("日志文件为空。")
    end

    return content
end

m = Map("ecjtunetlogin2", translate("ECJTU 校园网自动登录"),
    translate("配置校园网账号信息，并查看自动登录脚本的运行日志。"))

-- 主配置节
s = m:section(NamedSection, "main", "ecjtunetlogin2", translate("基本设置"))
s.addremove = false
s.anonymous = true

-- 服务状态
do
    local o = s:option(DummyValue, "_service_status", translate("服务状态"))
    o.rawhtml = true
    function o.cfgvalue(self, section)
        if service_running() then
            return "<span style='color:#0a0'>运行中</span>"
        else
            return "<span style='color:#a00'>未运行</span>"
        end
    end
end

-- 用户名
o = s:option(Value, "username", translate("学号 / 用户名"))
o.datatype = "string"
o.rmempty  = false

-- 密码
o = s:option(Value, "password", translate("密码"))
o.password = true
o.datatype = "string"
o.rmempty  = false

-- 运营商后缀
o = s:option(ListValue, "operator_suffix", translate("运营商"))
o:value("@cmcc", translate("中国移动 (@cmcc)"))
o:value("@telecom", translate("中国电信 (@telecom)"))
o:value("@unicom", translate("中国联通 (@unicom)"))
o.default = "@cmcc"

-- 开机自启
o = s:option(Flag, "start_on_boot", translate("开机自动运行脚本"))
o.default = o.enabled


-- 检测间隔（秒）
o = s:option(Value, "check_interval", translate("检测间隔 (秒)"))
o.datatype = "uinteger"
o.placeholder = "60"
o.default  = "60"

-- 运行日志
local log_view = s:option(DummyValue, "_runtime_log", translate("运行日志"))
log_view.rawhtml = true
function log_view.cfgvalue(self, section)
    local tip = translate("显示最近 120 行日志；保存配置后刷新页面，可查看最新 print 和报错信息。")
    local content = util.pcdata(read_log_tail())
    return string.format(
        "<div><div style='margin-bottom:6px;color:#666'>%s</div><textarea readonly='readonly' wrap='off' style='width:100%%;min-height:360px;font-family:monospace'>%s</textarea></div>",
        util.pcdata(tip),
        content
    )
end

return m