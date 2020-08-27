const AuthService = require('modules/users/services/AuthService');

module.exports = async (ctx, next) => {
  const { header: { authorization } = {} } = ctx;
  let jwtToken;
  let userData;
  if (ctx.session && ctx.session.user && ctx.session.user.id) {
    return next();
  } else if (authorization) {
    jwtToken = AuthService.parseAuthorizationToken('Bearer', authorization);
    console.log(jwtToken);
    if (jwtToken) {
      userData = AuthService.verifyUserJwt(jwtToken);
      console.log(userData);
    }
  }
  return ctx.throw(401, 'Not Authorized');
};
