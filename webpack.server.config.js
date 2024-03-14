module.exports = {
  mode: 'development',
  target:'node',
  devtool: 'eval-cheap-module-source-map',
  entry: './server.mjs',
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.ts',
    ],
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [['@babel/preset-env', {
            corejs: 3,
            forceAllTransforms: false,
            modules: false,
            targets: {},
            useBuiltIns: 'entry',
          }]],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-classes',
          ],
        },
      }],
    }],
  },

}