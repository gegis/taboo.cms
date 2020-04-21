const less = require('gulp-less');

module.exports = {
  lint: [
    'app/**/*.js',
    'lib/**/*.js',
    'app/**/*.jsx',
    '!app/assets/scripts/lib/**/*.js',
    '!app/modules/**/client/scripts/lib/**/*.js',
  ],
  clean: ['public/js', 'public/css', 'public/fonts', 'public/images'],
  server: {
    startScript: 'index.js',
    watch: ['app', 'config'],
    ext: 'js ejs',
    ignore: [
      'app/modules/**/client',
      'app/themes/**/client',
      'app/themes/',
      'app/themes/uiTemplates.js',
      'app/themes/uiTemplatesSettings.js',
    ],
    environment: 'production',
  },
  webpack: {
    src: './app/modules/core/client/index.jsx',
    entry: {
      app: './app/modules/core/client/index.jsx',
      admin: './app/modules/core/client/admin.jsx',
    },
    output: {
      path: `${__dirname}/../public/js/`,
      publicPath: '/js/',
      filename: '[name].bundle.js',
    },
    watch: [
      'app/modules/**/client/**/*.js',
      'app/modules/**/client/**/*.jsx',
      'app/locales',
      'app/themes/**/client/**/*.js',
      'app/themes/**/client/**/*.jsx',
      'app/themes/uiTemplates.js',
      'app/themes/uiTemplatesSettings.js',
    ],
  },
  // libScripts: {
  //   src: ['app/assets/scripts/lib/**/*.js', 'app/modules/**/client/scripts/lib/**/*.js'],
  //   dest: {
  //     file: 'lib.js',
  //     path: 'public/js',
  //   },
  //   watch: ['app/assets/scripts/lib/**/*.js', 'app/modules/**/client/scripts/lib/**/*.js'],
  //   babel: true,
  // },
  // adminLibStyles: {
  //   src: ['app/assets/styles/admin/lib/lib.less'],
  //   dest: {
  //     file: 'admin.lib.css',
  //     path: 'public/css',
  //   },
  //   watch: ['app/assets/styles/admin/lib.less', 'app/assets/styles/admin/vars.less'],
  //   preProcessor: less.bind(this, { javascriptEnabled: true }),
  // },
  adminModulesStyles: {
    src: ['app/modules/**/client/styles/admin/index.less'],
    dest: {
      file: 'admin.modules.css',
      path: 'public/css',
    },
    watch: ['app/modules/**/client/styles/admin/**.less'],
    preProcessor: less.bind(this, { javascriptEnabled: true }),
  },
  // appLibStyles: {
  //   src: ['app/assets/styles/lib/lib.less'],
  //   dest: {
  //     file: 'lib.css',
  //     path: 'public/css',
  //   },
  //   watch: ['app/assets/styles/lib/**/*.less', 'app/modules/templates/client/themesAssets/styles/vars.less'],
  //   preProcessor: less.bind(this, { javascriptEnabled: true }),
  // },
  modulesStyles: {
    src: ['app/modules/**/client/styles/index.less'],
    dest: {
      file: 'modules.css',
      path: 'public/css',
    },
    watch: ['app/modules/**/client/styles/**/*.less', '!app/modules/**/client/styles/admin/**/*.less'],
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
  // copy: {
  //   paths: [
  //     {
  //       src: 'app/assets/images/favicon.ico',
  //       dest: 'public',
  //     },
  //     {
  //       src: 'app/assets/fonts/**/*',
  //       dest: 'public/fonts',
  //     },
  //     {
  //       src: 'app/assets/images/**/*',
  //       dest: 'public/images',
  //     },
  //     {
  //       src: 'node_modules/rsuite/dist/styles/fonts/**/*',
  //       dest: 'public/fonts',
  //     },
  //   ],
  //   watch: ['app/assets/images/**/*', 'app/assets/fonts/**/*'],
  // },
};
