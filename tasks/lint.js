const gulp = require('gulp');
const eslint = require('gulp-eslint');

const lintTask = src => {
  return gulp
    .src(src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};

module.exports = lintTask;
