const { config, isAllowed } = require('@taboo/cms-core');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('modules/users/models/UserModel');

const {
  auth: { jwt: { secret: jwtSecret, expiresIn: jwtExpiresIn } = {} } = {},
  users: { signInEnabled = false } = {},
} = config;

class AuthService {
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

    return user;
  }

  signUserJwt(user) {
    const userJson = user.toObject();
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + jwtExpiresIn,
        data: {
          id: userJson._id,
        },
      },
      jwtSecret
    );
  }

  verifyUserJwt(ctx, token) {
    return jwt.verify(token, jwtSecret);
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

  // createJwtToken(data) {
  //   return jwt.sign(data, config.secret, {
  //     expiresIn: '10s', //lower value for testing
  //   });
  // }
  //
  // createRefreshToken() {
  //   //It doesn't always need to be in the /login endpoint route
  //   let refreshToken = jwt.sign(
  //     {
  //       type: 'refresh',
  //     },
  //     config.secret,
  //     {
  //       expiresIn: '20s', // 1 hour
  //     }
  //   );
  //   // return Users.findOneAndUpdate({
  //   //   email: user.email
  //   // }, {
  //   //   refreshToken: refreshToken
  //   // })
  //   //   .then(() => {
  //   //     return refreshToken;
  //   //   })
  //   //   .catch(err => {
  //   //     throw err;
  //   //   });
  // }
}

module.exports = new AuthService();
