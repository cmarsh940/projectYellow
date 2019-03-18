// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  isServer: false,
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

  // TWITTER
  consumerKey: 'CKDbr4b6teVlJG32KmEiN1zf',
  consumerSecret: 'z0E9jRzgYEK0tJa4XZCC61ED1MKVPB4i8ow0vzQyP0MYfpbJXp',
  
  // REDIRECTS
  redirectUrl: 'http://localhost:4000/login',
  redirectLoginUrl: 'http://localhost:4000/dashboard',
  redirect404: 'http://localhost:8000/404error',
  host: 'http://localhost:4000',
};
