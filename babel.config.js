let preset = ["@vue/app"];
if (process.env.IS_COMPILE) {
  preset = [
    [
      "@vue/app",
      {
        useBuiltIns: false
      }
    ]
  ];
}

module.exports = {
  presets: preset,
  env: {
    test: {
      presets: [["env", { targets: { node: "current" } }]]
    }
  }
};
