var WebpackBuildNotifierPlugin = require("webpack-build-notifier");
module.exports = {
  outputDir: "build",
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new WebpackBuildNotifierPlugin({
        title: "Vue Toastify"
      })
    ],
    watchOptions: {
      ignored: "/node_modules/"
    }
  },
  devServer: {
    open: true
  },
  css: {
    extract: process.env.NODE_ENV !== "production"
  }
};
