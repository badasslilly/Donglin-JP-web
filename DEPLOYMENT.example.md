# Deployment Example

This is a public-safe deployment example for the Donglin JP website. It intentionally uses placeholder paths, process names, and environment values.

Production-specific credentials, server IPs, database passwords, API tokens, and private handoff notes should be shared outside the public repository.

## Architecture

```text
Internet
  |
Reverse proxy, such as Nginx or Cloudflare Tunnel
  |
  |-- Frontend: Next.js on 127.0.0.1:3000
  |
  |-- Backend: Strapi on 127.0.0.1:1337
```

Recommended PM2 process names:

- `donglin-nextjs`
- `donglin-strapi`

## Requirements

- Node.js compatible with both applications. Strapi 5 supports Node.js `>=18.0.0 <=22.x.x`.
- npm or pnpm, matching your server workflow.
- PM2 installed on the server.
- A reverse proxy with HTTPS configured.
- A production database for Strapi.
- A secure place for environment variables.

## Environment Files

Create environment files on the server. Do not commit real values.

### `nextjs/.env.local`

```dotenv
NEXT_PUBLIC_STRAPI_URL=https://example.com
STRAPI_INTERNAL_URL=http://127.0.0.1:1337
STRAPI_TOKEN=replace-with-read-only-strapi-api-token

NEXT_PUBLIC_HERO_HLS=/videos/hero/master.m3u8
NEXT_PUBLIC_HERO_POSTER=/videos/home-hero-poster.jpg

ANALYTICS_DATABASE_URL=postgres://user:password@host:5432/database
IP_HASH_SALT=replace-with-random-string

RESEND_API_KEY=replace-if-using-resend
RESEND_FROM=no-reply@example.com
MAIL_TO_ADMIN=admin@example.com

ENABLE_MAXMIND_WS=0
MAXMIND_ACCOUNT_ID=
MAXMIND_LICENSE_KEY=
```

### `strapi/.env`

```dotenv
NODE_ENV=production
HOST=127.0.0.1
PORT=1337

STRAPI_URL=https://example.com
APP_KEYS=replace,with,random,keys
JWT_SECRET=replace-with-random-string
API_TOKEN_SALT=replace-with-random-string
ADMIN_JWT_SECRET=replace-with-random-string
TRANSFER_TOKEN_SALT=replace-with-random-string
ENCRYPTION_KEY=replace-with-random-string

DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=replace-with-password
DATABASE_SCHEMA=public

SENDGRID_API_KEY=replace-if-using-sendgrid
EMAIL_FROM=no-reply@example.com
EMAIL_REPLY_TO=no-reply@example.com
EMAIL_TEST=dev@example.com

STRAPI_FORM_SECRET=replace-with-random-string
TEMPLE_INBOX=admin@example.com
MAIL_TO_ADMIN=admin@example.com
```

## First Deployment

Clone the repository:

```bash
git clone git@github.com:OWNER/REPO.git
cd REPO
```

Install, build, and start Strapi:

```bash
cd strapi
npm install
npm run build
pm2 start npm --name donglin-strapi -- start
```

Install, build, and start Next.js:

```bash
cd ../nextjs
npm install
npm run build
pm2 start npm --name donglin-nextjs -- start
```

Save PM2 state:

```bash
pm2 save
pm2 startup
```

## Update Deployment

```bash
cd /path/to/REPO
git pull
```

If Strapi code, content types, plugins, or backend config changed:

```bash
cd strapi
npm install
npm run build
pm2 restart donglin-strapi
```

If frontend code or static assets changed:

```bash
cd nextjs
npm install
npm run build
pm2 restart donglin-nextjs
```

## Reverse Proxy Notes

Example routing:

```text
/          -> http://127.0.0.1:3000
/api       -> http://127.0.0.1:1337 or http://127.0.0.1:3000 depending on route ownership
/admin     -> http://127.0.0.1:1337
/uploads   -> http://127.0.0.1:1337
```

Be careful with `/api` because both applications can define API routes:

- Next.js has app routes such as `/api/track`.
- Strapi has CMS routes under `/api/...`.

Use explicit proxy rules that match the production route ownership.

## Runtime Data To Back Up

Back up these before migrations, server moves, or major releases:

- Strapi database.
- `strapi/public/uploads/`.
- Production environment variables.
- Reverse proxy configuration.

PostgreSQL example:

```bash
pg_dump "$DATABASE_URL" > strapi-backup-YYYY-MM-DD.sql
```

Uploads example:

```bash
tar -czf uploads-YYYY-MM-DD.tar.gz strapi/public/uploads
```

## Health Checks

```bash
pm2 status
pm2 logs donglin-nextjs
pm2 logs donglin-strapi
```

Suggested browser checks after deploy:

- Public homepage loads over HTTPS.
- Strapi admin page loads and requires login.
- Images under `/uploads` load.
- Key pages in both Japanese and English load.
- Forms and email notifications work if enabled.
- Analytics or internal dashboards are protected.

## Public Repository Safety Checklist

- Do not commit `.env`, `.env.local`, database files, private keys, SQL dumps, or upload archives.
- Keep production-only handoff documents out of the public repository.
- Use placeholder values in examples.
- Protect internal dashboards and public write endpoints.
- Confirm media, fonts, audio, and video assets are allowed to be distributed publicly.
