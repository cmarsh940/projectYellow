export const environment = {
  production: true,
  isServer: true,
  // for prerender
  // BRAINTREE
  braintreeKey: 'sandbox_yddk3k3z_7ztv22wfy86bsspy',
  checkoutUrl: 'http://localhost:8000/api/braintree/createpurchase',
  paymentTokenUrl: 'http://localhost:8000/api/braintree/getclienttoken',
  updatePurchaseUrl: 'http://localhost:8000/api/braintree/getclienttoken',

  // FACEBOOK
  facebookId: '2287097054898932',
  facebookVersion: 'v3.2',

  // GOOGLE
  clientId: '312754153788-acm4ot95aftnmc568nj6mg23fjfq01vh.apps.googleusercontent.com',

  // REDIRECTS
  redirectUrl: 'http://localhost:4000/login',
  redirectLoginUrl: 'http://localhost:4000/dashboard',
  redirect404: 'http://localhost:4000/404error',

  host: 'http://localhost:8000',
};