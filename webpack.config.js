const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js',
  }, 
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      url: require.resolve('url'),
      util: require.resolve('util'),
      os: require.resolve('os-browserify/browser'),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
      path: require.resolve("path-browserify"),
      fs: false,
      worker_threads: false,
    }
  },
  plugins: [
    new Dotenv(),
  ],
}