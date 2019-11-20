const { Service, Model, Helper } = require('@taboo/cms-core');
const validator = require('validator');

class UsersController {
  constructor() {}

  async userLandingPage() {}

  async register(ctx) {
    const { body: data = {} } = ctx.request;
    const validationError = Service('users.Users').validateUserRegisterFields(data);
    let user;

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
    const {
      body: { email = null, password = null },
    } = ctx.request;
    ctx.body = await Service('users.Users').authenticateUser(ctx, email, password);
  }

  async logout(ctx) {
    ctx.body = {
      success: await Service('users.Users').logoutUser(ctx),
    };
  }

  async resetPassword(ctx) {
    const {
      body: { email = null, linkPrefix = '' },
    } = ctx.request;
    ctx.body = {
      success: await Service('users.Users').resetPassword(ctx, email, linkPrefix),
    };
  }

  async changePassword(ctx) {
    const { body = null } = ctx.request;
    const success = await Service('users.Users').changePassword(ctx, body);
    ctx.body = { success };
  }

  async getAuth(ctx) {
    const authUser = ctx.session.user || {};
    ctx.body = authUser;
  }

  async getCurrent(ctx) {
    let user;
    try {
      user = await Model('users.User')
        .findById(ctx.session.user.id)
        .populate(['documentPassport1', 'documentPassport2', 'documentIncorporation', 'profilePicture']);
    } catch (e) {
      ctx.throw(404, e);
    }
    ctx.body = user;
  }

  async updateCurrent(ctx) {
    const { body = {} } = ctx.request;
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
      user = await Model('users.User').findByIdAndUpdate(ctx.session.user.id, body, { new: true });
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
