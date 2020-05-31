const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);

const config = {
  mode: 'production',
  context: __dirname,
  entry: {
    global: './eahub/base/static/global/main.js',
    vendor: './eahub/base/static/vendor/main.js',

    component_maps: './eahub/base/static/components/maps/main.js',
    component_group_page_actions: './eahub/base/static/components/group-page-actions.js',
    component_multiselect_forms: './eahub/base/static/components/multiselect-forms.js',
    component_profile_edit_image: './eahub/base/static/components/profile-edit-image.js',
    component_tables: './eahub/base/static/components/tables.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve('./eahub/base/static/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.svg$/i,
        loader: 'svg-url-loader',
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
              plugins: () => {
                return [
                  require('precss'),
                  require('autoprefixer'),
                ];
              },
              hmr: true,
            }
          },
          {loader: 'css-loader', options: {sourceMap: true}},
          {loader: 'sass-loader', options: {sourceMap: true}},
        ]
      },
      {
          test: /\.(ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: '../../static/fonts/'
              }
          }]
      },
      {
        // images
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                hash: 'sha512',
                digest: 'hex',
                name: '[name].[ext]',
              }
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                bypassOnDebug: 'true',
                mozjpeg: {progressive: true},
                gifsicle: {interlaced: true},
                optipng: {optimizationLevel: 7},
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: "url-loader",
          options: {
            // Limit at 50k. Above that it emits separate files
            limit: 50000,

            // url-loader sets mimetype if it's passed.
            // Without this it derives it from the file extension
            mimetype: "application/font-woff",

            // Output below fonts directory
            name: "../../static/fonts/[name].[ext]",
          }
        }
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js',],
    modules: [
      path.resolve('eahub/base/static'),
      'node_modules'
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, `eahub/base/static`),
    headers: {'Access-Control-Allow-Origin': '*'},
    host: '0.0.0.0',
    port: 8090,
    hot: true,
    inline: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    new MiniCssExtractPlugin({filename: '[name].css'}),
  ],
}


const isDevelopmentMode = process.env.NODE_ENV !== 'prod';
if (isDevelopmentMode) {
    config.mode = 'development';
    config.devtool = 'eval-source-map';
    config.output.filename = '[name].bundle.js';
    config.output.publicPath = 'http://localhost:8090/assets/';
}

const isDockerMode = process.env.NODE_ENV === 'docker';
if (isDockerMode) {
    config.devServer.watchOptions = {
        poll: 100, // enable polling since fsevents are not supported in docker
    }
}

module.exports = config;
