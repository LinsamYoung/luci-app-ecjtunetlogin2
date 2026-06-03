local fs   = require "nixio.fs"
local util = require "luci.util"
local sys  = require "luci.sys"
local uci  = require "luci.model.uci".cursor()

local PROG = "/usr/bin/ecjtunetlogin2"
local LOG  = "/tmp/ecjtunetlogin2.log"

local function running()
    return sys.call("pgrep -f '" .. PROG .. "' >/dev/null") == 0
end

local function start_service()
    sys.exec("/etc/init.d/ecjtunetlogin2 start >/dev/null 2>&1")
end

local function stop_service()
    sys.exec("/etc/init.d/ecjtunetlogin2 stop >/dev/null 2>&1")
end

local function restart_service()
    sys.exec("/etc/init.d/ecjtunetlogin2 restart >/dev/null 2>&1")
end

m = Map("ecjtunetlogin2", translate("ECJTU 校园网自动登录"),
    translate("配置账号信息并查看运行日志。"))

-- ═══════════ 基本设置 ═══════════
s = m:section(NamedSection, "main", "ecjtunetlogin2", translate("基本设置"))
s.addremove = false
s.anonymous = true

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

-- ═══════════ 调试 ═══════════
s2 = m:section(NamedSection, "main", "ecjtunetlogin2", translate("调试"))
s2.addremove = false
s2.anonymous = true

o = s2:option(DummyValue, "_status", translate("服务状态"))
o.rawhtml = true
function o.cfgvalue()
    if running() then
        return "<span style='color:#0a0;font-weight:bold'>\226\151\143 运行中</span>"
    else
        return "<span style='color:#a00;font-weight:bold'>\226\151\129 未运行</span>"
    end
end

-- 启动/停止 开关（Flag 写入 UCI 选项 _service_enabled 并联动 procd）
o = s2:option(Flag, "_service_enabled", translate("启动服务"))
o.rmempty = false
function o.cfgvalue(self, section)
    return running() and self.enabled or self.disabled
end
function o.write(self, section, value)
    if value == "1" then
        start_service()
    else
        stop_service()
    end
end
o.remove = function() end  -- 禁止删除

o = s2:option(Value, "static_mac", translate("静态 MAC"),
    translate("留空则使用默认 MAC。格式：00-00-00-00-00-00 或 aabbccddeeff。"))
o.placeholder = "留空 = 默认 00-00-00-00-00-00"
o.rmempty  = true

o = s2:option(Value, "log_max_lines", translate("日志保留行数"))
o.datatype = "uinteger"
o.placeholder = "1000"
o.default = "1000"
o.rmempty  = true

-- 应用配置后自动重启服务（无需重启路由器）
m.on_after_commit = function()
    restart_service()
end

-- ═══════════ 日志显示 ═══════════
local log_view = s2:option(DummyValue, "_log", translate("运行日志"))
log_view.rawhtml = true
function log_view.cfgvalue()
    local n = tonumber(uci:get("ecjtunetlogin2", "main", "log_max_lines")) or 1000
    local txt
    if not fs.access(LOG) then
        txt = translate("暂无日志，启动服务后此处将显示输出。")
    else
        txt = sys.exec("tail -n " .. n .. " " .. LOG .. " 2>/dev/null")
        if not txt or txt == "" then txt = translate("日志为空。") end
    end
    return string.format(
        "<div id='logarea'>\
         <div style='margin-bottom:6px;color:#666;display:flex;justify-content:space-between;align-items:center'>\
           <span>%s</span>\
           <a href='#' onclick=\"document.getElementById('logbox').scrollTop=999999;return false\">\226\172\188 底部</a>\
         </div>\
         <textarea id='logbox' readonly wrap='off' style='width:100%%;min-height:500px;font-family:Consolas,monospace;font-size:13px;background:#1a1a2e;color:#e0e0e0;border:1px solid #333;padding:8px'>%s</textarea></div>\
         <script>(function(){var ta=document.getElementById('logbox');ta.scrollTop=999999;setInterval(function(){\
           var x=new XMLHttpRequest();\
           x.open('GET',location.href,true);\
           x.onload=function(){\
             var s=x.responseText;\
             var a=s.indexOf('<textarea',s.indexOf('logbox'));\
             var b=s.indexOf('</textarea>',a);\
             if(a>0){\
               var c=s.indexOf('>',a);\
               ta.value=s.substring(c+1,b);\
               ta.scrollTop=999999;\
             }\
           };x.send()},3000)})()</script>",
        util.pcdata(translate("显示最近 " .. n .. " 行；每 3 秒自动刷新。")),
        util.pcdata(txt)
    )
end

return m