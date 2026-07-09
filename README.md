# Donglin JP Website

Official multilingual website for Donglin Monastery's Japanese-facing presence.

Website: [https://jp.donglin.org](https://jp.donglin.org)

<img
  src="./docs/preview.jpg?raw=true"
  alt="Donglin JP website preview"
  width="760"
/>

## Overview

This repository contains a two-part web application:

- `nextjs/` - public website built with Next.js, React, TypeScript, Tailwind CSS, and next-intl.
- `strapi/` - Strapi CMS used to manage pages, navigation, news, events, offerings, people, media, and site-wide content.

The production deployment runs the frontend and backend as separate PM2 processes behind a reverse proxy.

## Main Sections

- Annual events and visitor experiences
- Offering item information
- Temple history, architecture, patriarchs, and Japan-related content
- Highlights, scenic spots, exhibitions, and cultural pages
- News and contact pages

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS |
| Internationalization | next-intl |
| CMS | Strapi 5 |
| Runtime | Node.js |
| Process manager | PM2 |
| Database | Configurable through Strapi, commonly PostgreSQL in production |

## Repository Structure

```text
.
├── nextjs/                  # Frontend application
│   ├── src/app/             # App Router pages and API routes
│   ├── src/components/      # UI and page components
│   ├── src/i18n/            # Locale routing and dictionaries
│   ├── src/lib/             # Strapi client and shared utilities
│   └── public/              # Static assets
├── strapi/                  # Strapi CMS application
│   ├── config/              # Server, database, middleware, plugin config
│   ├── src/api/             # Content types, controllers, routes, services
│   └── public/uploads/      # Runtime uploads, ignored except .gitkeep
├── docs/
│   ├── preview.gif          # Public website preview for README
│   └── preview.jpg          # Static fallback screenshot
└── DEPLOYMENT.example.md    # Public deployment example
```

## Local Development

Frontend:

```bash
cd nextjs
npm install
npm run dev
```

Strapi:

```bash
cd strapi
npm install
npm run develop
```

Create local environment files from your deployment or from example values before running the applications:

- `nextjs/.env.local`
- `strapi/.env`

Do not commit real environment files, database dumps, private keys, API tokens, or production upload archives.

## Deployment

See [DEPLOYMENT.example.md](DEPLOYMENT.example.md) for a public-safe PM2 deployment example.

The private handoff document with production-specific values, account notes, and operational details should be shared outside the public repository.

## Security Notes

- Keep Strapi API tokens read-only unless write access is explicitly needed.
- Protect operational dashboards such as analytics pages with application auth, reverse-proxy auth, or a private network rule.
- Add rate limiting or bot protection to public write endpoints.
- Store secrets in server environment variables, not in Git.
- Review media, fonts, and audio licensing before redistributing assets publicly.
