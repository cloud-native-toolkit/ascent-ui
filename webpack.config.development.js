const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const config = require('./config/config');

const port = config.servicePort;

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: 'static/[name].[fullhash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    }
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource',
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv()
  ],
  devServer: {
    onBeforeSetupMiddleware: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      devServer.app.get('/userDetails', function (req, res) {
        res.json({
          name: 'NoeSamaille',
          email: 'noe.samaille@ibm.com',
          given_name: 'Noé',
          family_name: 'Samaille',
          roles: ['default', 'editor', 'admin'],
          role: 'admin',
          region: 'eu-de',
          sessionExpire: new Date(Date.now() + 3600 * 1000)
        });
      });
    },
    host: 'localhost',
    port,
    historyApiFallback: true,
    open: true,
    hot: true,
    proxy: {
      '/api': {
        target: config.apiHost,
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
};
