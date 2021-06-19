const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack')

const paths = {
  DIST: path.resolve(__dirname, '../dist'),
  SRC: path.resolve(__dirname, '../src'),
  PUB: path.resolve(__dirname, '../src'),
  WBP: path.resolve(__dirname, '../webpack')
}

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
      extensions: ['.js', '.jsx'],
      alias: {
        Components: path.resolve(__dirname, '../src/components/'),
        Helpers: path.resolve(__dirname, '../src/components/Helpers'),
        Theme$: path.resolve(__dirname, '../src/styles/theme.js'),
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                // ... other options
                plugins: [
                  // ... other plugins
                ].filter(Boolean),
              },
            },
          ]
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
            loader: path.resolve(__dirname, '../src/utils/sassVarsToLess.js') // Change path if necessary
          }
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
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
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: '@svgr/webpack',
              options: {
                babel: false,
                icon: true,
              },
            },
          ],
        }
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        Components: path.resolve(__dirname, '../src/components'),
        Assets: path.resolve(__dirname, '../src/assets'),
        Config: path.resolve(__dirname, '../src/config'),
        Helpers: path.resolve(__dirname, '../src/components/Helpers'),
        Theme$: path.resolve(__dirname, '../src/styles/theme.js'),
        Styles: path.resolve(__dirname, '../src/styles'),
        Utils: path.resolve(__dirname, '../src/utils'),
        Redux: path.resolve(__dirname, '../src/redux'),
      }
    },
    // Dev server configuration -> ADDED IN THIS STEP
    // Now it uses our "src" folder as a starting point
    devServer: {
      contentBase: paths.SRC,
      historyApiFallback: true,
      compress: true,
      disableHostCheck: true //for ngrok
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
        'process.env.AUTH_DOMAIN': JSON.stringify(process.env.AUTH_DOMAIN),
        'process.env.DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
        'process.env.PROJECT_ID': JSON.stringify(process.env.PROJECT_ID),
        'process.env.STORAGE_BUCKET': JSON.stringify(process.env.STORAGE_BUCKET),
        'process.env.MESSAGING_SENDER_ID': JSON.stringify(process.env.MESSAGING_SENDER_ID),
        'process.env.APP_ID': JSON.stringify(process.env.APP_ID),
      }),
      new HtmlWebpackPlugin({
        template: path.join(paths.PUB, 'index.html'),
      }),
      new MiniCssExtractPlugin({ filename: 'style.bundle.css' }),
      new CopyPlugin({
        patterns: [
          {
            from: "src/assets",
            to: "../dist/assets",
          },
        ],
      }),
    ],
  }
}
