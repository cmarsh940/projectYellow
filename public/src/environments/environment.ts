// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // BRAINTREE
  braintreeKey: 'sandbox_yddk3k3z_7ztv22wfy86bsspy',

  // FACEBOOK
  facebookId: '2287097054898932',
  facebookVersion: 'v3.2',

  // GOOGLE
  clientId: '312754153788-acm4ot95aftnmc568nj6mg23fjfq01vh.apps.googleusercontent.com',

  // REDIRECTS
  redirectUrl: 'http://localhost:8000/login',
  redirectLoginUrl: 'http://localhost:8000/dashboard',
  redirect404: 'http://localhost:8000/404error'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
