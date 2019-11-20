const nodemon = require('gulp-nodemon');

const startServerTask = (options, watchEnabled = false, next) => {
  const { startScript, ext, ignore, environment, watch } = options;
  const nodemonConfig = {
    script: startScript,
    env: { NODE_ENV: environment },
    // done: next, // this does not seem to work properly, check .on('start', ...)
  };

  let started = false;

  if (watchEnabled) {
    nodemonConfig.ext = ext;
    nodemonConfig.ignore = ignore;
    nodemonConfig.watch = watch;
  }
  const stream = nodemon(nodemonConfig);

  return stream
    .on('start', function() {
      if (!started) {
        console.info('Application is starting!');
        started = true;
        return next();
      }
    })
    .on('restart', function() {
      console.info('Restarting Application!');
    })
    .on('crash', function() {
      console.error('Application has crashed!');
      stream.emit('restart', 10); // restart the server in 10 seconds
    });
};

module.exports = startServerTask;
