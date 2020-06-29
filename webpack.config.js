const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    'JSTable': ['./src/index.js'],
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    filename: '[name].js',
  },
  module: { 
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
    ]
  },
  plugins: []
};
