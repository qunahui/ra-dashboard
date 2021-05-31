const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, '../dist'),
  SRC: path.resolve(__dirname, '../src'),
  PUB: path.resolve(__dirname, '../src'),
}
// Webpack configuration
module.exports = (env) => {
  return {
    mode: 'production',
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
          test: /\.less$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            { 
              loader: "less-loader",
              options: {
                javascriptEnabled: true //This is important!
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          issuer: {
            exclude: /\.less$/,
          },
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
          test: /\.scss$/,
          issuer: /\.less$/,
          use: {
            loader: './sassVarsToLess.js' // Change path if necessary
          }
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '/images/[name].[hash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
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
      new BundleAnalyzerPlugin(),
    ],
  }
}
