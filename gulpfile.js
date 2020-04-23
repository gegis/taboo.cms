const gulp = require('gulp');
const cleanTask = require('./tasks/clean');
const lintTask = require('./tasks/lint');
const stylesTask = require('./tasks/styles');
const webpackTask = require('./tasks/webpack');
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

const adminModulesStyles = () => {
  return stylesTask(config.adminModulesStyles, production, watch);
};

const modulesStyles = () => {
  return stylesTask(config.modulesStyles, production, watch);
};

const themesLibStyles = () => {
  return stylesTask(config.themesLibStyles, production, watch);
};

const themesStyles = () => {
  return stylesTask(config.themesStyles, production, watch);
};

const webpack = () => {
  return webpackTask(config.webpack, production, watch);
};

const copy = () => {
  return copyTask(config.copy, watch);
};

const startServer = next => {
  return startServerTask(config.server, watch, next);
};

const getParallelTasks = () => {
  return gulp.parallel(adminModulesStyles, modulesStyles, themesLibStyles, themesStyles, webpack, copy);
};

/**************************************************************************************
 Main Gulp Tasks
 **************************************************************************************/

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
const buildAndWatch = gulp.series(enableWatch, clean, lint, getParallelTasks(), startServer);

const build = gulp.series(clean, lint, getParallelTasks());

module.exports = {
  default: buildAndWatch,
  buildAndWatch: buildAndWatch,
  build: build,
  copy: copy,
  webpack: webpack,
  lint: lint,
};
