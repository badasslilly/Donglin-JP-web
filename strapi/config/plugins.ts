export default ({ env }) => ({
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'no-reply@yourdomain.tld'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'no-reply@yourdomain.tld'),
        testAddress: env('EMAIL_TEST', 'dev@yourdomain.tld'),
      },
    },
  },
})
