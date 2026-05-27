# Conference & Membership Registration Portal

Full-stack portal for **research conferences, conventions, and forums** — inspired by modern sign-in/sign-up modal UI (split gradient hero + clean form card).

## Features

| Requirement | Implementation |
|-------------|----------------|
| **a. Early registration + unique QR** | `/dashboard/events` → Early registration → instant QR image |
| **b. Payment confirmation** | Bank / E-Wallet upload with date, txn #, amount, payment for, payee name; admin approves in `/admin` |
| **c. Event certificates** | Participation, Appearance, Recognition, Presentation (with presenter + paper title) |
| **d. Membership certificates** | Institutional (company/university), Lifetime, Individual (professional/student), Mechatronics (engineer/specialist/technician), payment, database, renewal emails |

## Recommended free database: **Neon** (PostgreSQL)

- Free tier: https://neon.tech  
- Serverless PostgreSQL, works with Vercel/Railway/Render  
- Alternative: **Supabase** (also PostgreSQL + free tier)

## Tech stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS  
- **Prisma** ORM + **PostgreSQL**  
- JWT session cookies  
- QR codes via `qrcode`  
- Optional email: **Resend** free tier for renewal notifications  

## Quick start (local)

### 1. Prerequisites

- Node.js 20+  
- npm  

### 2. Install Node.js (required)

If you see `command not found: npm`, install Node from **https://nodejs.org** (LTS), then **quit and reopen Terminal**.

See **SETUP-MAC.md** for detailed Mac steps.

### 3. Install & configure

```bash
cd /Users/shu/conference-registration
```

A `.env` file is already included for local SQLite. To customize, edit `.env` in Cursor (do not paste env lines into the terminal).

### 4. Database setup

```bash
npm install
npx prisma db push
npm run db:seed
```

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000

### Demo accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@conference.local` | `admin12345` |
| User | `participant@conference.local` | `user12345` |

## Deploy (production)

### Database (Neon)

1. Create project at https://neon.tech  
2. Copy connection string → `DATABASE_URL`  
3. Run `npx prisma db push` locally against Neon, or use Neon SQL editor after deploy  

### App (Vercel — free hobby tier)

1. Push repo to GitHub  
2. Import in https://vercel.com  
3. Set environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app`
   - Optional: `RESEND_API_KEY`, `EMAIL_FROM`
4. Deploy  

Build command: `npm run build`  
Install command: `npm install` (runs `prisma generate` via postinstall)

### Other hosts

- **Railway** / **Render**: connect same `DATABASE_URL` + env vars  
- Run migrations: `npx prisma db push`  

## Project structure

```
src/
  app/           # Pages & API routes
  components/    # Auth modal, forms, admin panel
  lib/           # Auth, Prisma, QR, email, constants
prisma/
  schema.prisma  # Full data model
  seed.ts        # Demo users + sample event
```

## Admin workflow

1. User submits payment with proof → status `PAYMENT_SUBMITTED`  
2. Admin opens `/admin` → Approve → registration `APPROVED`, QR active  
3. Certificate requests → Approve → Issue  
4. **Send renewal notifications** → emails members expiring within 30 days  

## Security notes

- Change demo passwords before production  
- Use strong `AUTH_SECRET`  
- Payment proofs stored in DB (consider S3/Blob storage for large scale)  
- HTTPS required in production (Vercel provides this)  

## License

MIT — use freely for your organization.
