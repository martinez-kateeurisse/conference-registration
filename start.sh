#!/bin/bash
# One-command launcher — installs Node (if needed), deps, DB, and starts the site.
set -e
cd "$(dirname "$0")"
PROJECT="$(pwd)"

NODE_VERSION="v22.16.0"
ARCH="darwin-arm64"
NODE_DIR="$PROJECT/.tools/node"
export PATH="$NODE_DIR/bin:$PATH"

install_node() {
  echo "⬇️  Downloading Node.js (one-time, ~50MB)..."
  mkdir -p "$PROJECT/.tools"
  cd "$PROJECT/.tools"
  TARBALL="node-${NODE_VERSION}-${ARCH}.tar.gz"
  curl -fsSL "https://nodejs.org/dist/${NODE_VERSION}/${TARBALL}" -o "$TARBALL"
  tar -xzf "$TARBALL"
  rm -rf "$NODE_DIR"
  mv "node-${NODE_VERSION}-${ARCH}" "$NODE_DIR"
  rm -f "$TARBALL"
  cd "$PROJECT"
  echo "✅ Node installed: $($NODE_DIR/bin/node -v)"
}

if [ ! -x "$NODE_DIR/bin/npm" ]; then
  install_node
fi

if [ ! -d "node_modules/next" ]; then
  echo "📦 Installing dependencies (first run only)..."
  npm install
fi

if [ ! -f "prisma/dev.db" ]; then
  echo "🗄️  Creating database..."
  npx prisma db push
  npm run db:seed 2>/dev/null || node prisma/seed.mjs
fi

echo ""
echo "🚀 Starting website at http://localhost:3000"
echo "   Admin:  admin@conference.local / admin12345"
echo "   User:   participant@conference.local / user12345"
echo "   Press Ctrl+C to stop."
echo ""

# Open browser on macOS
(sleep 2 && open "http://localhost:3000") 2>/dev/null &

npm run dev
