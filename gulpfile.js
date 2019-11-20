const gulp = require('gulp');
const less = require('gulp-less');
const cleanTask = require('./tasks/clean');
const lintTask = require('./tasks/lint');
const stylesTask = require('./tasks/styles');
const webpackTask = require('./tasks/webpack');
const scriptsTask = require('./tasks/scripts');
const copyTask = require('./tasks/copy');
const startServerTask = require('./tasks/startServer');
const tabooCms = require('@taboo/cms-core');

const appConfig = tabooCms.config;
const productionBuildEnvs = ['production', 'staging'];
let production = false;
let watch = false;

if (productionBuildEnvs.indexOf(appConfig.environment) !== -1) {
  production = true;
}

let config = {
  lint: ['app/**/*.js', 'app/**/*.jsx', '!app/assets/scripts/lib/**/*.js'],
  clean: ['public/js', 'public/css', 'public/fonts'],
  server: {
    startScript: 'index.js',
    watch: ['app', 'config'],
    ext: 'js html',
    ignore: ['app/modules/**/client', 'app/assets/scripts'],
    environment: appConfig.environment,
  },
  webpack: {
    src: './app/modules/core/client/index.jsx',
    entry: {
      app: './app/modules/core/client/index.jsx',
      admin: './app/modules/core/client/admin.jsx',
    },
    output: {
      path: `${__dirname}/public/js/`,
      publicPath: '/js/',
      filename: '[name].bundle.js',
    },
    watch: ['app/modules/**/client/**/*.js', 'app/modules/**/client/**/*.jsx', 'app/locales'],
  },
  scripts: {
    src: [
      'app/assets/scripts/**/*.js',
      '!app/assets/scripts/lib/**/*.js',
      'app/modules/**/client/scripts/**/*.js',
      '!app/modules/**/client/scripts/admin/**/*.js',
    ],
    dest: {
      file: 'app.js',
      path: 'public/js',
    },
    watch: [
      'app/assets/scripts/**/*.js',
      '!app/assets/scripts/lib/**/*.js',
      'app/modules/**/client/scripts/**/*.js',
      '!app/modules/**/client/scripts/admin/**/*.js',
    ],
    babel: true,
  },
  adminLibStyles: {
    src: ['app/assets/styles/admin/lib.less', 'node_modules/react-quill/dist/quill.snow.css'],
    dest: {
      file: 'admin.lib.css',
      path: 'public/css',
    },
    watch: ['app/assets/styles/admin/lib.less', 'app/assets/styles/admin/vars.less'],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  adminStyles: {
    src: ['app/assets/styles/admin/index.less', 'app/modules/**/client/styles/admin/index.less'],
    dest: {
      file: 'admin.css',
      path: 'public/css',
    },
    watch: [
      'app/assets/styles/admin/**/*.less',
      'app/modules/**/client/styles/admin/index.less',
      '!app/assets/styles/admin/lib.less',
    ],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  appLibStyles: {
    src: ['node_modules/font-awesome/css/font-awesome.css', 'app/assets/styles/lib/lib.less'],
    dest: {
      file: 'lib.css',
      path: 'public/css',
    },
    watch: ['app/assets/styles/lib/**/*.less'],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  appStyles: {
    src: ['app/assets/styles/index.less', 'app/modules/**/client/styles/index.less'],
    dest: {
      file: 'app.css',
      path: 'public/css',
    },
    watch: [
      'app/assets/styles/**/*.less',
      '!app/assets/styles/admin/**/*',
      '!app/assets/styles/lib/**/*',
      'app/modules/**/client/styles/**/*.less',
      '!app/modules/**/client/styles/admin/**/*.less',
    ],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  copy: {
    paths: [
      {
        src: 'app/assets/images/favicon.ico',
        dest: 'public',
      },
      {
        src: 'app/assets/fonts/**/*',
        dest: 'public/fonts',
      },
      {
        src: 'app/assets/images/**/*',
        dest: 'public/images',
      },
      {
        src: 'node_modules/rsuite/dist/styles/fonts/**/*',
        dest: 'public/fonts',
      },
    ],
    watch: ['app/assets/images/**/*', 'app/assets/fonts/**/*'],
  },
};

const enableWatch = next => {
  watch = true;
  return next();
};

const clean = () => {
  return cleanTask(config.clean, config.copy);
};

const lint = () => {
  return lintTask(config.lint);
};

const appLibStyles = () => {
  return stylesTask(config.appLibStyles, production, watch);
};

const appStyles = () => {
  return stylesTask(config.appStyles, production, watch);
};

const adminStyles = () => {
  return stylesTask(config.adminStyles, production, watch);
};

const adminLibStyles = () => {
  return stylesTask(config.adminLibStyles, production, watch);
};

const webpack = () => {
  return webpackTask(config.webpack, production, watch);
};

const scripts = () => {
  return scriptsTask(config.scripts, production, watch);
};

const copy = () => {
  return copyTask(config.copy, watch);
};

const startServer = next => {
  return startServerTask(config.server, watch, next);
};

/**************************************************************************************
 Main Gulp Tasks
 **************************************************************************************/

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
const buildAndWatch = gulp.series(
  enableWatch,
  clean,
  lint,
  gulp.parallel(adminLibStyles, adminStyles, appLibStyles, appStyles, webpack, scripts, copy),
  startServer
);

const build = gulp.series(
  clean,
  lint,
  gulp.parallel(adminLibStyles, adminStyles, appLibStyles, appStyles, webpack, scripts, copy)
);

module.exports = {
  default: buildAndWatch,
  buildAndWatch: buildAndWatch,
  build: build,
  lint: lint,
};
