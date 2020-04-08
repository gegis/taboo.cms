#!/usr/bin/env node
require('app-module-path').addPath(`${__dirname}/../app`);
const readlineSync = require('readline-sync');
const { config } = require('@taboo/cms-core');
const connectionName = 'mongodb';
const { adapter } = config.db.connections[connectionName];
const user = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roles: [],
  admin: false,
  active: true,
};

const prompt = () => {
  while (!user.email) {
    user.email = readlineSync.question('Please enter email: ');
  }
  user.firstName = user.email.split('@')[0];
  user.lastName = user.email.split('@')[0];

  while (!user.password) {
    user.password = readlineSync.question('Please enter password: ', {
      hideEchoBack: true,
    });
  }

  user.admin = readlineSync.keyInYN('Create as admin?');
  if (!user.admin) {
    user.admin = false;
  }
};

const connectDb = async () => {
  await adapter.connect(config.db.connections[connectionName]);
};

const setAdminRoles = async () => {
  const RoleModel = require('modules/acl/models/RoleModel');
  const userRoles = [];
  let roles, newRole;

  roles = await RoleModel.find();
  if (roles && roles.length > 0) {
    roles.map(role => {
      userRoles.push(role._id);
    });
  } else {
    // Roles do not exist - create one!
    newRole = await RoleModel.create({
      name: 'Administrator',
      resources: ['admin.dashboard', 'admin.acl.view', 'admin.acl.manage', 'admin.users.view', 'admin.users.manage'],
    });
    userRoles.push(newRole._id);
  }
  return userRoles;
};

const create = async () => {
  const UserModel = require('modules/users/models/UserModel');
  const UsersService = require('modules/users/services/UsersService');
  let userRoles = [];
  let result;
  if (user.admin) {
    userRoles = await setAdminRoles();
  }
  user.password = await UsersService.hashPassword(user.password);
  user.roles = userRoles;
  result = await UserModel.create(user);
  return result;
};

prompt();
connectDb()
  .then(() => {
    create()
      .then(result => {
        if (result) {
          console.info('\n\nA new user was successfully created!\n');
          console.info(result);
        } else {
          console.error('Failed to create User');
          process.exit(1);
        }
        process.exit(0);
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
