const path = require('path');

module.exports = {
  entry: {
    app: './app/modules/core/client/index.jsx',
    admin: './app/modules/core/client/admin.jsx',
  },
  output: {
    path: __dirname + '/public/js/',
    publicPath: '/js/',
    filename: '[name].bundle.js',
  },
  watch: false,
  mode: 'development',
  devtool: 'source-map',
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks) {
            // Separates admin and app vendors and splits some vendors into separate bundles
            // Shared vendors go to common.vendor.bundle.js
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            let name = `${chunks[0].name}.vendor`; // basically splits vendors by entry names
            if (chunks.length > 1) {
              name = 'common.vendor';
            }
            // splits specific modules into separate bundles
            if (['@material-ui', 'rsuite', 'moment'].indexOf(packageName) !== -1) {
              name = packageName.replace('@', '');
            }
            return name;
          },
        },
      },
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 2048000,
    maxAssetSize: 512000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    mainFields: ['browser', 'module', 'main'],
    alias: {
      app: path.resolve(__dirname, 'app/'),
      modules: path.resolve(__dirname, 'app/modules'),
    },
  },
};
