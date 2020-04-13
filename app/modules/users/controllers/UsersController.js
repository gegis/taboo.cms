const { config } = require('@taboo/cms-core');
const validator = require('validator');
const CountriesService = require('modules/countries/services/CountriesService');
const UsersService = require('modules/users/services/UsersService');
const CoreHelper = require('modules/core/helpers/CoreHelper');
const UserModel = require('modules/users/models/UserModel');

class UsersController {
  constructor() {}

  async userLandingPage() {}
  async signUp() {}
  async signIn() {}
  async resetPassword() {}
  async changePassword() {}
  async myProfile(ctx) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    let user, countryOptions;
    try {
      user = await UserModel.findById(userId).populate([
        'documentPersonal1',
        'documentPersonal2',
        'documentIncorporation',
        'profilePicture',
      ]);
      countryOptions = CountriesService.getKeyValueArray();
    } catch (e) {
      ctx.throw(404, e);
    }
    ctx.view.userData = user;
    ctx.view.countryOptions = countryOptions;
  }

  async accountVerify(ctx) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    let user;
    try {
      user = await UserModel.findById(userId).populate([
        'documentPersonal1',
        'documentPersonal2',
        'documentIncorporation',
        'profilePicture',
      ]);
    } catch (e) {
      ctx.throw(404, e);
    }
    ctx.view.userData = user;
  }

  async register(ctx) {
    const { users: { signUpEnabled = false } = {} } = config;
    const { body: data = {} } = ctx.request;
    const validationError = UsersService.validateUserRegisterFields(data);
    let user;

    if (!signUpEnabled) {
      return ctx.throw(403, 'Forbidden');
    }

    if (validationError) {
      return ctx.throw(400, validationError);
    }

    try {
      user = await UsersService.registerNewUser(data);
    } catch (err) {
      return ctx.throw(400, err);
    }

    ctx.body = user;
  }

  /**
   * @api {post} /api/login User Login
   * @apiGroup User
   * @apiParam {string} email User email
   * @apiParam {string} password User password
   * @apiParamExample {json} Request Example:
   * {
   *   "email": "admin@admin.admin",
   *   "password": "admin"
   * }
   * @apiSuccessExample {json} Success Response:
   * HTTP/1.1 200 OK
   * {
   *   "id": "5dd47dc99deb4f256dfcad54",
   *   "firstName": "Name",
   *   "lastName": "Surname",
   *   "email": "admin@admin.admin",
   *   "verified": true,
   *   "admin": true,
   *   "active": true,
   *   "profilePictureUrl": "/secure-files/5ddeab9e2054481c8b8a680a",
   *   "roles": [
   *     "5dd47db6dcb439238bd29ee5"
   *   ],
   *   "acl": [
   *     "admin.acl.manage",
   *     "admin.acl.view",
   *     "admin.cache.clear",
   *     "admin.dashboard",
   *     "admin.galleries.manage",
   *     "admin.galleries.view",
   *     "admin.logs.api.manage",
   *     "admin.logs.api.view",
   *     "admin.navigation.manage",
   *     "admin.navigation.view",
   *     "admin.pages.manage",
   *     "admin.pages.view",
   *     "admin.settings.manage",
   *     "admin.settings.view",
   *     "admin.uploads.manage",
   *     "admin.uploads.view",
   *     "admin.users.manage",
   *     "admin.users.view",
   *     "api.uploads.userFiles"
   *   ]
   * }
   * @apiErrorExample {json} Error Response:
   *   HTTP/1.1 404 Not Found
   *   {
   *   "error": {
   *       "message": "User not found"
   *     },
   *     "message": "User not found"
   *   }
   */
  async login(ctx) {
    const { users: { signInEnabled = false } = {} } = config;
    const { body: { email = null, password = null } = {} } = ctx.request;
    if (!signInEnabled) {
      return ctx.throw(403, 'Forbidden');
    }
    ctx.body = await UsersService.authenticateUser(ctx, email, password);
  }

  /**
   * @api {get} /api/logout User Logout
   * @apiGroup User
   * @apiSuccessExample {json} Success Response:
   * HTTP/1.1 200 OK
   * {
   *    "success": true
   * }
   */
  async logout(ctx) {
    ctx.body = {
      success: await UsersService.logoutUser(ctx),
    };
  }

  /**
   * @api {post} /api/reset-password User password init request
   * @apiGroup User
   * @apiParam {string} email User email
   * @apiParam {string} linkPrefix Main url prefix for user to be redirected
   * @apiSuccessExample {json} Success Response:
   * HTTP/1.1 200 OK
   * {
   *    "success": true
   * }
   */
  async resetPasswordApi(ctx) {
    const { users: { signInEnabled = false } = {} } = config;
    const { body: { email = null, linkPrefix = '' } = {} } = ctx.request;
    if (!signInEnabled) {
      return ctx.throw(403, 'Forbidden');
    }
    ctx.body = {
      success: await UsersService.resetPassword(ctx, email, linkPrefix),
    };
  }

  async changePasswordApi(ctx) {
    const { users: { signInEnabled = false } = {} } = config;
    const { body = null } = ctx.request;
    let success;
    if (!signInEnabled) {
      return ctx.throw(403, 'Forbidden');
    }
    success = await UsersService.changePassword(ctx, body);
    ctx.body = { success };
  }

  async getAuth(ctx) {
    const authUser = ctx.session.user || {};
    ctx.body = authUser;
  }

  async getCurrent(ctx) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    let user;
    try {
      user = await UserModel.findById(userId).populate([
        'documentPersonal1',
        'documentPersonal2',
        'documentIncorporation',
        'profilePicture',
      ]);
    } catch (e) {
      ctx.throw(404, e);
    }
    ctx.body = user;
  }

  async updateCurrent(ctx) {
    const { body = {} } = ctx.request;
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    let user;
    try {
      if (Object.prototype.hasOwnProperty.call(body, 'id')) {
        delete body._id;
      }
      if (body.newPassword) {
        body.password = await UsersService.hashPassword(body.newPassword);
      } else if (Object.prototype.hasOwnProperty.call(body, 'password')) {
        delete body.password;
      }
      user = await UserModel.findByIdAndUpdate(userId, body, { new: true }).populate([
        'documentPersonal1',
        'documentPersonal2',
        'documentIncorporation',
        'profilePicture',
      ]);
      ctx.session.user.firstName = user.firstName;
      ctx.session.user.lastName = user.lastName;
      ctx.session.user.email = user.email;
      if (user.profilePicture && user.profilePicture.url) {
        ctx.session.user.profilePictureUrl = user.profilePicture.url;
      }
    } catch (e) {
      ctx.throw(404, e);
    }
    ctx.body = user;
  }

  async searchUser(ctx) {
    const { request: { body: { email = null } = {} } = {} } = ctx;
    const escapeValue = CoreHelper.escapeFormValue;
    const isEmail = validator.isEmail(email);
    let profilePictureUrl = null;
    let user;
    let userToReturn;

    if (!email) {
      return ctx.throw(400, 'Email Address not provided');
    }
    if (!isEmail) {
      return ctx.throw(400, 'Email Address is not valid');
    }
    if (isEmail) {
      user = await UserModel.findOne({ email: escapeValue(email) }).populate('profilePicture');
      if (!user) {
        return ctx.throw(404, 'User Not Found');
      }
    }

    if (user.profilePicture && user.profilePicture.url) {
      profilePictureUrl = user.profilePicture.url;
    }

    userToReturn = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePictureUrl: profilePictureUrl,
    };

    ctx.body = userToReturn;
  }
}

module.exports = new UsersController();
