var WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const path = require("path");
module.exports = {
    outputDir: "build",
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new WebpackBuildNotifierPlugin({
                title: "Vue Toastify"
            })
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                // Resolve this so that the App will be able to see the type defintitions
                "vue-toastify": path.resolve(__dirname, "src/VueToastify.js")
            }
        },
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
