const { config, logger, events, sockets } = require('@taboo/cms-core');
const moment = require('moment');
const uuidv1 = require('uuid/v1');
const ACLService = require('modules/acl/services/ACLService');
const SettingsService = require('modules/settings/services/SettingsService');
const EmailsService = require('modules/emails/services/EmailsService');
const MailerService = require('modules/mailer/services/MailerService');
const AuthService = require('modules/users/services/AuthService');
const UserValidationHelper = require('modules/users/helpers/UserValidationHelper');
const UserModel = require('modules/users/models/UserModel');
const RoleModel = require('modules/acl/models/RoleModel');

const { server: { session: { options: { maxAge = 86400000 } = {}, rememberMeMaxAge = 86400000 } = {} } = {} } = config;

class UsersService {
  async getUser(
    filter,
    { loadAcl = false, keepPassword = false, populateDocs = false, populateProfilePic = true } = {}
  ) {
    const query = UserModel.findOne(filter);
    return await this.getUserByQuery(query, { loadAcl, keepPassword, populateDocs, populateProfilePic });
  }

  async getUserById(
    userId,
    { loadAcl = false, keepPassword = false, populateDocs = false, populateProfilePic = true } = {}
  ) {
    const query = UserModel.findById(userId);
    return await this.getUserByQuery(query, { loadAcl, keepPassword, populateDocs, populateProfilePic });
  }

  async getUserByQuery(
    query,
    { loadAcl = false, keepPassword = false, populateDocs = false, populateProfilePic = true } = {}
  ) {
    let userResult;
    let user = null;
    let populate = [];
    if (populateDocs) {
      populate = populate.concat(['documentPersonal1', 'documentPersonal2', 'documentIncorporation']);
    }
    if (populateProfilePic) {
      populate = populate.concat(['profilePicture']);
    }
    if (populate.length > 0) {
      query.populate(populate);
    }
    userResult = await query.exec();
    if (userResult) {
      user = userResult.toObject();
      if (loadAcl) {
        user.acl = await ACLService.getUserACL(user);
      }
      if (!keepPassword) {
        delete user.password;
      }
    }

    return user;
  }

  async verifyEmail(session, userId, token) {
    const { user: { id: sessionUserId } = {} } = session;
    const user = await this.getUserById(userId, { loadAcl: true });
    let success = false;

    if (user && user.accountVerificationCode && user.accountVerificationCode === token) {
      user.emailVerified = true;
      // TODO set to approved only if docs verification is not needed
      // user.verified = true;
      // user.verificationStatus = 'approved';
      user.emailVerificationCode = '';
      user.save();
      success = true;
    }
    if (userId === sessionUserId) {
      await this.setUserSession(session, user);
    } else {
      await this.updateUserSession(user);
    }
    this.socketsEmitUserChanges(user);
    return { user, success };
  }

  async setUserSession(session, user, rememberMe = false) {
    session.user = await this.parseUserSessionData(user, { rememberMe });
    if (rememberMe) {
      session.maxAge = rememberMeMaxAge;
    } else {
      session.maxAge = maxAge;
    }

    return session.user;
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
    const validationError = UserValidationHelper.validateUserPassword(data.newPass);
    let success = false;
    let user;

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
      user.password = await AuthService.hashPassword(data.newPass);
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

  async registerNewUser(ctx, data, userRoleName = 'User') {
    const userData = Object.assign({}, data);
    const role = await RoleModel.findOne({ name: userRoleName });
    let userDoc = null;
    let user;
    userData.password = await AuthService.hashPassword(data.password);
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

  async deleteUser(userId) {
    const user = await this.getUserById(userId);
    if (user) {
      await this.onUserDelete(user);
      await this.deleteUserSession(user);
    }
    return user;
  }

  async onUserDelete(user) {
    events.emit('onUserDelete', user);
  }

  async getUsers(filter, fields, sort = { createdAt: 'desc' }) {
    return UserModel.find(filter, fields, { sort });
  }

  async deleteUserSession(user) {
    const { session } = config.server;
    let SessionModel;
    if (user && session && session.options && session.options.store && session.options.store.model) {
      SessionModel = session.options.store.model;
      await SessionModel.findOneAndDelete({ 'value.user.id': user._id.toString() });
    }
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
      // username: user.username,
      email: user.email,
      verified: user.verified,
      active: user.active,
      admin: user.admin,
    });
  }
}

module.exports = new UsersService();
