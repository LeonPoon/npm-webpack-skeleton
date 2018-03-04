const path              = require('path');
const webpack           = require('webpack');
const htmlPlugin        = require('html-webpack-plugin');
const fs                = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

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

const extractCSS = new ExtractTextPlugin({ filename: '[name].bundle.[hash].js.css' })

module.exports = {
  entry: {
    vendors: path.join(PATHS.app, 'vendors.js'),
    app: path.join(PATHS.app, 'app.js'),
  },
  output: {
    path: PATHS.build,
    filename: '[name].bundle.[hash].js'
  },
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
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        })
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
            'eslint-loader',
        ],
      }
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
      inject:false
    });
  }))
};
