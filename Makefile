include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-ecjtunetlogin2
PKG_VERSION:=1.0
PKG_RELEASE:=1

PKG_MAINTAINER:=ECJTU
PKG_LICENSE:=MIT

LUCI_TITLE:=ECJTU Campus Network Auto Login
LUCI_PKGARCH:=all

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
    SECTION:=luci
    CATEGORY:=LuCI
    SUBMENU:=3. Applications
    TITLE:=$(LUCI_TITLE)
    DEPENDS:=+luci-base +python3 +python3-requests
endef

define Package/$(PKG_NAME)/description
    LuCI interface and service for ECJTU campus network auto login (ecjtunetlogin2).
endef

define Package/$(PKG_NAME)/conffiles
/etc/config/ecjtunetlogin2
endef

# 不需要编译源码，跳过 configure/compile 阶段
define Build/Prepare

endef

define Build/Configure

endef

define Build/Compile
    
endef

define Package/$(PKG_NAME)/install
	# UCI 配置
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./ecjtunetlogin2.config $(1)/etc/config/ecjtunetlogin2

	# init 脚本
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./ecjtunetlogin2.init $(1)/etc/init.d/ecjtunetlogin2

	# Python 脚本
	$(INSTALL_DIR) $(1)/usr/share/ecjtunetlogin2
	$(INSTALL_BIN) ./campus_login.py $(1)/usr/share/ecjtunetlogin2/campus_login.py

	# LuCI controller
	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/controller
	$(INSTALL_DATA) ./luasrc/controller/ecjtunetlogin2.lua \
	    $(1)/usr/lib/lua/luci/controller/ecjtunetlogin2.lua

	# LuCI CBI model
	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/model/cbi/ecjtunetlogin2
	$(INSTALL_DATA) ./luasrc/model/cbi/ecjtunetlogin2/main.lua \
	    $(1)/usr/lib/lua/luci/model/cbi/ecjtunetlogin2/main.lua
endef

$(eval $(call BuildPackage,$(PKG_NAME)))