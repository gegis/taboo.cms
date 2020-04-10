const { config } = require('@taboo/cms-core');
const { api: { authorization: { type: { apiKeyName } = {} } = {} } = {} } = config;
const UserModel = require('modules/users/models/UserModel');

// TODO move this to core module
const parseAuthorizationToken = (type, value) => {
  let token = null;
  if (value) {
    const parts = value.split(' ');
    if (parts[0] === type) {
      token = parts[1];
    }
  }
  return token;
};

module.exports = async (ctx, next) => {
  const { authorization } = ctx.header;
  if (!authorization) {
    return ctx.throw(401, 'Authorization token not found found');
  }
  const token = parseAuthorizationToken(apiKeyName, authorization);
  if (!token) {
    return ctx.throw(401, 'ApiKey token not found');
  }
  const user = await UserModel.findOne({ apiKey: token });
  if (!user) {
    return ctx.throw(403, 'Not Authorized');
  }
  console.log(token);
  console.log(user);
  // TODO - if route has acl to be checked as well!!!! - get user acl and check
  // if (ctx.taboo.aclResource) {
  //   // if return value is undefined - it means acl is not enabled / implemented
  //   if (isAllowed(ctx, ctx.taboo.aclResource) === false) {
  //     return ctx.throw(403, 'Forbidden');
  //   }
  // }
  return next();
};
