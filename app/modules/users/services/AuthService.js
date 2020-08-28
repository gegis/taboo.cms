const { config, isAllowed } = require('@taboo/cms-core');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('modules/core/errors/ApiError');
const ACLService = require('modules/acl/services/ACLService');
const UserTokenModel = require('modules/users/models/UserTokenModel');
const UserModel = require('modules/users/models/UserModel');

const {
  auth: {
    jwt: { secret: jwtSecret, authExpiresIn: jwtAuthExpiresIn, refreshExpiresIn: jwtRefreshExpiresIn } = {},
  } = {},
  users: { signInEnabled = false } = {},
} = config;

class AuthService {
  setup({ usersService = null }) {
    this.usersService = usersService;
  }

  async getCurrentUser(ctx) {
    let { session: { user: { id: userId } = {} } = {} } = ctx;
    let user;
    let userData;
    if (!userId) {
      userData = this.parseUserFromHeader(ctx.header);
      userId = userData.id;
    }
    user = await this.usersService.getUserById(userId, { loadAcl: true, populateProfilePic: true });
    if (!user) {
      new ApiError('User not found', 404);
    }

    return user;
  }

  parseUserFromHeader(header) {
    const { authorization = null } = header;
    let user = null;
    let jwtToken;
    let verifiedJwt;

    if (authorization) {
      jwtToken = this.parseAuthorizationToken('Bearer', authorization);
      verifiedJwt = this.verifyUserJwt(jwtToken);
      if (verifiedJwt && verifiedJwt.data) {
        user = verifiedJwt.data;
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

  async authenticateUser(ctx, email, password) {
    let passMatch;
    if (!email) {
      return ctx.throw(404, 'Email is required');
    }
    if (!password) {
      return ctx.throw(404, 'Password is required');
    }
    const user = await this.usersService.getUser({ email }, { populateProfilePic: true, keepPassword: true });
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

    return user;
  }

  async signUserJwt(user, uid) {
    if (!uid) {
      throw new ApiError("Please specify 'uid'", 400);
    }
    const acl = await ACLService.getUserACL(user);
    const authTokenExpiresAt = Date.now() + jwtAuthExpiresIn;
    const refreshTokenExpiresAt = Date.now() + jwtRefreshExpiresIn;
    const authToken = jwt.sign(
      {
        exp: Math.floor(authTokenExpiresAt / 1000),
        data: {
          id: user._id.toString(),
          uid: uid,
          acl: acl,
        },
      },
      jwtSecret
    );
    const refreshToken = jwt.sign(
      {
        exp: Math.floor(refreshTokenExpiresAt / 1000),
        data: {
          id: user._id.toString(),
          uid: uid,
        },
      },
      jwtSecret
    );
    const authTokenParts = this.decodeUserJwt(authToken, true);
    const refreshTokenParts = this.decodeUserJwt(refreshToken, true);

    // TODO - if it appears that signature part is not always unique - use user id + uid for token value
    await UserTokenModel.create({
      user: user,
      uid: uid,
      type: 'jwtAuth',
      token: authTokenParts.signature,
      expiresAt: authTokenExpiresAt,
    });

    await UserTokenModel.create({
      user: user,
      uid: uid,
      type: 'jwtRefresh',
      token: refreshTokenParts.signature,
      expiresAt: refreshTokenExpiresAt,
    });

    return { authToken, refreshToken, userId: user._id.toString(), uid };
  }

  /**
   * Do not use this to verify if token is valid and signed!!!
   * @param token
   * @param complete
   * @returns {ParsedUrlQuery | string | number[] | Promise<void>}
   */
  decodeUserJwt(token, complete = false) {
    return jwt.decode(token, { complete });
  }

  verifyUserJwt(token) {
    let verified = null;
    try {
      verified = jwt.verify(token, jwtSecret);
    } catch (e) {
      throw new ApiError(e.message, 400);
    }
    return verified;
  }

  async renewUserJwt(refreshToken, userId, uid) {
    if (!userId) {
      throw new ApiError("Please specify 'userId'", 400);
    }
    if (!uid) {
      throw new ApiError("Please specify 'uid'", 400);
    }
    const refreshTokenParts = this.decodeUserJwt(refreshToken, true);
    let tokens;
    let user;

    this.verifyUserJwt(refreshToken);
    const dbToken = await UserTokenModel.findOne({
      token: refreshTokenParts.signature,
      user: userId,
      type: 'jwtRefresh',
    });
    if (dbToken && dbToken.uid === uid) {
      user = await this.usersService.getUserById(userId);
      tokens = await this.signUserJwt(user, uid);
      await dbToken.delete();
      return tokens;
    } else {
      throw new ApiError('Refresh Token is invalid', 401);
    }
  }

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

  async logoutUser(session) {
    if (session.user && session.user.id) {
      delete session.user;
      return true;
    }
    return false;
  }

  async logoutUserJwt(token) {
    const verified = this.verifyUserJwt(token);
    let result;
    if (verified && verified.data && verified.data.id) {
      result = await UserTokenModel.deleteMany({ user: verified.data.id, type: { $in: ['jwtAuth', 'jwtRefresh'] } });
      if (result && result.deletedCount) {
        return true;
      }
    }
    throw new ApiError('Failed to logout', 403);
  }
}

module.exports = new AuthService();
