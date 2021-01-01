const Dotenv = require('dotenv-webpack');
const ContextReplacementPlugin = require('webpack').ContextReplacementPlugin

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new Dotenv(),
    ]
  }
};