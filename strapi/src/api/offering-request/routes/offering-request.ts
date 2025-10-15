// strapi/src/api/offering-request/routes/custom-offering-request.ts
export default {
  routes: [
    {
      method: 'POST',
      path: '/offering-request/submit',
      handler: 'offering-request.submit',
      config: {
        auth: false, // bypass standard auth
      },
    },
  ],
}
