const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const port = process.env.PORT || 3000;

module.exports = {
  // Webpack configuration goes here
  mode: 'development',
  entry: {
    vendor: ['carbon-icons', 'carbon-components', 'carbon-components-react', 'carbon-addons-iot-react', '@carbon/icons-react'],
    app: './src/index.js',
  },
  output: {
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
        "react-dom": "@hot-loader/react-dom",
    }
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'PUBLIC_URL': '"http://localhost:3000"'
      }
    })  
  ],
  devServer: {
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    open: true,
    hot: true,
  }
};
