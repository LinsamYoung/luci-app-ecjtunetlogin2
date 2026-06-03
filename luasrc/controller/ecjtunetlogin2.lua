module("luci.controller.ecjtunetlogin2", package.seeall)

function index()
    if not nixio.fs.access("/etc/config/ecjtunetlogin2") then
        return
    end

    local page = entry({"admin", "services", "ecjtunetlogin2"},
        alias("admin", "services", "ecjtunetlogin2", "basic"),
        _("ECJTU 校园网自动登录"), 60)
    page.dependent = true

    entry({"admin", "services", "ecjtunetlogin2", "basic"},
        cbi("ecjtunetlogin2/basic"),
        _("基本设置"), 10).leaf = true

    entry({"admin", "services", "ecjtunetlogin2", "debug"},
        cbi("ecjtunetlogin2/debug"),
        _("调试"), 20).leaf = true
end