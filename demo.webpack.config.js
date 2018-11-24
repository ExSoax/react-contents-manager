var path = require("path");
module.exports = {
  entry: "./demo/src/index.js",
  output: {
    path: path.resolve(__dirname, "./demo/build"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "./demo/src"),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      }
    ]
  }
};
