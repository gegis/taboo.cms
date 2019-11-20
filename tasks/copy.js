const gulp = require('gulp');
const mergeStream = require('merge-stream');

const copyTask = (options, watchEnabled = false) => {
  const { paths = [], watch, watching = false } = options;
  const tasks = paths.map(copyItem => {
    return gulp.src(copyItem.src).pipe(gulp.dest(copyItem.dest));
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
