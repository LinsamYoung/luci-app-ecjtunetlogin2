module("luci.controller.ecjtunetlogin2", package.seeall)

function index()
    -- 只有在配置存在时才显示菜单
    if not nixio.fs.access("/etc/config/ecjtunetlogin2") then
        return
    end

    entry({"admin", "services", "ecjtunetlogin2"},
        cbi("ecjtunetlogin2/main"),
        _("ECJTU 校园网自动登录"), 60).dependent = true
end