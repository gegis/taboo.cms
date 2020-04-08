const { config, logger, mailer, cmsHelper } = require('@taboo/cms-core');
const moment = require('moment');
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
const ACLService = require('modules/acl/services/ACLService');
const SendGridService = require('modules/mailer/services/SendGridService');
const LocaleHelper = require('modules/core/helpers/LocaleHelper');
const ValidationHelper = require('modules/core/helpers/ValidationHelper');
const UserModel = require('modules/users/models/UserModel');
const RoleModel = require('modules/acl/models/RoleModel');

class UsersService {
  async passwordsMatch(plainPass, hashedPass) {
    return await bcrypt.compare(plainPass, hashedPass);
  }

  async hashPassword(password) {
    const {
      server: { bcryptSaltRounds = 10 },
    } = config;
    return await bcrypt.hash(password, bcryptSaltRounds);
  }

  async authenticateUser(ctx, email, password) {
    const {
      auth: { maxLoginAttempts = 3 },
    } = config;
    let passMatch;
    let userUpdateData = {};
    let profilePictureUrl = null;
    let acl;
    if (!email) {
      return ctx.throw(404, 'Email is required');
    }
    if (!password) {
      return ctx.throw(404, 'Password is required');
    }
    const user = await UserModel.findOne({ email }).populate('profilePicture');
    if (!user) {
      return ctx.throw(404, 'User not found');
    }
    if (!user.active) {
      return ctx.throw(404, 'User is not active');
    }
    passMatch = await this.passwordsMatch(password, user.password);
    if (!passMatch) {
      if (user && user._id) {
        userUpdateData.loginAttempts = user.loginAttempts + 1;
        await UserModel.findByIdAndUpdate(user._id, userUpdateData);
      }
      if (user.loginAttempts >= maxLoginAttempts) {
        return ctx.throw(404, 'Too many bad attempts');
      } else {
        return ctx.throw(404, 'User not found');
      }
    } else {
      userUpdateData = {
        lastLogin: new Date(),
        loginAttempts: 0, // Successful login, reset loginAttempts
      };
      await UserModel.findByIdAndUpdate(user._id, userUpdateData);
    }
    acl = await ACLService.getUserACL(user);
    if (user.profilePicture && user.profilePicture.url) {
      profilePictureUrl = user.profilePicture.url;
    }
    ctx.session.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      active: user.active,
      profilePictureUrl: profilePictureUrl,
      roles: user.roles,
      acl: acl,
    };
    return ctx.session.user;
  }

  async updateUserSession(user) {
    const { session: sessionConfig } = config.server;
    const acl = await ACLService.getUserACL(user);
    const roles = [];
    let SessionModel;
    let userSession;
    if (sessionConfig && sessionConfig.options && sessionConfig.options.store && sessionConfig.options.store.model) {
      SessionModel = sessionConfig.options.store.model;
      userSession = await SessionModel.findOne({ 'value.user.id': user._id.toString() });
      if (userSession) {
        if (user.roles) {
          user.roles.map(role => {
            roles.push(role._id);
          });
        }
        await SessionModel.updateOne(
          { _id: userSession._id },
          {
            $set: {
              'value.user.roles': roles,
              'value.user.acl': acl,
              'value.user.admin': user.admin,
              'value.user.verified': user.verified,
              'value.user.firstName': user.firstName,
              'value.user.lastName': user.lastName,
              'value.user.email': user.email,
            },
          }
        );
      }
    }
  }

  async logoutUser(ctx) {
    if (ctx.session.user && ctx.session.user.id) {
      ctx.session = null;
      return true;
    }
    return false;
  }

  async resetPassword(ctx, email, linkPrefix = '') {
    const { mailer: { sendGrid: { apiKey: sendGridApiKey } = {} } = {} } = config;
    const options = {};
    let success = false;
    let user;
    let emailResponse;

    if (linkPrefix && linkPrefix.charAt(0) !== '/') {
      linkPrefix = `/${linkPrefix}`;
    }

    if (email) {
      user = await UserModel.findOne({ email });
      if (user) {
        user.passwordReset = uuidv1();
        user.passwordResetRequested = new Date();

        try {
          await user.save();
          options.to = email;
          options.subject = LocaleHelper.translate(ctx, 'email_subject_users_password_reset');
          options.html = await cmsHelper.composeEmailTemplate(ctx, 'users/passwordReset', {
            user,
            link: `${ctx.origin}${linkPrefix}/change-password/${user._id}/${user.passwordReset}`,
          });

          if (sendGridApiKey) {
            emailResponse = await SendGridService.send(options);
          } else {
            emailResponse = await mailer.send(options);
          }

          if (emailResponse && (emailResponse.success || emailResponse.accepted)) {
            success = true;
          }
        } catch (e) {
          return ctx.throw(400, 'Failed to send email');
        }
      }
    }
    return success;
  }

  async changePassword(ctx, data) {
    const {
      auth: { passwordResetExpiryTime, maxLoginAttempts = 3 },
    } = config;
    let success = false;
    let user;
    if (!data.userId) {
      return ctx.throw(400, 'User not found');
    }
    if (!data.newPass || !data.newPassRepeat) {
      return ctx.throw(400, 'Please enter password');
    }
    if (data.newPass !== data.newPassRepeat) {
      return ctx.throw(400, "Passwords don't match");
    }
    if (!data.token) {
      return ctx.throw(400, 'Password change token is missing');
    }
    try {
      user = await UserModel.findById(data.userId);
    } catch (e) {
      logger.error(e);
      return ctx.throw(400, 'User not found');
    }
    if (!user) {
      return ctx.throw(400, 'User not found');
    }
    if (user.passwordReset !== data.token) {
      return ctx.throw(400, 'Password reset token is invalid');
    }
    if (
      !user.passwordResetRequested ||
      moment(user.passwordResetRequested)
        .add(passwordResetExpiryTime, 'ms')
        .format('x') < moment().format('x')
    ) {
      return ctx.throw(400, 'Password reset has expired');
    }
    try {
      user.password = await this.hashPassword(data.newPass);
      user.passwordReset = '';
      user.passwordResetRequested = null;
      if (user.loginAttempts >= maxLoginAttempts) {
        user.loginAttempts = 0;
      }
      await user.save();
      success = true;
    } catch (e) {
      logger.error(e);
    }

    return success;
  }

  async registerNewUser(data) {
    const userData = Object.assign({}, data);
    const role = await RoleModel.findOne({ name: 'User' });
    let user;
    userData.password = await this.hashPassword(data.password);
    if (!Object.prototype.hasOwnProperty.call(userData, 'active')) {
      userData.active = true;
    }
    if (role) {
      userData.roles = [role._id];
    }
    userData.admin = false;
    userData.verified = false;
    userData.verificationStatus = 'new';

    user = await UserModel.create(userData);

    return user;
  }

  validateUserRegisterFields(data) {
    const rules = {
      firstName: [
        {
          test: 'isRequired',
          message: 'First Name is required',
        },
      ],
      lastName: [
        {
          test: 'isRequired',
          message: 'Last Name is required',
        },
      ],
      email: [
        {
          test: 'isRequired',
          message: 'Email is required',
        },
        {
          test: 'isEmail',
          message: 'Email is not valid',
        },
      ],
      street: [
        {
          test: 'isRequired',
          message: 'Street is required',
        },
      ],
      city: [
        {
          test: 'isRequired',
          message: 'City is required',
        },
      ],
      state: [
        {
          test: 'isRequired',
          message: 'State is required',
        },
      ],
      country: [
        {
          test: 'isRequired',
          message: 'Country is required',
        },
      ],
      postCode: [
        {
          test: 'isRequired',
          message: 'ZIP Code is required',
        },
      ],
      password: [
        {
          test: 'isLength',
          options: { min: 5 },
          message: 'Password must be at least 5 characters long',
        },
      ],
    };
    const validationErrors = ValidationHelper.validateData(rules, data);
    let response = null;

    if (validationErrors && validationErrors.length > 0) {
      response = {
        validationMessage: 'Invalid Data',
        validationErrors: validationErrors,
      };
    }

    return response;
  }
}

module.exports = new UsersService();
