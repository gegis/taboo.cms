const gulp = require('gulp');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const flatten = require('gulp-flatten');

const stylesTask = (options, production = false, watchEnabled = false) => {
  let { src, dest, watch, preProcessor = null, watching = false, flattenLevel = 1 } = options;
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
    return streamWithConcat({ src, production, usePreProcessor, preProcessor, dest, flattenLevel });
  } else {
    return streamWithoutConcat({ src, production, usePreProcessor, preProcessor, dest, flattenLevel });
  }
};

const streamWithConcat = ({ src, production, usePreProcessor, preProcessor, dest, flattenLevel }) => {
  // TODO remove this logging
  return gulp
    .src(src)
    .pipe(gulpif(!production, sourcemaps.init()))
    .on('error', console.log)
    .pipe(gulpif(usePreProcessor, preProcessor().on('error', console.log)))
    .on('error', console.log)
    .pipe(gulpif(production, cleanCSS({ compatibility: 'ie8' })))
    .on('error', console.log)
    .pipe(concat(dest.file))
    .on('error', console.log)
    .pipe(gulpif(!production, sourcemaps.write()))
    .on('error', console.log)
    .pipe(flatten({ includeParents: flattenLevel }))
    .on('error', console.log)
    .pipe(gulp.dest(dest.path));
};

const streamWithoutConcat = ({ src, production, usePreProcessor, preProcessor, dest, flattenLevel }) => {
  return gulp
    .src(src)
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(gulpif(usePreProcessor, preProcessor()))
    .pipe(gulpif(production, cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulpif(!production, sourcemaps.write()))
    .pipe(flatten({ includeParents: flattenLevel }))
    .on('error', console.log)
    .pipe(gulp.dest(dest.path));
};

const watchTask = (options, production, watchEnabled) => {
  options.watching = true;
  gulp.watch(options.watch, gulp.parallel(stylesTask.bind(this, options, production, watchEnabled)));
};

module.exports = stylesTask;
