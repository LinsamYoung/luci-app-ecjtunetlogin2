local fs   = require "nixio.fs"
local util = require "luci.util"
local sys  = require "luci.sys"
local uci  = require "luci.model.uci".cursor()

local LOG  = "/tmp/ecjtunetlogin2.log"

m = Map("ecjtunetlogin2", translate("ECJTU 调试"),
    translate("MAC 设置与日志查看。"))

s = m:section(NamedSection, "main", "ecjtunetlogin2", translate("参数设置"))
s.addremove = false
s.anonymous = true

o = s:option(Value, "static_mac", translate("静态 MAC"),
    translate("登录回退时使用的 MAC 地址。格式：00-00-00-00-00-00 或 aabbccddeeff。"))
o.placeholder = "00-00-00-00-00-00"
o.rmempty  = true

o = s:option(Value, "log_max_lines", translate("日志保留行数"),
    translate("超过此行数自动截断旧日志。"))
o.datatype = "uinteger"
o.placeholder = "1000"
o.default = "1000"
o.rmempty  = true

-- ═══════════ 日志 ═══════════
s2 = m:section(NamedSection, "main", "ecjtunetlogin2", translate("运行日志"))
s2.addremove = false
s2.anonymous = true

o = s2:option(DummyValue, "_log", "")
o.rawhtml = true
function o.cfgvalue()
    local n = tonumber(uci:get("ecjtunetlogin2", "main", "log_max_lines")) or 1000
    local txt
    if not fs.access(LOG) then
        txt = translate("暂无日志，启动服务后此处将显示输出。")
    else
        txt = sys.exec("tail -n " .. n .. " " .. LOG .. " 2>/dev/null")
        if not txt or txt == "" then txt = translate("日志为空。") end
    end
    return string.format([[
        <style>
          #logbox{width:100%%;min-height:600px;font-family:Consolas,"Courier New",monospace;
                  font-size:13px;background:#0d1117;color:#c9d1d9;border:1px solid #30363d;
                  padding:10px;resize:vertical;white-space:pre;overflow:auto}
        </style>
        <div style='margin-bottom:6px;color:#666;display:flex;justify-content:space-between'>
          <span>%s</span>
          <span><a href='#' onclick='var t=document.getElementById("logbox");t.scrollTop=t.scrollHeight;return false'>&#x2B07; 底部</a></span>
        </div>
        <textarea id='logbox' readonly wrap='off'>%s</textarea>
        <script>(function(){
          var ta=document.getElementById('logbox');
          ta.scrollTop=ta.scrollHeight;
          setInterval(function(){
            var x=new XMLHttpRequest();
            x.open('GET',location.href,true);
            x.onload=function(){
              var s=x.responseText;
              var a=s.indexOf('<textarea',s.indexOf('logbox'));
              var b=s.indexOf('</textarea>',a);
              if(a>0){var c=s.indexOf('>',a);ta.value=s.substring(c+1,b);ta.scrollTop=ta.scrollHeight;}
            };x.send()},3000)
        })()</script>
    ]], util.pcdata(translate("显示最近 " .. n .. " 行；每 3 秒自动刷新，可拖拽右下角调整高度。")), util.pcdata(txt))
end

return m
