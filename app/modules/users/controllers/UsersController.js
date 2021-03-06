const { config, logger } = require('@taboo/cms-core');
const validator = require('validator');

const CountriesService = require('modules/countries/services/CountriesService');
const UsersService = require('modules/users/services/UsersService');
const SettingsService = require('modules/settings/services/SettingsService');
const CoreHelper = require('modules/core/helpers/CoreHelper');
const AuthService = require('modules/users/services/AuthService');
const UserValidationHelper = require('modules/users/helpers/UserValidationHelper');
const UserModel = require('modules/users/models/UserModel');

class UsersController {
  constructor() {
    AuthService.setup({ usersService: UsersService });
  }

  async userLandingPage() {}
  async signUp() {}
  async signIn() {}
  async resetPassword() {}
  async changePassword() {}
  async accountSettings(ctx) {
    const currentUser = await UsersService.getCurrentUser(ctx);
    let user, countryOptions;
    try {
      user = await UsersService.getUserDataById(currentUser.id, { loadAcl: true, populateDocs: true });
      countryOptions = CountriesService.getAllArray();
    } catch (e) {
      ctx.throw(404, e);
    }
    ctx.viewParams.userData = user;
    ctx.viewParams.countryOptions = countryOptions;
  }

  /**
   * Verifies user's email (accountVerification link landing page for new account registration)
   */
  async verifyEmail(ctx) {
    const { userId, token } = ctx.params;
    const verifyAccountRedirectSuccess = await SettingsService.get('verifyEmailRedirectSuccess');
    const verifyAccountRedirectError = await SettingsService.get('verifyEmailRedirectError');
    let result = {
      user: null,
      success: false,
    };
    try {
      result = await UsersService.verifyEmail(ctx, userId, token);
    } catch (e) {
      logger.error(e);
      result.success = false;
      ctx.throw(404, e);
    }

    if (result.success && verifyAccountRedirectSuccess) {
      ctx.redirect(verifyAccountRedirectSuccess.value);
    } else if (verifyAccountRedirectError) {
      ctx.redirect(verifyAccountRedirectError.value);
    }
    ctx.viewParams.user = result.user;
    ctx.viewParams.success = result.success;
  }

  /**
   * Landing page for user documents verification
   */
  async verifyDocs(ctx) {
    try {
      ctx.viewParams.userData = await UsersService.getCurrentUser(ctx);
    } catch (e) {
      ctx.throw(404, e);
    }
  }

  /**
   * @api {post} /api/users/register User Register
   * @apiName RegisterUser
   * @apiGroup User
   * @apiParam {string} firstName User firstName, required
   * @apiParam {string} lastName User lastName, required
   * @apiParam {string} email User email, required, is email
   * @apiParam {string} street User street, required
   * @apiParam {string} city User city, required
   * @apiParam {string} state User state, required
   * @apiParam {string} country User country, required
   * @apiParam {string} postCode User postCode, required
   * @apiParam {string} password User password, required, min 5 chars
   * @apiParamExample {json} Request Example:
   * {
   *   "firstName": "Foo",
   *   "lastName": "Bar",
   *   "email": "foo@bar.foo",
   *   "street": "Main st.",
   *   "city": "Manchester",
   *   "state": "North West",
   *   "country": "United Kingdom",
   *   "postCode": "WB14 1RE",
   *   "password": "pass1"
   * }
   * @apiSuccessExample {json} Success Response:
   * HTTP/1.1 200 OK
   * {
   *   "verified": false,
   *   "verificationStatus": "new",
   *   "admin": false,
   *   "loginAttempts": 0,
   *   "active": true,
   *   "roles": [
   *       "5dd9c1cb2792536b7f101823"
   *   ],
   *   "_id": "5e94eda397858d49e917ad9d",
   *   "firstName": "Foo",
   *   "lastName": "Bar",
   *   "email": "foo@bar.foo",
   *   "street": "Main st.",
   *   "city": "Manchester",
   *   "state": "North West",
   *   "country": "United Kingdom",
   *   "postCode": "WB14 1RE",
   *   "createdAt": "2020-04-13T22:54:27.824Z",
   *   "updatedAt": "2020-04-13T22:54:27.824Z",
   *   "__v": 0
   * }
   * @apiErrorExample {json} Password Error Response:
   *  HTTP/1.1 400 Bad Request
   *  {
   *    "error": {
   *        "message": "Bad Request",
   *        "validationMessage": "Invalid Data",
   *        "validationErrors": [
   *            {
   *                "field": "password",
   *                "message": "Password must be at least 5 characters long"
   *            }
   *        ]
   *    },
   *    "message": "Bad Request"
   *  }
   * @apiErrorExample {json} Email Error Response:
   *  HTTP/1.1 400 Bad Request
   *  {
   *     "error": {
   *         "errors": {
   *             "email": {
   *                 "message": "is already taken",
   *                 "name": "ValidatorError",
   *                 "properties": {
   *                     "message": "is already taken",
   *                     "type": "unique",
   *                     "path": "email",
   *                     "value": "foo@bar.foo"
   *                 },
   *                 "kind": "unique",
   *                 "path": "email",
   *                 "value": "foo@bar.foo"
   *             }
   *         },
   *         "_message": "User validation failed",
   *         "message": "User validation failed: email: is already taken",
   *         "name": "ValidationError",
   *         "expose": true,
   *         "statusCode": 400,
   *         "status": 400
   *     },
   *     "message": "User validation failed: email: is already taken"
   *  }
   */
  async register(ctx) {
    const { users: { signUpEnabled = false } = {} } = config;
    const { body: data = {} } = ctx.request;
    let validationErrors;
    let user;

    if (!signUpEnabled) {
      return ctx.throw(403, 'Forbidden');
    }
    validationErrors = UserValidationHelper.validateUserRegisterFields(data);
    if (validationErrors) {
      return ctx.throw(400, validationErrors);
    }
    try {
      await UsersService.validateUniqueApiKey(ctx, data);
      user = await UsersService.registerNewUser(ctx, data);
    } catch (err) {
      return ctx.throw(400, err);
    }

    ctx.body = user;
  }

  /**
   * @api {post} /api/login User Login
   * @apiName LoginUser
   * @apiGroup User
   * @apiParam {string} email User email
   * @apiParam {string} password User password
   * @apiParamExample {json} Request Example:
   * {
   *   "email": "foo@bar.bar",
   *   "password": "pass1"
   * }
   * @apiSuccessExample {json} Success Response:
   * HTTP/1.1 200 OK
   * {
   *   "id": "5e94eda397858d49e917ad9d",
   *   "firstName": "Foo",
   *   "lastName": "Bar",
   *   "email": "foo@bar.foo",
   *   "verified": true,
   *   "admin": true,
   *   "active": true,
   *   "profilePictureUrl": "/user-files/5ddeab9e2054481c8b8a680a",
   *   "roles": [
   *     "5dd47db6dcb439238bd29ee5"
   *   ],
   *   "acl": [
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
    const { body: { email = null, password = null, rememberMe = false } = {} } = ctx.request;
    const user = await AuthService.authenticateUser(ctx, email, password);
    ctx.body = await UsersService.setUserSession(ctx, user, { rememberMe });
  }

  /**
   * @api {get} /api/logout User Logout
   * @apiName LogoutUser
   * @apiGroup User
   * @apiSuccessExample {json} Success Response:
   * HTTP/1.1 200 OK
   * {
   *    "success": true
   * }
   */
  async logout(ctx) {
    ctx.body = {
      success: await AuthService.logoutUser(ctx.session),
    };
  }

  async loginJwt(ctx) {
    const { body: { email = null, password = null, uid = null } = {} } = ctx.request;
    const user = await AuthService.authenticateUser(ctx, email, password);
    ctx.body = await AuthService.signUserJwt(user, uid);
  }

  async renewJwt(ctx) {
    const { body: { refreshToken = null, userId = null, uid = null } = {} } = ctx.request;
    ctx.body = await AuthService.renewUserJwt(refreshToken, userId, uid);
  }

  async logoutJwt(ctx) {
    const { header: { authorization } = {} } = ctx;
    const jwtToken = AuthService.parseAuthorizationToken('Bearer', authorization);
    const success = await AuthService.logoutUserJwt(jwtToken);
    ctx.body = { success };
  }

  /**
   * @api {post} /api/reset-password User Password Reset
   * @apiName ResetUserPassword
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
    const { body: { email = null, linkPrefix = '' } = {} } = ctx.request;
    ctx.body = {
      success: await UsersService.resetPassword(ctx, email, linkPrefix),
    };
  }

  /**
   * @api {post} /api/change-password User Password Change
   * @apiName ChangeUserPassword
   * @apiGroup User
   * @apiParam {string} userId User ID
   * @apiParam {string} newPass User new password
   * @apiParam {string} newPassRepeat User new password repeated
   * @apiParam {string} token User password reset token
   * @apiParam {string} newPass User new password
   * @apiSuccessExample {json} Success Response:
   * HTTP/1.1 200 OK
   * {
   *    "success": true
   * }
   */
  async changePasswordApi(ctx) {
    const { body = null } = ctx.request;
    let success;
    success = await UsersService.changePassword(ctx, body);
    ctx.body = { success };
  }

  async getAuth(ctx) {
    ctx.body = await UsersService.getCurrentUser(ctx);
  }

  async getCurrent(ctx) {
    ctx.body = await UsersService.getCurrentUser(ctx, { reload: true });
  }

  async updateCurrent(ctx) {
    const { body = {} } = ctx.request;
    const userFieldsToUpdate = ['country', 'email', 'firstName', 'lastName'];
    const userData = {};
    const currentUser = await UsersService.getCurrentUser(ctx);
    const validationError = UserValidationHelper.validateUserAccountFields(body);
    let user;
    try {
      if (validationError) {
        return ctx.throw(400, validationError);
      }
      await UsersService.validateUniqueApiKey(ctx, body, currentUser.id);
      userFieldsToUpdate.map(field => {
        if (Object.keys(body).indexOf(field) !== -1) {
          userData[field] = body[field];
        }
      });
      if (body.newPassword) {
        userData.password = await AuthService.hashPassword(body.newPassword);
      }
      user = await UserModel.findByIdAndUpdate(currentUser.id, userData, { new: true }).populate([
        'documentPersonal1',
        'documentPersonal2',
        'profilePicture',
      ]);
      await UsersService.updateUserSession(ctx, user, { updateCurrentSession: true });
      UsersService.socketsEmitUserChanges(user);
    } catch (e) {
      ctx.throw(400, e);
    }
    ctx.body = user;
  }

  async deactivateCurrent(ctx) {
    const user = await UsersService.getCurrentUser(ctx);
    if (!user) {
      ctx.throw(404, 'Not Found');
    }
    user.active = false;
    user.verificationNote = 'User requested deactivation!';
    await UsersService.saveUserData(user.id, user);
    await UsersService.sendUserDeactivationEmail(ctx, user);
    ctx.body = user;
  }

  async resendVerification(ctx) {
    const user = await UsersService.getCurrentUser(ctx);
    if (!user) {
      ctx.throw(404, 'Not Found');
    }
    ctx.body = await UsersService.sendUserVerificationEmail(ctx, user);
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
      user = await UsersService.getUserData({ email: escapeValue(email) }, { populateProfilePic: true });
      if (!user) {
        return ctx.throw(404, 'User Not Found');
      }
    }

    if (user.profilePicture && user.profilePicture.url) {
      profilePictureUrl = user.profilePicture.url;
    }

    userToReturn = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePictureUrl: profilePictureUrl,
    };

    ctx.body = userToReturn;
  }
}

module.exports = new UsersController();
