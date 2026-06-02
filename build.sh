#!/bin/bash
# 预编译 Rust 二进制，输出到 bin/ecjtunetlogin2
# 用法:
#   ./build.sh                           # 自动检测目标
#   ./build.sh aarch64-unknown-linux-musl # 指定 Rust target
#   ./build.sh --native                  # 在本机编译 (x86_64)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BIN_DIR="$SCRIPT_DIR/bin"

# ── 目标映射 ──────────────────────────────────────
# OpenWrt ARCH -> Rust target triple
declare -A TARGET_MAP=(
    [aarch64_cortex-a53]=aarch64-unknown-linux-musl
    [aarch64_generic]=aarch64-unknown-linux-musl
    [aarch64]=aarch64-unknown-linux-musl
    [x86_64]=x86_64-unknown-linux-musl
    [i386]=i686-unknown-linux-musl
    [mipsel_24kc]=mipsel-unknown-linux-musl
    [mips_24kc]=mips-unknown-linux-musl
    [arm_cortex-a9]=arm-unknown-linux-musleabi
    [arm_cortex-a7_neon-vfpv4]=armv7-unknown-linux-musleabihf
)

detect_target() {
    # 尝试从 SDK 环境推断
    if [ -n "${ARCH:-}" ] && [ -n "${CONFIG_TARGET_SUFFIX:-}" ]; then
        local key="${ARCH}${CONFIG_TARGET_SUFFIX}"
        echo "${TARGET_MAP[$key]:-}"
    elif [ -n "${ARCH:-}" ]; then
        local key
        for key in "${!TARGET_MAP[@]}"; do
            if [[ "$key" == "$ARCH"* ]]; then
                echo "${TARGET_MAP[$key]}"
                return
            fi
        done
    fi
}

install_target() {
    local target="$1"
    if rustup target list --installed 2>/dev/null | grep -q "^$target$"; then
        return
    fi
    echo "[*] 安装 Rust target: $target"
    rustup target add "$target"
}

# ── 主流程 ────────────────────────────────────────

cd "$SCRIPT_DIR"

TARGET="${1:-}"

if [ "$TARGET" = "--native" ]; then
    TARGET=""
elif [ -z "$TARGET" ]; then
    TARGET="$(detect_target)"
    if [ -z "$TARGET" ]; then
        echo "用法: $0 <rust-target-triple>"
        echo ""
        echo "常见 OpenWrt 目标:"
        echo "  aarch64-unknown-linux-musl   (ARM64 / IPQ60xx 等)"
        echo "  x86_64-unknown-linux-musl    (x86_64)"
        echo "  mipsel-unknown-linux-musl    (MT7621 等)"
        echo "  armv7-unknown-linux-musleabihf"
        echo ""
        echo "也可: $0 --native  编译本机架构"
        echo ""
        echo "当前 SDK ARCH=$ARCH"
        exit 1
    fi
    echo "[*] 自动检测目标: $TARGET"
fi

if [ -n "$TARGET" ]; then
    install_target "$TARGET"
fi

echo "[*] 编译中..."
if [ -n "$TARGET" ]; then
    cargo build --release --target "$TARGET"
    SRC="target/$TARGET/release/ecjtunetlogin2"
else
    cargo build --release
    SRC="target/release/ecjtunetlogin2"
fi

mkdir -p "$BIN_DIR"
cp "$SRC" "$BIN_DIR/ecjtunetlogin2"

echo "[+] 完成: $BIN_DIR/ecjtunetlogin2"
file "$BIN_DIR/ecjtunetlogin2" 2>/dev/null || true
ls -lh "$BIN_DIR/ecjtunetlogin2"
