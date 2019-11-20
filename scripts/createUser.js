const readlineSync = require('readline-sync');
const { config } = require('@taboo/cms-core');
const userModelConfig = require('../app/modules/users/models/UserModel');
const roleModelConfig = require('../app/modules/acl/models/RoleModel');
const UsersService = require('../app/modules/users/services/UsersService');
const { connection } = userModelConfig;
const { adapter } = config.db.connections[connection];
const user = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roles: [],
  admin: false,
  active: true,
};
const userRoles = [];
let db, UserModel, RoleModel, roles;

while (!user.email) {
  user.email = readlineSync.question('Please enter email: ');
}
user.firstName = user.email;
user.lastName = user.email;

while (!user.password) {
  user.password = readlineSync.question('Please enter password: ', {
    hideEchoBack: true,
  });
}

user.admin = readlineSync.keyInYN('Create as admin?');
if (!user.admin) {
  user.admin = false;
}

const run = async () => {
  let result;
  let newRole;
  db = new adapter(config.db.connections[connection]);
  await db.connect();

  UserModel = await db.setupModel('User', userModelConfig);
  RoleModel = await db.setupModel('Role', roleModelConfig);

  if (user.admin) {
    roles = await RoleModel.find();
    if (roles && roles.length > 0) {
      roles.map(role => {
        userRoles.push(role._id);
      });
    } else {
      // Roles do not exist - create one!
      newRole = await RoleModel.create({
        name: 'Admin',
        resources: ['admin.dashboard', 'admin.acl.view', 'admin.acl.manage', 'admin.users.view', 'admin.users.manage'],
      });
      userRoles.push(newRole._id);
    }
  }

  user.password = await UsersService.hashPassword(user.password);

  user.roles = userRoles;
  result = await UserModel.create(user).catch(e => {
    console.log(e.message);
    process.exit(1);
  });

  if (result) {
    console.log('\n\nA new user was successfully created!\n');
    delete result.password;
    console.log(result);
  }

  process.exit(0);
};

run();
