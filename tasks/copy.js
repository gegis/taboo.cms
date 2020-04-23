const gulp = require('gulp');
const flatten = require('gulp-flatten');
const mergeStream = require('merge-stream');

const copyTask = (options, watchEnabled = false) => {
  const { paths = [], watch, watching = false } = options;
  const tasks = paths.map(copyItem => {
    let flattenLevel = 1;
    if (typeof copyItem.flattenLevel !== 'undefined') {
      flattenLevel = copyItem.flattenLevel;
    }
    return gulp
      .src(copyItem.src)
      .pipe(flatten({ includeParents: flattenLevel }))
      .pipe(gulp.dest(copyItem.dest));
  });

  if (watchEnabled && watch && !watching) {
    watchTask(options, watchEnabled);
  }

  return mergeStream(tasks);
};

const watchTask = (options, watchEnabled) => {
  options.watching = true;
  gulp.watch(options.watch, gulp.parallel(copyTask.bind(this, options, watchEnabled)));
};

module.exports = copyTask;
