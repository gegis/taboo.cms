const less = require('gulp-less');

module.exports = {
  lint: [
    'app/**/*.js',
    'lib/**/*.js',
    'app/**/*.jsx',
    '!app/assets/scripts/lib/**/*.js',
    '!app/modules/**/client/scripts/lib/**/*.js',
  ],
  clean: ['public/js', 'public/css', 'public/fonts'],
  server: {
    startScript: 'index.js',
    watch: ['app', 'config'],
    ext: 'js html',
    ignore: ['app/modules/**/client', 'app/assets/scripts'],
    environment: 'production',
  },
  webpack: {
    src: './app/modules/core/client/admin.jsx',
    entry: {
      app: './app/assets/scripts/index.js',
      admin: './app/modules/core/client/admin.jsx',
    },
    output: {
      path: `${__dirname}/../public/js/`,
      publicPath: '/js/',
      filename: '[name].bundle.js',
    },
    watch: [
      'app/assets/scripts/**/*.js',
      '!app/assets/scripts/lib/**/*.js',
      'app/modules/**/client/**/*.js',
      '!app/modules/**/client/scripts/lib/**/*.js',
      'app/modules/**/client/**/*.jsx',
      'app/locales',
    ],
  },
  libScripts: {
    src: ['app/assets/scripts/lib/**/*.js', 'app/modules/**/client/scripts/lib/**/*.js'],
    dest: {
      file: 'lib.js',
      path: 'public/js',
    },
    watch: ['app/assets/scripts/lib/**/*.js', 'app/modules/**/client/scripts/lib/**/*.js'],
    babel: true,
  },
  adminLibStyles: {
    src: ['app/assets/styles/admin/lib.less', 'node_modules/react-quill/dist/quill.snow.css'],
    dest: {
      file: 'admin.lib.css',
      path: 'public/css',
    },
    watch: ['app/assets/styles/admin/lib.less', 'app/assets/styles/admin/vars.less'],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  adminStyles: {
    src: ['app/assets/styles/admin/index.less', 'app/modules/**/client/styles/admin/index.less'],
    dest: {
      file: 'admin.css',
      path: 'public/css',
    },
    watch: [
      'app/assets/styles/admin/**/*.less',
      'app/modules/**/client/styles/admin/index.less',
      '!app/assets/styles/admin/lib.less',
    ],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  appLibStyles: {
    src: ['node_modules/font-awesome/css/font-awesome.css', 'app/assets/styles/lib/lib.less'],
    dest: {
      file: 'lib.css',
      path: 'public/css',
    },
    watch: ['app/assets/styles/lib/**/*.less', 'app/assets/styles/vars.less'],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  appStyles: {
    src: ['app/assets/styles/index.less', 'app/modules/**/client/styles/index.less'],
    dest: {
      file: 'app.css',
      path: 'public/css',
    },
    watch: [
      'app/assets/styles/**/*.less',
      '!app/assets/styles/admin/**/*',
      '!app/assets/styles/lib/**/*',
      'app/modules/**/client/styles/**/*.less',
      '!app/modules/**/client/styles/admin/**/*.less',
    ],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  copy: {
    paths: [
      {
        src: 'app/assets/images/favicon.ico',
        dest: 'public',
      },
      {
        src: 'app/assets/fonts/**/*',
        dest: 'public/fonts',
      },
      {
        src: 'app/assets/images/**/*',
        dest: 'public/images',
      },
      {
        src: 'node_modules/rsuite/dist/styles/fonts/**/*',
        dest: 'public/fonts',
      },
    ],
    watch: ['app/assets/images/**/*', 'app/assets/fonts/**/*'],
  },
};
