# Taboo CMS

## Description
Content Management System and more

React CMS, Classic CMS, Headless CMS


## TODO
when creating admin and admin role first time - add all resources
modules dependencies with each other in module.config.js
also npm dependencies for each module
add enabled/installed flags to module configs
fix rsuite changes
make modules reuse generic classes
make layouts dynamic
make auto run db setup, for things like to ensure admin user, basice pages, home, about, contact
double check cms core for removing action from routes and other actions for health endpoint



## Build and Deploy

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
