const gulp = require('gulp');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const gulpBabel = require('gulp-babel');
const uglify = require('gulp-uglify');

const scriptsTask = (options, production = false, watchEnabled = false) => {
  const { src, dest, watch, babel = false, watching = false } = options;

  if (watchEnabled && watch && !watching) {
    watchTask(options, production, watchEnabled);
  }

  return gulp
    .src(src)
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(gulpif(babel, gulpBabel()))
    .pipe(gulpif(production, uglify()))
    .pipe(concat(dest.file))
    .pipe(gulpif(!production, sourcemaps.write()))
    .pipe(gulp.dest(dest.path));
};

const watchTask = (options, production, watchEnabled) => {
  options.watching = true;
  gulp.watch(options.watch, gulp.parallel(scriptsTask.bind(this, options, production, watchEnabled)));
};

module.exports = scriptsTask;
