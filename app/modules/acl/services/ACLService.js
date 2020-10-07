const { logger, config } = require('@taboo/cms-core');
const AuthService = require('modules/users/services/AuthService');
const SettingsService = require('modules/settings/services/SettingsService');
const RoleModel = require('modules/acl/models/RoleModel');

class ACLService {
  constructor() {
    this.roles = {};
    this.aclResounces = [];
    this.afterModulesSetup = this.afterModulesSetup.bind(this);
    this.getAllResources = this.getAllResources.bind(this);
  }

  async afterModulesSetup(modules, aclResources) {
    this.aclResounces = aclResources;
  }

  getAllResources() {
    return this.aclResounces;
  }

  /**
   * THIS IS THE IMPLEMENTATION OF Taboo CMS isAllowed method
   * @param subject - either ctx object either user object
   * @param resource - string value for resource name
   */
  // TODO - rethink to pass to this function only resource and acl list
  isAllowed(subject, resource) {
    let allowed = false;
    let user;
    if (!resource || !SettingsService.getACLEnabled()) {
      allowed = true;
    } else if (subject) {
      if (subject.request && subject.response) {
        user = AuthService.getCurrentUser(subject);
      } else {
        user = subject;
      }
      if (user && user.acl && resource && user.acl.indexOf(resource) !== -1) {
        allowed = true;
      }
    }
    return allowed;
  }

  async getUserACL(user) {
    let acl = [];
    let roles;
    try {
      if (user && user.roles) {
        roles = await RoleModel.find({ _id: { $in: user.roles } });
        if (roles) {
          roles.map(role => {
            role.resources.map(resource => {
              if (acl.indexOf(resource) === -1) {
                acl.push(resource);
              }
            });
          });
        }
      }
    } catch (e) {
      logger.error(e);
    }
    acl.sort();
    return acl;
  }

  async updateUserSessionsACL(role) {
    const { session } = config.server;
    let SessionModel;
    let sessions;
    if (role && role._id && session && session.options && session.options.store && session.options.store.model) {
      SessionModel = session.options.store.model;
      sessions = await SessionModel.find({ 'value.user.roles': { $in: [role._id] } });
      sessions.map(async session => {
        let acl;
        if (session.value && session.value.user) {
          acl = await this.getUserACL(session.value.user);
          await SessionModel.updateOne({ _id: session._id }, { $set: { 'value.user.acl': acl } });
        }
      });
    }
  }

  async removeUserSessionsRole(role) {
    const { session } = config.server;
    let SessionModel;
    let sessions;
    if (role && role._id && session && session.options && session.options.store && session.options.store.model) {
      SessionModel = session.options.store.model;
      sessions = await SessionModel.find({ 'value.user.roles': { $in: [role._id] } });
      sessions.map(async session => {
        let acl;
        let roles = [];
        if (session.value && session.value.user && session.value.user.roles) {
          session.value.user.roles.map(async roleId => {
            if (roleId !== role._id) {
              roles.push(roleId);
            }
            session.value.user.roles = roles;
            acl = await this.getUserACL(session.value.user);
            await SessionModel.updateOne(
              { _id: session._id },
              { $set: { 'value.user.roles': roles, 'value.user.acl': acl } }
            );
          });
        }
      });
    }
  }
}

module.exports = new ACLService();
