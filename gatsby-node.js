const webpack = require("webpack");

exports.onCreateWebpackConfig = ({ actions, stage, plugins }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        util: require.resolve("util/"),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
  });
};
