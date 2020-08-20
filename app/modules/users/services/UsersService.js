const { config, logger, isAllowed, events, sockets } = require('@taboo/cms-core');
const moment = require('moment');
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
const ACLService = require('modules/acl/services/ACLService');
const SettingsService = require('modules/settings/services/SettingsService');
const EmailsService = require('modules/emails/services/EmailsService');
const MailerService = require('modules/mailer/services/MailerService');
const ValidationHelper = require('modules/core/helpers/ValidationHelper');
const UserModel = require('modules/users/models/UserModel');
const RoleModel = require('modules/acl/models/RoleModel');
const Json2csvParser = require('json2csv').Parser;

const { server: { session: { options: { maxAge = 86400000 } = {}, rememberMeMaxAge = 86400000 } = {} } = {} } = config;

const { users: { passwordMinLength = 6 } = {} } = config;

class UsersService {
  async passwordsMatch(plainPass, hashedPass) {
    return await bcrypt.compare(plainPass, hashedPass);
  }

  async hashPassword(password) {
    const { server: { bcryptSaltRounds = 10 } = {} } = config;
    return await bcrypt.hash(password, bcryptSaltRounds);
  }

  parseAuthorizationToken(type, value) {
    let token = null;
    if (value) {
      const parts = value.split(' ');
      if (parts[0] === type) {
        token = parts[1];
      }
    }
    return token;
  }

  async getUserData(search, loadAcl = false) {
    let user = null;
    const userResult = await UserModel.findOne(search);
    if (userResult) {
      user = Object.assign({}, userResult._doc);
      if (loadAcl) {
        user.acl = await ACLService.getUserACL(user);
      }
    }
    return user;
  }

  isUserRequestAllowed(ctx, user) {
    const { routeParams: { aclResource } = {} } = ctx;
    if (aclResource) {
      // if isAllowed return value is undefined - it means acl is not enabled / implemented
      if (isAllowed(user, aclResource) === false) {
        return false;
      }
    }
    return true;
  }

  async authenticateUser(ctx, email, password, rememberMe = false) {
    const { users: { signInEnabled = false } = {} } = config;
    let passMatch;
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
      return await this.onPasswordMismatch(ctx, user);
    } else {
      await UserModel.findByIdAndUpdate(user._id, {
        lastLogin: new Date(),
        loginAttempts: 0, // Successful login, reset loginAttempts
      });
    }

    if (!signInEnabled && !user.admin) {
      return ctx.throw(403, 'Forbidden');
    }

    await this.setUserSession(ctx, user, rememberMe);

    return ctx.session.user;
  }

  async onPasswordMismatch(ctx, user) {
    const { auth: { maxLoginAttempts = 3 } = {} } = config;
    if (user && user._id) {
      await UserModel.findByIdAndUpdate(user._id, {
        loginAttempts: user.loginAttempts + 1,
      });
    }
    if (user && user.loginAttempts >= maxLoginAttempts) {
      return ctx.throw(404, 'Too many attempts');
    } else {
      return ctx.throw(404, 'Login details are invalid');
    }
  }

  async setUserSession(ctx, user, rememberMe = false) {
    ctx.session.user = await this.parseUserSessionData(user, { rememberMe });
    if (rememberMe) {
      ctx.session.maxAge = rememberMeMaxAge;
    } else {
      ctx.session.maxAge = maxAge;
    }
  }

  async parseUserSessionData(user, { authenticated = false, rememberMe = false }) {
    let userSessionData = null;
    let acl;
    let profilePictureUrl;
    if (user) {
      if (user.profilePicture && user.profilePicture.url) {
        profilePictureUrl = user.profilePicture.url;
      }
      acl = await ACLService.getUserACL(user);
      userSessionData = {
        id: user._id.toString(),
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        verified: user.verified,
        emailVerified: user.emailVerified,
        admin: user.admin,
        active: user.active,
        profilePictureUrl: profilePictureUrl,
        postsCount: user.postsCount,
        viewedTopics: user.viewedTopics,
        viewedTopicPosts: user.viewedTopicPosts,
        roles: user.roles,
        acl: acl,
        rememberMe: rememberMe,
      };
      if (authenticated) {
        userSessionData.authenticated = true;
      }
    }
    return userSessionData;
  }

  async updateUserSession(user) {
    const { session: sessionConfig } = config.server;
    const acl = await ACLService.getUserACL(user);
    const roles = [];
    let SessionModel;
    let userSession;
    if (sessionConfig && sessionConfig.options && sessionConfig.options.store && sessionConfig.options.store.model) {
      SessionModel = sessionConfig.options.store.model;
      userSession = await SessionModel.findOne({ 'value.user._id': user._id });
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
              'value.user.emailVerified': user.emailVerified,
              'value.user.verified': user.verified,
              'value.user.active': user.active,
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
      ctx.session.visitor = { viewedTopics: ctx.session.user.viewedTopics };
      delete ctx.session.user;
      return true;
    }
    return false;
  }

  async resetPassword(ctx, userEmail, linkPrefix = '') {
    const { routeParams: { language = 'en' } = {} } = ctx;
    const { users: { signInEnabled = false } = {} } = config;
    const emailToSend = {};
    let success = false;
    let user;
    let emailResponse;
    let email;
    let resetLink;

    if (linkPrefix && linkPrefix.charAt(0) !== '/') {
      linkPrefix = `/${linkPrefix}`;
    }

    if (userEmail) {
      user = await UserModel.findOne({ email: userEmail });
      if (user) {
        if (!signInEnabled && !user.admin) {
          return ctx.throw(403, 'Forbidden');
        }
        try {
          user.passwordReset = uuidv1();
          user.passwordResetRequested = new Date();
          email = await EmailsService.getEmail('passwordReset', language);
          await user.save();
          resetLink = this.getResetLink(ctx, linkPrefix, user._id, user.passwordReset);
          if (email.from) {
            emailToSend.from = email.from;
          }
          emailToSend.to = userEmail;
          emailToSend.subject = email.subject;
          emailToSend.html = await EmailsService.composeEmailBody(
            ctx,
            email.body,
            Object.assign(
              {},
              { resetLink: `<a href="${resetLink}">${resetLink}</a>` },
              { firstName: user.firstName, lastName: user.lastName, email: user.email }
            )
          );
          emailResponse = await MailerService.send(emailToSend, { ctx });
          if (emailResponse && (emailResponse.success || emailResponse.accepted)) {
            success = true;
          }
        } catch (e) {
          logger.error(e);
          return ctx.throw(400, 'Failed to send email');
        }
      }
    }
    return success;
  }

  getResetLink(ctx, linkPrefix, userId, resetToken) {
    return `${ctx.origin}${linkPrefix}/change-password/${userId}/${resetToken}`;
  }

  async validateUniqueApiKey(ctx, data, userId = null) {
    let user;
    if (data && data.apiKey) {
      user = await UserModel.findOne({ apiKey: data.apiKey });
      if (user && user._id.toString() !== userId && user.apiKey === data.apiKey) {
        ctx.throw(400, 'API Key already exists');
      }
    }
  }

  async changePassword(ctx, data) {
    const {
      users: { signInEnabled = false } = {},
      auth: { passwordResetExpiryTime, maxLoginAttempts = 3 } = {},
    } = config;
    let success = false;
    let user;
    const validationError = this.validateUserPassword(data.newPass);

    if (validationError) {
      return ctx.throw(400, validationError);
    }
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
    if (!signInEnabled && !user.admin) {
      return ctx.throw(403, 'Forbidden');
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

  async registerNewUser(ctx, data) {
    const userData = Object.assign({}, data);
    const role = await RoleModel.findOne({ name: 'User' });
    let userDoc = null;
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
    if (user) {
      userDoc = Object.assign({}, user._doc);
      delete userDoc.password;
      await this.sendUserVerificationEmail(ctx, user);
    }

    return userDoc;
  }

  async sendUserVerificationEmail(ctx, user, userLanguage = 'en') {
    const { routeParams: { language = userLanguage } = {} } = ctx;
    const emailToSend = {};
    const linkPrefix = ''; // TODO parse from config
    const email = await EmailsService.getEmail('accountVerification', language);
    let success = false;
    let verifyLink;
    let emailResponse;
    if (user && email) {
      try {
        user.accountVerificationCode = uuidv1();
        user.accountVerificationCodeRequested = new Date();
        user.save();
        verifyLink = this.getVerificationLink(ctx, linkPrefix, user._id, user.accountVerificationCode);
        if (email.from) {
          emailToSend.from = email.from;
        }
        emailToSend.to = user.email;
        emailToSend.subject = email.subject;
        emailToSend.html = await EmailsService.composeEmailBody(
          ctx,
          email.body,
          Object.assign(
            {},
            { verifyLink: `<a href="${verifyLink}">${verifyLink}</a>` },
            { firstName: user.firstName, lastName: user.lastName, email: user.email }
          )
        );
        emailResponse = await MailerService.send(emailToSend, { ctx });
        if (emailResponse && (emailResponse.success || emailResponse.accepted)) {
          success = true;
        }
      } catch (e) {
        success = false;
        logger.error(e);
      }
    } else {
      if (!user) {
        logger.error(new Error('sendUserVerificationEmail: User not found'));
      }
      if (!email) {
        logger.error(new Error('sendUserVerificationEmail: Email template not found'));
      }
    }
    return {
      success,
      // accountVerificationCode: user.accountVerificationCode, // It's not safe - can bypass without email
      accountVerificationCodeRequested: user.accountVerificationCodeRequested,
    };
  }

  async sendUserDeactivationEmail(ctx, user, userLanguage = 'en') {
    const { routeParams: { language = userLanguage } = {} } = ctx;
    const emailToSend = {};
    const accountDeactivationEmailRecipients = await SettingsService.get('accountDeactivationEmailRecipients');
    const email = await EmailsService.getEmail('deactivatedAccount', language);
    const userLink = `${ctx.origin}/admin/users?search=_id%20%3D%20${user._id}`;
    let success = false;
    let emailResponse;
    if (user && email) {
      try {
        if (email.from) {
          emailToSend.from = email.from;
        }
        emailToSend.to = accountDeactivationEmailRecipients.value;
        emailToSend.subject = email.subject;
        emailToSend.html = await EmailsService.composeEmailBody(
          ctx,
          email.body,
          Object.assign({ firstName: user.firstName, lastName: user.lastName, email: user.email, userLink: userLink })
        );
        emailResponse = await MailerService.send(emailToSend, { ctx });
        if (emailResponse && (emailResponse.success || emailResponse.accepted)) {
          success = true;
        }
      } catch (e) {
        success = false;
        logger.error(e);
      }
    }
    return success;
  }

  getVerificationLink(ctx, linkPrefix, userId, verificationToken) {
    return `${ctx.origin}${linkPrefix}/verify-email/${userId}/${verificationToken}`;
  }

  validateUserRegisterFields(data) {
    const rules = Object.assign({}, this.getUserFieldsBasicRules(), {
      agreeToTerms: [
        {
          test: 'isTrue',
          message: 'You must agree with Terms & Conditions',
        },
      ],
    });
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

  validateUserAccountFields(data) {
    const addPasswordRule = !!(data && data.newPassword);
    const rules = Object.assign({}, this.getUserFieldsBasicRules('newPassword', addPasswordRule));
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

  validateUserPassword(password) {
    const rules = {
      password: this.getUserPasswordRules(),
    };
    const validationErrors = ValidationHelper.validateData(rules, { password: password });
    let response = null;
    if (validationErrors && validationErrors.length > 0) {
      response = {
        validationMessage: 'Invalid Password',
        validationErrors: validationErrors,
      };
    }

    return response;
  }

  getUserFieldsBasicRules(passwordFieldName = 'password', addPasswordRule = true) {
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
      country: [
        {
          test: 'isRequired',
          message: 'Country is required',
        },
      ],
      // username: this.getUsernameRules(),
    };

    if (addPasswordRule) {
      rules[passwordFieldName] = this.getUserPasswordRules();
    }

    return rules;
  }

  getUserPasswordRules() {
    return [
      {
        test: 'isLength',
        options: { min: passwordMinLength },
        message: `Password must be at least ${passwordMinLength} characters long`,
      },
      {
        test: 'testRegexp',
        regexp: RegExp(/[A-Z]+/),
        message: 'Should contain at least one upper case letter',
      },
      {
        test: 'testRegexp',
        regexp: RegExp(/[a-z]+/),
        message: 'Should contain at least one lower case letter',
      },
      {
        test: 'testRegexp',
        regexp: RegExp(/\d+/),
        message: 'Should contain at least one digit',
      },
    ];
  }

  getUsernameRules() {
    return [
      {
        test: 'isRequired',
        message: 'Username is required',
      },
      {
        test: 'isLength',
        options: { min: 3 },
        message: 'Username must be minimum 3 characters',
      },
      {
        test: 'isLength',
        options: { max: 20 },
        message: 'Username must be maximum 20 characters',
      },
      {
        test: 'notIndexOf',
        options: {
          caseSensitive: false,
          values: ['admin', 'administrator'],
        },
        message: 'Username is already taken!',
      },
      {
        test: 'testRegexp',
        regexp: RegExp(/^[\w]+$/),
        message: "Only alphanumeric symbols a-z, A-Z, 0-9 and '_'",
      },
    ];
  }

  async deleteUser(userId) {
    const user = await this.getUserData({ _id: userId });
    if (user) {
      await this.onUserDelete(user);
      await ACLService.deleteUserSession(user);
    }
    return user;
  }

  async onUserDelete(user) {
    events.emit('onUserDelete', user);
  }

  async getUsers(filter, fields, sort = { createdAt: 'desc' }) {
    return UserModel.find(filter, fields, { sort });
  }

  async jsonToCsv(data, fields) {
    const json2csvParser = new Json2csvParser({ fields });
    return json2csvParser.parse(data);
  }

  /**
   * in node koa:
   * app.proxy = true;
   * in nginx
   * proxy_set_header X-Real-IP $remote_addr;
   * proxy_set_header X-Real-PORT $remote_port;
   * proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   *
   * @param ctx
   * @returns {string}
   */
  getUserIp(ctx) {
    const { ip = '', header = {} } = ctx;
    let userIp = ip;
    if ((!userIp || userIp.indexOf('127.0.0.1') !== -1) && header['x-forwarded-for']) {
      userIp = header['x-forwarded-for'];
    }
    return userIp;
  }

  socketsEmitUserChanges(user) {
    sockets.emit('users', `user-${user._id}-user-update`, {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      verified: user.verified,
      active: user.active,
      admin: user.admin,
    });
  }
}

module.exports = new UsersService();
