# Taboo CMS

## Description
A node.js and React Content Management System.

React CMS, Classic CMS, Headless CMS

## How To Install
Create your project folder, go inside the folder and run 
```
npm init
```
Fill in all the required fields and run:
```
npm i @taboo/cms
```

It will also create a symlink in `./node_modules/.bin/taboo-cms-cli`.

To install Taboo CMS into your local folder just run `install` command over CLI:
```
npx taboo-cms-cli install
```
After it has finished the installation process, run:
```
npm i
```
To make sure all required modules are installed.

That's it, you can now start the server by running:
```
npm start
```

## Create New Module
From your application root folder run this command:
```
npx taboo-cms-cli module create
```
It will prompt for module name and model name (model name in singular without 'Model' word in it).

You can find newly installed module in `./app/modules/moduleName`.

## Documentation
It uses Koa.js as server side server.
Application configuration files are in `./config` folder. Main config file is `./config/index.js` and other
config files are imported into it. You will need to create `./config/local.js` file, which is used to 
override default configs at any level. Config override logic:
```
index.js < envrionment/env.js < local.js
``` 
It uses gulp and webpack to build app assets and run the server, they can be used only for building assets and 
you can run server as normal either with `node` or `pm2` or any other lib you like. All the built assets 
are served from `./public` folder.

 
#### Application Structure
Application files can be found `./app`.
```
assets    - images, fonts, js and css
db        - db adapters
locales   - application internationalization translations
modules   - application uses modular system, so each module can contain 
            server side and client side needed files
policies  - policies are called before the route action, you can specify 
            policies at module route level, inside module.config.js, 
            or you can set policies at global level within ./config/server.js: globalPolicies
templates - are used for web layouts, error templates and email templates.
```
#### Module structure
Modules files can be found `./app/modules`. Each module is bootstrapped automatically, 
as long as it follows the structure below:
```
client           - it contains client related JS assets, by default they bootsrap 
                   React application
controllers      - server side controllers, keep them small only to bind to route actions,
                   and implement all the logic inside services.
helpers          - helpers can be used for generic helper functions that can be accessed 
                   from anywhere.
models           - model file in this case is model schema description with other options, 
                   it creates actual model when it bootstraps and starts the server.
services         - this is where all your server side application logic should be implemented.
module.config.js - server side application configuration.
```
#### Module Client structure
Module client files can be found `./app/modules/cient`.
```
components      - All of your React components, admin related components are in 'admin' folder,
stores          - React application stores, it uses Mobx for state management.
admin.config.js - Client side admin configuration for stores, routes and components
app.config.js   - Client side configuration for stores, routes and components
```
#### Instructions
Accessing app config:
```
const { config } = require('@taboo/cms-core');
const { server } = config;
```
Accessing Model:
```
// Model('moduleName.ModelName) - ModelName is model file name without 'Model.js' suffix.
const { Model } = require('@taboo/cms-core');
const results = await Model('core.Settings').find();
```
Accessing Helper:
```
// Helper('moduleName.HelperName) - HelperName is helper file name without 'Helper.js' suffix.
const { Helper } = require('@taboo/cms-core');
const err = new Error('Test Error');
const results = Helper('core.Response').parseError(err);
```
Accessing Service:
```
// Service('moduleName.ServiceName) - ServiceName is service file name without 'Service.js' suffix.
const { Service } = require('@taboo/cms-core');
const results = await Service('core.Revision').get(...);
```
Available imports from `@taboo/cms-core` module:
```
  _           - lodash
  start       - to start and bootstrap the server and other utils
  cwd         - current working directory
  config      - merged application config
  app         - app related attributes
  modules     - all the bootsrtapped modules from ./app/modules
  logger      - logger function, logger.info('Info'), logger.warn('Warn'), logger.error('Error')
  arrayHelper - helper for array manipulations
  filesHelper - helper for file system manipulations
  apiHelper   - helper for api related functions
  ejsHelper   - server side templating helper, it uses ejs templates
  cmsHelper   - cms related (mostly koa.js and variation between apiHelper and filesHelper logic)
  mailer      - node mailer to send emails
  sockets     - sockets server io to emit/receive messages
  events      - events receiver/emitter
  koaApp      - bootsrapped koa app
  router      - koa router
  passport    - authentication passport
  Model       - to access application Model
  Service     - to access application Service
  Helper      - to access application Helper
  isAllowed   - implementation of ACL based logic to get if resource is allowed.
```
\* - You can find more information here: [@taboo/cms-core](https://www.npmjs.com/package/@taboo/cms-core)
## ToDo
- implement layouts module
- prepare clean frontend layout
- implement migrations

### Instructions for build and deploy on remote server

Build can be initiated on 'master' branch pull request or on new version tag push - either is fine. 

Once the code is cloned, make sure it's on `master` branch, as `develop` is the default one:
```
git checkout master
```

Install all npm dependencies:
```
npm install
```

Create `./config/local.js` or copy from `./config/SAMPLE.local.js` to `./config/local.js`:
```
module.exports = {
  environment: 'development',
  server: {
    port: process.env.PORT || 3000,
  },
};
```

Possible environment values:
```
development
staging
production
```
Depending on the selected environment - the build and run process will be different.

Inside `./config/environment` folder there are 3 files:
```
development.js
staging.js
production.js
```
Depending on the selected environment (default 'development') it will load one of the above files
predefined config.

The way configs are overriden (if empty is exported, nothing will be overriden in default config):
```
default config < environment config < local.js
```

So local.js overrides all if needed.

Environment selection can also be done via `process.env.NODE_ENV=production`
environment variable when executing run or build, 
this overrides even `local.js` config environment

The port that app runs can be specified at any level of the config, 
if `process.env.PORT` is specified it will override all configs, default port: `3000`

Once correct environment is selected, we need to build all assets:
```
npm run build
```

That's it, to run the app manually:
```
node index.js
```

For production environment it's recommended to run app with `pm2`.
A custom `pm2` script can be used, but there is also one predefined in `./pm2.json`

The last bit to do is to configure nginx or apache to port forward to the port the app is running,
as it's never a good idea to launch app on port 80 or 443, although this is possible as well.
