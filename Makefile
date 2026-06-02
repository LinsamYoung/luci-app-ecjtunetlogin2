include $(TOPDIR)/rules.mk

PKG_NAME:=ecjtunetlogin2
PKG_VERSION:=2.0.0
PKG_RELEASE:=1

PKG_MAINTAINER:=ECJTU
PKG_LICENSE:=MIT

PKG_BUILD_DEPENDS:=rust/host

include $(INCLUDE_DIR)/package.mk

define Package/ecjtunetlogin2
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=ECJTU Campus Network Auto Login (Rust)
  DEPENDS:=+luci-base
  PKGARCH:=$(ARCH)
endef

define Package/ecjtunetlogin2/description
  LuCI interface and Rust-powered daemon for ECJTU campus network auto login.
  Compatible with OpenWrt 25.12+ APK package management.
endef

define Package/ecjtunetlogin2/conffiles
/etc/config/ecjtunetlogin2
endef

define Build/Compile
	cd $(PKG_BUILD_DIR) && \
		CARGO_HOME=$(CARGO_HOME) \
		cargo build --release \
			--target $(RUST_TARGET)
endef

define Package/ecjtunetlogin2/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) $(PKG_BUILD_DIR)/ecjtunetlogin2.config $(1)/etc/config/ecjtunetlogin2

	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/ecjtunetlogin2.init $(1)/etc/init.d/ecjtunetlogin2

	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/target/$(RUST_TARGET)/release/ecjtunetlogin2 $(1)/usr/bin/ecjtunetlogin2

	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/controller
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/luasrc/controller/ecjtunetlogin2.lua \
		$(1)/usr/lib/lua/luci/controller/ecjtunetlogin2.lua

	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/model/cbi/ecjtunetlogin2
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/luasrc/model/cbi/ecjtunetlogin2/main.lua \
		$(1)/usr/lib/lua/luci/model/cbi/ecjtunetlogin2/main.lua
endef

$(eval $(call BuildPackage,ecjtunetlogin2))