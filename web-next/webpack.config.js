const webpack = require('webpack')

const CleanPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
const ManifestPlugin = require('webpack-manifest-plugin').WebpackManifestPlugin
const { ModuleFederationPlugin } = require('@module-federation/enhanced')
const { dependencies } = require('./package.json')
const path = require('path')

module.exports = {
  mode: 'development',

  devtool: 'eval-cheap-module-source-map',

  entry: {
    'app': [
      './src/index.js',
    ],
  },

  output: {
    filename: '[name].[fullhash].js',
    chunkFilename: '[name].[fullhash].js',
    path: path.resolve(__dirname, '../public/build-next/'),
    pathinfo: true,
    publicPath: 'http://localhost:8080/public/build-next/',
  },

  resolve: {
    extensions: [
      '.js',
      '.json',
      '.ts',
    ],
  },

  plugins: [
    new CleanPlugin(),
    new ManifestPlugin({
      basePath: 'public/build-next/',
      writeToFileEmit: true,
    }),
    new ModuleFederationPlugin({
      name: 'remote',
      filename: '[name].[fullhash].js',
      library: { type: 'var', name: 'buildNext' },
      exposes: {
        './emitterNext': {
          name: 'emitterNext',
          import: './src/emitter.js',
        },
      },
      shared: {
        ...dependencies,
      },
    }),
  ],

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

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        'tiny-emitter': {
          test: /node_modules\/tiny-emitter\//,
          name: 'tiny-emitter',
          chunks: 'all',
          enforce: true,
        },
        vendor: {
          test (module) {
            return module.resource && /node_modules/.test(module.resource)
          },
          name: 'vendor',
          priority: -10,
          chunks: 'all',
        },
      },
    },
  },
}