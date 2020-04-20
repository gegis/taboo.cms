const gulp = require('gulp');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');

const stylesTask = (options, production = false, watchEnabled = false) => {
  let { src, dest, watch, preProcessor = null, watching = false } = options;
  let usePreProcessor = false;
  if (preProcessor) {
    usePreProcessor = true;
  } else {
    preProcessor = () => {
      return {};
    };
  }

  if (watchEnabled && watch && !watching) {
    watchTask(options, production, watchEnabled);
  }

  // gulp-concat does not work with gulp-if......
  if (dest.file) {
    return streamWithConcat(src, production, usePreProcessor, preProcessor, dest);
  } else {
    return streamWithoutConcat(src, production, usePreProcessor, preProcessor, dest);
  }
};

const streamWithConcat = (src, production, usePreProcessor, preProcessor, dest) => {
  return gulp
    .src(src)
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(gulpif(usePreProcessor, preProcessor()))
    .pipe(gulpif(production, cleanCSS({ compatibility: 'ie8' })))
    .pipe(concat(dest.file))
    .pipe(gulpif(!production, sourcemaps.write()))
    .pipe(gulp.dest(dest.path));
};

const streamWithoutConcat = (src, production, usePreProcessor, preProcessor, dest) => {
  return gulp
    .src(src)
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(gulpif(usePreProcessor, preProcessor()))
    .pipe(gulpif(production, cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulpif(!production, sourcemaps.write()))
    .pipe(gulp.dest(dest.path));
};

const watchTask = (options, production, watchEnabled) => {
  options.watching = true;
  gulp.watch(options.watch, gulp.parallel(stylesTask.bind(this, options, production, watchEnabled)));
};

module.exports = stylesTask;
