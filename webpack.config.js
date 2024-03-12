const webpack = require('webpack')

const CleanPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
const ManifestPlugin = require('webpack-manifest-plugin').WebpackManifestPlugin
const { ModuleFederationPlugin } = require('@module-federation/enhanced')

const { dependencies } = require('./package.json')
const path = require('path')

module.exports = {
  mode: 'development',

  devtool: 'eval-cheap-module-source-map',

  context: path.resolve(__dirname, './web-legacy'),

  entry: {
    'app': [
      './index.js'
    ],
  },

  output: {
    filename: '[name].[fullhash].js',
    chunkFilename: '[name].[fullhash].js',
    path: path.resolve(__dirname, './public/build-legacy/'),
    pathinfo: true,
    publicPath: '/public/build-legacy/',
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
      basePath: 'public/build-legacy/',
      writeToFileEmit: true,
    }),
    new ModuleFederationPlugin({
      name: 'host',
      remoteType: 'script',
      remotes: {
        buildNext: 'buildNext@/build-next/mf-manifest.json',
      },
      shared: {
        'tiny-emitter': {
          eager: true,
          singleton: true,
          requiredVersion: dependencies['tiny-emitter'],
        },
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