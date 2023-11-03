const Auth = {
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_APPLICATION_CLIENT_ID,
  cookieStorage: {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    path: '/',
    expires: 365,
    secure: true,
    sameSite: 'strict',
  },
  authenticationFlowType: 'USER_SRP_AUTH',
  oauth: {
    domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNIN_URI,
    redirectSignOut: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNOUT_URI,
    clientId: process.env.NEXT_PUBLIC_COGNITO_APPLICATION_CLIENT_ID,
    responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
  },
};

export default Auth;