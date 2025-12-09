-- ECJTU 校园网自动登录配置页面 (CBI 模型)

local fs   = require "nixio.fs"
local uci  = require "luci.model.uci".cursor()
local sys  = require "luci.sys"

local PROG_PATH = "/usr/share/ecjtunetlogin2/campus_login.py"
local function service_running()
    return sys.call(string.format("pgrep -f '%s' >/dev/null", PROG_PATH)) == 0
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

return m