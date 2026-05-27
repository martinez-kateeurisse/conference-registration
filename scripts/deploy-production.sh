#!/bin/bash
# Deploy to Vercel + Neon (interactive — sign in when browser opens).
set -e
cd "$(dirname "$0")/.."
PROJECT="$(pwd)"
export PATH="$PROJECT/.tools/node/bin:$HOME/.local/bin:$PATH"

echo "=== Conference Portal — Production Deploy ==="
echo ""

# Vercel CLI
if ! command -v vercel &>/dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel@latest
fi

if ! vercel whoami &>/dev/null; then
  echo "Sign in to Vercel (browser will open):"
  vercel login
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  STEP 1 — Neon database (free)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1. Open: https://console.neon.tech/app/projects"
echo "  2. Create project → name: conference-registration"
echo "  3. Copy the connection string (PostgreSQL)"
echo "     It looks like: postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
echo ""
read -r -p "Paste your Neon DATABASE_URL here: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is required."
  exit 1
fi

AUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)

echo ""
echo "Deploying to Vercel..."
vercel link --yes 2>/dev/null || vercel link

vercel env add DATABASE_URL production <<< "$DATABASE_URL" 2>/dev/null || \
  echo "$DATABASE_URL" | vercel env add DATABASE_URL production

vercel env add AUTH_SECRET production <<< "$AUTH_SECRET" 2>/dev/null || \
  echo "$AUTH_SECRET" | vercel env add AUTH_SECRET production

# Set after first deploy URL is known — placeholder updated below
echo "https://conference-registration.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production 2>/dev/null || true

echo ""
vercel --prod

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  After deploy: set NEXT_PUBLIC_APP_URL to your real URL"
echo "  Vercel Dashboard → Project → Settings → Environment Variables"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
