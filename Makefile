include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-ecjtunetlogin2
PKG_VERSION:=2.0.0
PKG_RELEASE:=1

PKG_MAINTAINER:=ECJTU
PKG_LICENSE:=MIT

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-ecjtunetlogin2
  SECTION:=luci
  CATEGORY:=LuCI
  TITLE:=ECJTU Campus Network Auto Login
  DEPENDS:=+luci-base
endef

define Package/luci-app-ecjtunetlogin2/description
  LuCI interface and Rust daemon for ECJTU campus network auto login.
  Compatible with OpenWrt 25.12+ APK.
endef

define Package/luci-app-ecjtunetlogin2/conffiles
/etc/config/ecjtunetlogin2
endef

# ImmortalWrt 只拷 src/ 到构建目录，手动补齐其他文件
define Build/Compile
	cp $(CURDIR)/ecjtunetlogin2.config $(PKG_BUILD_DIR)/
	cp $(CURDIR)/ecjtunetlogin2.init $(PKG_BUILD_DIR)/
	cp -r $(CURDIR)/luasrc $(PKG_BUILD_DIR)/
	mkdir -p $(PKG_BUILD_DIR)/bin
	cp $(CURDIR)/bin/ecjtunetlogin2 $(PKG_BUILD_DIR)/bin/ecjtunetlogin2
endef

define Package/luci-app-ecjtunetlogin2/install
	@test -f $(PKG_BUILD_DIR)/bin/ecjtunetlogin2 || { echo "ERROR: 缺少 bin/ecjtunetlogin2，请先运行 ./build.sh"; exit 1; }

	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) $(PKG_BUILD_DIR)/ecjtunetlogin2.config $(1)/etc/config/ecjtunetlogin2

	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/ecjtunetlogin2.init $(1)/etc/init.d/ecjtunetlogin2

	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/bin/ecjtunetlogin2 $(1)/usr/bin/ecjtunetlogin2

	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/controller
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/luasrc/controller/ecjtunetlogin2.lua \
		$(1)/usr/lib/lua/luci/controller/ecjtunetlogin2.lua

	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/model/cbi/ecjtunetlogin2
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/luasrc/model/cbi/ecjtunetlogin2/main.lua \
		$(1)/usr/lib/lua/luci/model/cbi/ecjtunetlogin2/main.lua
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/luasrc/model/cbi/ecjtunetlogin2/basic.lua \
		$(1)/usr/lib/lua/luci/model/cbi/ecjtunetlogin2/basic.lua
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/luasrc/model/cbi/ecjtunetlogin2/debug.lua \
		$(1)/usr/lib/lua/luci/model/cbi/ecjtunetlogin2/debug.lua
endef

$(eval $(call BuildPackage,luci-app-ecjtunetlogin2))