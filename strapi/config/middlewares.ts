/**
 * ./config/middlewares.ts
 * Execution order matters – Strapi loads the items top-to-bottom :contentReference[oaicite:0]{index=0}
 */
import { env } from '@strapi/utils';

export default [
  /* --- core & error handling --- */
  'strapi::logger',
  'strapi::errors',

  /* --- security headers --- */
  'strapi::security',

  /* --- CORS (customised) --- */
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      /**
       *  Allow:
       *  - local dev  → http://localhost:3000
       *  - Vercel     → any *.vercel.app preview
       *  - prod site  → https://your-domain.com  (set in ENV)
       *
       *  Tip: keep this tight in production.
       */
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://jp.donglin.org',         // (same-origin calls if any)
        // add other dev hosts if you use them
      ],
      headers: '*',
      methods: '*',
      credentials: true,                  // set false if you don't use cookies/auth
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
