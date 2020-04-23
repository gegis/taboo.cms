const less = require('gulp-less');

module.exports = {
  lint: [
    'app/**/*.js',
    'lib/**/*.js',
    'app/**/*.jsx',
    '!app/assets/scripts/lib/**/*.js',
    '!app/modules/**/ui/scripts/lib/**/*.js',
  ],
  clean: ['public/js', 'public/css', 'public/fonts', 'public/images'],
  server: {
    startScript: 'index.js',
    watch: ['app', 'config'],
    ext: 'js ejs',
    ignore: [
      'app/modules/**/ui',
      'app/themes/**/ui',
      'app/themes/**/assets',
      'app/themes/uiTemplates.js',
      'app/themes/uiTemplatesSettings.js',
    ],
    environment: 'production',
  },
  webpack: {
    src: './app/modules/core/ui/index.jsx',
    entry: {
      app: './app/modules/core/ui/index.jsx',
      admin: './app/modules/core/ui/admin.jsx',
    },
    output: {
      path: `${__dirname}/../public/js/`,
      publicPath: '/js/',
      filename: '[name].bundle.js',
    },
    watch: [
      'app/modules/**/ui/**/*.js',
      'app/modules/**/ui/**/*.jsx',
      'app/locales',
      'app/themes/**/config.js',
      'app/themes/**/ui/**/*.js',
      'app/themes/**/ui/**/*.jsx',
      'app/themes/uiTemplates.js',
      'app/themes/uiTemplatesSettings.js',
    ],
  },
  adminModulesStyles: {
    src: ['app/modules/**/ui/styles/admin/index.less'],
    dest: {
      file: 'admin.modules.css',
      path: 'public/css',
    },
    watch: ['app/modules/**/ui/styles/admin/**.less'],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  modulesStyles: {
    src: ['app/modules/**/ui/styles/index.less'],
    dest: {
      file: 'modules.css',
      path: 'public/css',
    },
    watch: ['app/modules/**/ui/styles/**/*.less', '!app/modules/**/ui/styles/admin/**/*.less'],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  themesLibStyles: {
    src: ['app/themes/**/assets/styles/lib/lib.less'],
    dest: {
      file: null, // do not concat
      path: 'public/css',
    },
    watch: ['app/themes/**/assets/styles/lib/lib.less', 'app/themes/**/assets/styles/vars.less'],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  themesStyles: {
    src: ['app/themes/**/assets/styles/index.less'],
    dest: {
      file: null, // do not concat
      path: 'public/css',
    },
    watch: ['app/themes/**/assets/styles/*.less'],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  copy: {
    paths: [
      {
        src: 'app/themes/standard/assets/images/favicon.ico',
        dest: 'public',
      },
      {
        src: 'app/themes/**/assets/fonts/**/*',
        dest: 'public/fonts',
        flattenLevel: 0,
      },
      {
        src: 'app/themes/**/assets/images/**/*',
        dest: 'public/images',
      },
      {
        src: 'node_modules/rsuite/dist/styles/fonts/**/*',
        dest: 'public/fonts',
      },
    ],
    watch: ['app/themes/**/assets/images/**/*', 'app/themes/**/assets/fonts/**/*'],
  },
};
