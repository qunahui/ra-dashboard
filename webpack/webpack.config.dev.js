const path = require('path');
// const dotenv = require('dotenv').config({path: path.resolve(__dirname,'../.env') });
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const DefinePlugin = require('webpack/lib/DefinePlugin')
// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, '../dist'),
  SRC: path.resolve(__dirname, '../src'),
  PUB: path.resolve(__dirname, '../src'),
}
// Webpack configuration
module.exports = (env) => {
  return {
    mode: 'development',
    entry: ['babel-polyfill', path.join(paths.SRC, 'index.js')],
    output: {
      path: paths.DIST,
      filename: 'app.bundle.js',
      publicPath: '/',
    },
    resolve: {
      alias: {
        Components: path.resolve(__dirname, 'src/components/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: true,
              },
            },
            'css-loader',
          ],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: '/fonts/[name].[hash].[ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    // Dev server configuration -> ADDED IN THIS STEP
    // Now it uses our "src" folder as a starting point
    devServer: {
      contentBase: paths.SRC,
      historyApiFallback: true,
      compress: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(paths.PUB, 'index.html'),
      }),
      new MiniCssExtractPlugin({ filename: 'style.bundle.css' }),
      // new DefinePlugin({
      //   "process.env": dotenv.parsed
      // }),
      new Dotenv()
    ],
  }
}
