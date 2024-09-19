const path = require('path');
const PugPlugin = require('pug-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode,
  output: {
    path: path.join(__dirname, 'dist/'),
    assetModuleFilename: "assets/[hash][ext][query]",
    clean: true,
  },

  entry: {
    // define Pug files here
    index: './src/index.pug',
    catalog: './src/catalog.pug',
    productCard: './src/productCard.pug'
  },

  plugins: [
    new PugPlugin({
      js: {
        filename: 'js/[name].[contenthash:8].js', // output filename of JS
      },
      css: {
        filename: 'css/[name].[contenthash:8].css', // output filename of CSS
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|)$/i,
        type: 'asset/resource',
      },
    ],
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true, // Открывает браузер при запуске
    compress: true,
    port: 9000, // Порт, который ты хочешь использовать
    devMiddleware: {
      index: 'index.html', // Открыть catalog.html вместо index.html
    },
  },

  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['pngquant', { quality: [0.65, 0.80], speed: 4 }],
            ],
          },
        },
      }),
    ],
  },
};
