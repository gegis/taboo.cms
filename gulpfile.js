const gulp = require('gulp');
const cleanTask = require('./tasks/clean');
const lintTask = require('./tasks/lint');
const stylesTask = require('./tasks/styles');
const webpackTask = require('./tasks/webpack');
const scriptsTask = require('./tasks/scripts');
const copyTask = require('./tasks/copy');
const startServerTask = require('./tasks/startServer');
const { config: appConfig } = require('@taboo/cms-core');
const config = appConfig.gulp;
const productionBuildEnvs = ['production', 'staging'];
let production = false;
let watch = false;

config.server.environment = appConfig.environment;
if (productionBuildEnvs.indexOf(appConfig.environment) !== -1) {
  production = true;
}

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

const themeStyles = () => {
  return stylesTask(config.themeStyles, production, watch);
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

const libScripts = () => {
  return scriptsTask(config.libScripts, production, watch);
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
  gulp.parallel(adminLibStyles, adminStyles, appLibStyles, appStyles, themeStyles, webpack, libScripts, copy),
  startServer
);

const build = gulp.series(
  clean,
  lint,
  gulp.parallel(adminLibStyles, adminStyles, appLibStyles, appStyles, themeStyles, webpack, libScripts, copy)
);

module.exports = {
  default: buildAndWatch,
  buildAndWatch: buildAndWatch,
  build: build,
  lint: lint,
};
