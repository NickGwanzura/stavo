# TSM Mobiles

Single-owner inventory, sales, purchasing, expenses, reservations, invoicing, and reporting for TSM Mobiles.

## Local setup

1. Copy `.env.example` to `.env.local` and replace every placeholder secret.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Run `npm ci`, `npx prisma migrate deploy`, and `npm run dev`.
4. Open `/auth/setup` once and enter `OWNER_SETUP_TOKEN` to provision the owner.
5. Sign in at `/auth/login`. Public email signup is disabled.

## Production environment

Required variables:

- `DATABASE_URL` and `DIRECT_URL`
- `BETTER_AUTH_SECRET` (random, at least 32 characters)
- `BETTER_AUTH_URL=https://tsmmobile.store`
- `NEXT_PUBLIC_APP_URL=https://tsmmobile.store`
- `OWNER_SETUP_TOKEN` (a separate random one-time token)

After owner provisioning, rotate or remove `OWNER_SETUP_TOKEN`. The setup action also refuses to create a second user.

The container applies Prisma migrations before startup and exposes `/api/health` for orchestration health checks.

## Verification

```bash
npm test
npm run lint
npm run build
npm audit --omit=dev
```
