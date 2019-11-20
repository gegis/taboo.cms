const gulp = require('gulp');
const webpack = require('webpack-stream');
const webpackConfig = require('../webpack.config');

const webpackTask = (options, production = false, watchEnabled = false) => {
  const { src, entry, output, watch, watching = false } = options;

  webpackConfig.entry = entry;
  webpackConfig.output = output;
  webpackConfig.watch = false; // we have gulp.watch for it

  if (production) {
    webpackConfig.mode = 'production';
    webpackConfig.optimization.minimize = true;
    webpackConfig.performance.hints = 'warning';
    webpackConfig.devtool = false;
  }

  if (watchEnabled && watch && !watching) {
    watchTask(options, production, watchEnabled);
  }

  return gulp
    .src(src)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(webpackConfig.output.path));
};

const watchTask = (options, production, watchEnabled) => {
  options.watching = true;
  gulp.watch(options.watch, gulp.parallel(webpackTask.bind(this, options, production, watchEnabled)));
};

module.exports = webpackTask;
