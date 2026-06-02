local fs   = require "nixio.fs"
local util = require "luci.util"
local sys  = require "luci.sys"

local PROG = "/usr/bin/ecjtunetlogin2"
local LOG  = "/tmp/ecjtunetlogin2.log"

local function running()
    return sys.call("pgrep -f '" .. PROG .. "' >/dev/null") == 0
end

local function tail(n)
    if not fs.access(LOG) then
        return translate("暂无日志，启动服务后此处将显示输出。")
    end
    local s = sys.exec("tail -n " .. n .. " " .. LOG .. " 2>/dev/null")
    if not s or s == "" then
        return translate("日志为空。")
    end
    return s
end

m = Map("ecjtunetlogin2", translate("ECJTU 校园网自动登录"),
    translate("配置账号信息并查看运行日志。"))

s = m:section(NamedSection, "main", "ecjtunetlogin2", translate("基本设置"))
s.addremove = false
s.anonymous = true

o = s:option(DummyValue, "_status", translate("服务状态"))
o.rawhtml = true
function o.cfgvalue()
    if running() then
        return "<span style='color:#0a0'>运行中</span>"
    else
        return "<span style='color:#a00'>未运行</span>"
    end
end

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

o = s:option(Value, "static_mac", translate("静态 MAC"),
    translate("留空自动检测。格式：00-00-00-00-00-00 或 aabbccddeeff。"))
o.placeholder = translate("留空 = 自动检测")
o.rmempty  = true

o = s:option(DummyValue, "_log", translate("运行日志"))
o.rawhtml = true
function o.cfgvalue()
    return string.format(
        "<div id='logarea'><div style='margin-bottom:6px;color:#666'>%s</div>\
         <textarea id='logbox' readonly wrap='off' style='width:100%%;min-height:360px;font-family:monospace'>%s</textarea></div>\
         <script>(function(){setInterval(function(){\
           var x=new XMLHttpRequest();\
           x.open('GET',location.href,true);\
           x.onload=function(){\
             var s=x.responseText;\
             var a=s.indexOf('<textarea');\
             var b=s.indexOf('</textarea>',a);\
             if(a>0){\
               var c=s.indexOf('>',a);\
               document.getElementById('logbox').value=s.substring(c+1,b);\
             }\
           };x.send()},3000)})()</script>",
        util.pcdata(translate("每 3 秒自动刷新。")),
        util.pcdata(tail(120))
    )
end

return m