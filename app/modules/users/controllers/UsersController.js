const { Service, Model, Helper, config } = require('@taboo/cms-core');
const validator = require('validator');

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
      user = await Model('users.User')
        .findById(userId)
        .populate(['documentPersonal1', 'documentPersonal2', 'documentIncorporation', 'profilePicture']);
      countryOptions = Service('countries.Countries').getKeyValueArray();
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
      user = await Model('users.User')
        .findById(userId)
        .populate(['documentPersonal1', 'documentPersonal2', 'documentIncorporation', 'profilePicture']);
    } catch (e) {
      ctx.throw(404, e);
    }
    ctx.view.userData = user;
  }

  async register(ctx) {
    const { users: { signUpEnabled = false } = {} } = config;
    const { body: data = {} } = ctx.request;
    const validationError = Service('users.Users').validateUserRegisterFields(data);
    let user;

    if (!signUpEnabled) {
      return ctx.throw(403, 'Forbidden');
    }

    if (validationError) {
      return ctx.throw(400, validationError);
    }

    try {
      user = await Service('users.Users').registerNewUser(data);
    } catch (err) {
      return ctx.throw(400, err);
    }

    ctx.body = user;
  }

  async login(ctx) {
    const { users: { signInEnabled = false } = {} } = config;
    const { body: { email = null, password = null } = {} } = ctx.request;
    if (!signInEnabled) {
      return ctx.throw(403, 'Forbidden');
    }
    ctx.body = await Service('users.Users').authenticateUser(ctx, email, password);
  }

  async logout(ctx) {
    ctx.body = {
      success: await Service('users.Users').logoutUser(ctx),
    };
  }

  async resetPasswordApi(ctx) {
    const { users: { signInEnabled = false } = {} } = config;
    const { body: { email = null, linkPrefix = '' } = {} } = ctx.request;
    if (!signInEnabled) {
      return ctx.throw(403, 'Forbidden');
    }
    ctx.body = {
      success: await Service('users.Users').resetPassword(ctx, email, linkPrefix),
    };
  }

  async changePasswordApi(ctx) {
    const { users: { signInEnabled = false } = {} } = config;
    const { body = null } = ctx.request;
    let success;
    if (!signInEnabled) {
      return ctx.throw(403, 'Forbidden');
    }
    success = await Service('users.Users').changePassword(ctx, body);
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
      user = await Model('users.User')
        .findById(userId)
        .populate(['documentPersonal1', 'documentPersonal2', 'documentIncorporation', 'profilePicture']);
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
        body.password = await Service('users.Users').hashPassword(body.newPassword);
      } else if (Object.prototype.hasOwnProperty.call(body, 'password')) {
        delete body.password;
      }
      user = await Model('users.User')
        .findByIdAndUpdate(userId, body, { new: true })
        .populate(['documentPersonal1', 'documentPersonal2', 'documentIncorporation', 'profilePicture']);
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
    const escapeValue = Helper('core.Core').escapeFormValue;
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
      user = await Model('users.User')
        .findOne({ email: escapeValue(email) })
        .populate('profilePicture');
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
