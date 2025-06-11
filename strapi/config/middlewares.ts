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
        /^https?:\/\/.*\.vercel\.app$/,
        env('FRONTEND_URL', 'https://your-domain.com'),
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'Accept-Language',
      ],
      credentials: true,
    },
  },

  /* --- the rest of the default stack --- */
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
