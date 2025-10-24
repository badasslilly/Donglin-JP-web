export default ({ env }) => ({
  url: env('STRAPI_URL', 'https://jp.donglin.org'), 
  proxy: true,
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
