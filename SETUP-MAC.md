# Fix: "command not found: npm"

Your Mac does not have **Node.js** installed yet. This app needs Node.js to run `npm`.

## Step 1 — Install Node.js (one time)

1. Open in your browser: **https://nodejs.org**
2. Download the **LTS** version for macOS (the green button).
3. Open the downloaded `.pkg` file and install (Next → Next → Install).
4. **Quit Terminal completely** (Terminal menu → Quit Terminal), then open Terminal again.

Check it worked:

```bash
node -v
npm -v
```

You should see version numbers (e.g. `v22.x.x` and `10.x.x`).  
If you still see `command not found`, restart your Mac and try again.

---

## Step 2 — Do NOT type env vars in the terminal

Environment variables belong in the file **`.env`**, not as shell commands.

The project already includes a working `.env` for local testing with SQLite (no Neon account required).

If you need to edit it:

```bash
cd /Users/shu/conference-registration
open -e .env
```

Or open the folder in **Cursor** and edit `.env` there.

---

## Step 3 — Install and run the app

Copy and paste these commands **one block at a time**:

```bash
cd /Users/shu/conference-registration
```

```bash
npm install
```

```bash
npx prisma db push
```

```bash
npm run db:seed
```

```bash
npm run dev
```

Then open: **http://localhost:3000**

### Demo login

| Email | Password |
|-------|----------|
| admin@conference.local | admin12345 |
| participant@conference.local | user12345 |

---

## Later: use free PostgreSQL (Neon) for production

1. Create a database at https://neon.tech  
2. Copy the connection string  
3. In `.env`, set:
   ```env
   DATABASE_URL="postgresql://..."
   ```
4. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`  
5. Run `npx prisma db push` again  

---

## Still stuck?

Run this and send the output:

```bash
node -v; npm -v; pwd; ls package.json
```
