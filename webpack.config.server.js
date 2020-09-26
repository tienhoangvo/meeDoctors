const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const config = {
  name: 'server',
  entry: [
    path.join(process.cwd(), './server/server.js'),
  ],
  target: 'node',
  output: {
    path: path.join(process.cwd(), '/dist/'),
    filename: 'server.generated.js',
    publicPath: '/dist/',
    libraryTarget: 'commonjs2',
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}

module.exports = config
