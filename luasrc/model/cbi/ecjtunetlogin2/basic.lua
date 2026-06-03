local sys  = require "luci.sys"

local PROG = "/usr/bin/ecjtunetlogin2"

local function running()
    return sys.call("pgrep -f '" .. PROG .. "' >/dev/null") == 0
end

local function restart_service()
    sys.exec("/etc/init.d/ecjtunetlogin2 restart >/dev/null 2>&1")
end

m = Map("ecjtunetlogin2", translate("ECJTU 校园网自动登录"),
    translate("配置校园网账号和登录参数。保存后自动重启服务生效。"))

s = m:section(NamedSection, "main", "ecjtunetlogin2", translate("基本设置"))
s.addremove = false
s.anonymous = true

-- 服务状态 + 启停开关
o = s:option(DummyValue, "_status", translate("服务状态"))
o.rawhtml = true
function o.cfgvalue()
    if running() then
        return "<span style='color:#0a0;font-weight:bold'>&#x2714; 运行中</span>"
    else
        return "<span style='color:#a00;font-weight:bold'>&#x2718; 未运行</span>"
    end
end

o = s:option(Flag, "_svc_toggle", translate("启动服务"),
    translate("勾选启动，取消勾选停止。"))
o.rmempty = false
function o.cfgvalue(self, section)
    return running() and self.enabled or self.disabled
end
function o.write(self, section, value)
    if value == "1" then
        sys.exec("/etc/init.d/ecjtunetlogin2 start >/dev/null 2>&1")
    else
        sys.exec("/etc/init.d/ecjtunetlogin2 stop >/dev/null 2>&1")
    end
end
o.remove = function() end

o = s:option(Value, "username", translate("学号 / 用户名"))
o.datatype = "string"
o.rmempty  = false

o = s:option(Value, "password", translate("密码"))
o.password = true
o.datatype = "string"
o.rmempty  = false

o = s:option(ListValue, "operator_suffix", translate("运营商"))
o:value("@cmcc",   translate("中国移动 (@cmcc)"))
o:value("@telecom", translate("中国电信 (@telecom)"))
o:value("@unicom", translate("中国联通 (@unicom)"))
o.default = "@cmcc"

o = s:option(Flag, "start_on_boot", translate("开机自启"))
o.default = o.enabled

o = s:option(Value, "check_interval", translate("检测间隔 (秒)"))
o.datatype = "uinteger"
o.placeholder = "60"
o.default = "60"

m.on_after_commit = function()
    restart_service()
end

return m
