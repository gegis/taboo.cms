const del = require('del');

const cleanTask = (destinations = [], copy = {}) => {
  const cleanPaths = destinations.slice();
  copy.paths.map(item => {
    if (item.dest !== 'public' && cleanPaths.indexOf(item.dest) === -1) {
      cleanPaths.push(item.dest);
    }
  });
  return del(cleanPaths);
};

module.exports = cleanTask;
