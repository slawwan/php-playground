/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: true,
              },
            },
          },
          "less-loader",
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    compress: true,
    port: 5556,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
};
