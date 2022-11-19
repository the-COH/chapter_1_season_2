const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          process: require.resolve("process/browser"),
          stream: require.resolve("stream-browserify"),
          path: require.resolve("path-browserify"),
          crypto: require.resolve("crypto-browserify"),
          buffer: require.resolve("buffer"),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser.js",
        }),
      ],
    },
  },
};
