const UsersService = require('modules/users/services/UsersService');
const SettingsService = require('modules/settings/services/SettingsService');

module.exports = async (ctx, next) => {
  const adminAllowedIpList = await SettingsService.get('adminAllowedIpList', true);
  const adminAllowedIpListArray = SettingsService.splitValue(adminAllowedIpList);
  const userIp = UsersService.getUserIp(ctx);
  if (!userIp || adminAllowedIpListArray.indexOf(userIp) === -1) {
    return ctx.throw(404, 'Not Found');
  }
  return next();
};
