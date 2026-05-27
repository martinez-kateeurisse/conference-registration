# Put your website online (free)

**Live stack:** [Neon](https://neon.tech) database + [Vercel](https://vercel.com) hosting  
**Your repo:** https://github.com/zeuswae/conference-registration

---

## Fastest path (~10 minutes)

### 1. Create free database (Neon)

1. Open **https://console.neon.tech** → sign in (GitHub is fine).
2. **New Project** → name: `conference-registration` → Create.
3. On the project dashboard, copy **Connection string** → **Prisma**.
   - Example: `postgresql://neondb_owner:xxxx@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 2. Deploy on Vercel

1. Open **https://vercel.com/new**
2. **Import** `zeuswae/conference-registration` from GitHub.
3. Before clicking Deploy, open **Environment Variables** and add:

| Name | Value |
|------|--------|
| `DATABASE_URL` | *(paste Neon connection string)* |
| `AUTH_SECRET` | Run in Terminal: `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR-PROJECT.vercel.app` *(update after first deploy if URL differs)* |

4. Click **Deploy** (wait ~2–3 min).

5. After deploy, copy your real URL (e.g. `https://conference-registration-xxx.vercel.app`).
   - Go to **Settings → Environment Variables** → edit `NEXT_PUBLIC_APP_URL` to that URL → **Redeploy**.

### 3. Done

Your public link is the Vercel URL. Share it with users.

**Admin login:** `admin@conference.local` / `admin12345`  
*(Change these in production via Neon SQL or add a new admin user.)*

---

## One-command deploy (Terminal)

If you have a Neon connection string ready:

```bash
cd /Users/shu/conference-registration
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails on Prisma | Ensure `DATABASE_URL` uses `?sslmode=require` |
| Login works locally but not online | Set `NEXT_PUBLIC_APP_URL` to exact Vercel URL and redeploy |
| Empty events list | Redeploy once — seed runs on build |
