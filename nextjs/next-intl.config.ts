/** @type {import('next-intl').NextIntlConfig} */
module.exports = {
  locales: ['ja', 'en'],     // add 'zh' etc. when ready
  defaultLocale: 'ja',
  messages: {
    ja: () => import('./messages/ja.json'),
    en: () => import('./messages/en.json')
  }
};
