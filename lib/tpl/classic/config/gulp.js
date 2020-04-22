const less = require('gulp-less');
const sass = require('gulp-sass');

module.exports = {
  lint: [
    'app/**/*.js',
    'lib/**/*.js',
    'app/**/*.jsx',
    '!app/assets/scripts/lib/**/*.js',
    '!app/modules/**/ui/scripts/lib/**/*.js',
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
    src: './app/modules/core/ui/index.js',
    entry: {
      app: './app/modules/core/ui/index.js',
      admin: './app/modules/core/ui/admin.jsx',
    },
    output: {
      path: `${__dirname}/../public/js/`,
      publicPath: '/js/',
      filename: '[name].bundle.js',
    },
    watch: ['app/modules/**/ui/**/*.js', 'app/modules/**/ui/**/*.jsx', 'app/locales'],
  },
  libScripts: {
    src: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/bootstrap/dist/js/bootstrap.js',
      'app/assets/scripts/lib/**/*.js',
      'app/modules/**/ui/scripts/lib/**/*.js',
    ],
    dest: {
      file: 'lib.js',
      path: 'public/js',
    },
    watch: ['app/assets/scripts/lib/**/*.js', 'app/modules/**/ui/scripts/lib/**/*.js'],
    babel: true,
  },
  adminLibStyles: {
    src: ['app/assets/styles/admin/lib/lib.less'],
    dest: {
      file: 'admin.lib.css',
      path: 'public/css',
    },
    watch: ['app/assets/styles/admin/lib.less', 'app/assets/styles/admin/vars.less'],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  adminStyles: {
    src: ['app/assets/styles/admin/index.less', 'app/modules/**/ui/styles/admin/index.less'],
    dest: {
      file: 'admin.css',
      path: 'public/css',
    },
    watch: [
      'app/assets/styles/admin/**/*.less',
      'app/modules/**/ui/styles/admin/index.less',
      '!app/assets/styles/admin/lib.less',
    ],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  appLibStyles: {
    src: ['node_modules/font-awesome/css/font-awesome.css', 'app/assets/styles/lib/lib.scss'],
    dest: {
      file: 'lib.css',
      path: 'public/css',
    },
    watch: ['app/assets/styles/lib/**/*.scss', 'app/modules/templates/ui/themesAssets/styles/vars.scss'],
    preProcessor: sass.bind(this, { javascriptEnabled: true }),
  },
  appStyles: {
    src: ['app/assets/styles/index.scss', 'app/modules/**/ui/styles/index.scss'],
    dest: {
      file: 'app.css',
      path: 'public/css',
    },
    watch: [
      'app/assets/styles/**/*.scss',
      '!app/assets/styles/admin/**/*',
      '!app/assets/styles/lib/**/*',
      'app/modules/**/ui/styles/**/*.scss',
      '!app/modules/**/ui/styles/admin/**/*.scss',
    ],
    preProcessor: sass.bind(this, { javascriptEnabled: true }),
  },
  themeStyles: {
    src: ['app/modules/templates/ui/themes/**/styles/index.scss'],
    dest: {
      file: null, // do not concat
      path: 'public/css',
    },
    watch: [
      'app/modules/templates/ui/themes/**/styles/*.scss',
      'app/modules/templates/ui/themesAssets/styles/**/*.scss',
      '!app/modules/templates/ui/themesAssets/styles/lib/*.scss',
    ],
    preProcessor: sass.bind(this, { javascriptEnabled: true }),
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
