var WebpackBuildNotifierPlugin = require("webpack-build-notifier");
module.exports = {
  outputDir: "build",
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new WebpackBuildNotifierPlugin({
        title: "Vue Toastify"
      })
    ]
  }
};
