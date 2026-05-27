#!/bin/bash
# Creates GitHub repo and pushes (requires GitHub login once).
set -e
cd "$(dirname "$0")"

REPO_NAME="${1:-conference-registration}"

if ! command -v gh &>/dev/null; then
  echo "Installing GitHub CLI..."
  ARCH=$(uname -m)
  [ "$ARCH" = "arm64" ] && GH_ARCH="macOS_arm64" || GH_ARCH="macOS_amd64"
  TMP=$(mktemp -d)
  curl -fsSL "https://github.com/cli/cli/releases/latest/download/gh_${GH_ARCH}.tar.gz" -o "$TMP/gh.tar.gz"
  tar -xzf "$TMP/gh.tar.gz" -C "$TMP"
  GH_BIN=$(find "$TMP" -name gh -type f | head -1)
  mkdir -p "$HOME/.local/bin"
  cp "$GH_BIN" "$HOME/.local/bin/gh"
  chmod +x "$HOME/.local/bin/gh"
  export PATH="$HOME/.local/bin:$PATH"
  rm -rf "$TMP"
fi

if ! gh auth status &>/dev/null; then
  echo ""
  echo "Sign in to GitHub (browser will open):"
  gh auth login -h github.com -p https -w
fi

git add -A
git status

if ! git diff --cached --quiet 2>/dev/null || [ -z "$(git log -1 2>/dev/null)" ]; then
  git commit -m "$(cat <<'EOF'
Initial commit: conference registration and membership portal.

Includes event registration with QR codes, payment verification, certificates, and membership management.
EOF
)" || true
fi

if ! git remote get-url origin &>/dev/null; then
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
else
  git push -u origin main
fi

echo ""
echo "Done! Repository:"
gh repo view --web 2>/dev/null || git remote get-url origin
