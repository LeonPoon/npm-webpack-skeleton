const path              = require('path');
const webpack           = require('webpack');
const htmlPlugin        = require('html-webpack-plugin');
const fs                = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const eslint = JSON.parse(fs.readFileSync(path.join(__dirname, '.eslintrc.json'), 'utf8'));

const eslintjsx = Object.assign({}, eslint);
eslintjsx.parserOptions = Object.assign({}, eslintjsx.parserOptions || {});
eslintjsx.parserOptions.ecmaFeatures = Object.assign({}, eslintjsx.parserOptions.ecmaFeatures || {});
eslintjsx.parserOptions.ecmaFeatures.jsx = true;

const PATHS = {
  app: path.join(__dirname, 'src'),
  images:path.join(__dirname,'src/assets/'),
  build: path.join(__dirname, 'dist')
};

const HTMLS = fs.readdirSync(PATHS.app).filter(function(x) { return x.endsWith('.html') });

const options = {
  host:'localhost',
  port:'8000'
};

const copyAsIs = ['css', 'js', 'partialViews', 'images'];

const extractCSS = new ExtractTextPlugin({ filename: '[name].bundle.[contenthash].js.css' })

module.exports = {
  resolve: {
    extensions: [".js", ".json", ".ts"],
  },
  entry: {
    vendors: path.join(PATHS.app, 'vendors.js'),
    app: path.join(PATHS.app, 'app.js'),
  },
  output: {
    path: PATHS.build,
    filename: '[name].bundle.[chunkhash].js'
  },
  node: { fs: 'empty' },
  devtool: 'source-map',
  devServer: {
      historyApiFallback: true,
      hot: true,
      host: options.host,
      port: options.port 
    },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: path.join(PATHS.app, 'app'),
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        })
      },
      {
        test: /\.css$/,
        include: path.join(PATHS.app, 'app'),  /* angular */
        use: [
            'raw-loader',
        ],
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
            loader: 'file-loader',
            query: {
              name: '[name].[hash].[ext]'
            }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
            {
                loader: 'babel-loader',
                query: {
                  presets: ['env']
                }
            },
            {
                loader: 'eslint-loader',
                query: eslint,
            }
        ],
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: [
            {
                loader: 'babel-loader',
                query: {
                  presets: ['env', 'react']
                }
            },
            {
                loader: 'eslint-loader',
                query: eslintjsx,
            },
        ],
      },
      {
          test: /\.ts$/,
          use: [
            'ts-loader',
            'angular2-template-loader',
          ],
          exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
    ]
  },
  plugins:[
    new CleanWebpackPlugin(PATHS.build),
    extractCSS,
    new webpack.optimize.CommonsChunkPlugin({name: 'vendors'}),
    new htmlPlugin(),
  ].concat(HTMLS.map(function(x) {
    return new htmlPlugin({
      template:path.join(PATHS.app, x),
      filename:x,
    });
  }))
};
