import path from "path";
import nodeExternals from "webpack-node-externals";

const template = {
    target: "node",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    "useBuiltIns": "usage",
                                    corejs: { version: 3, proposals: true },
                                    "targets": "> 0.25%, not dead",
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
    devtool: 'inline-source-map',
    externals: [
        nodeExternals(),
    ],
};

export default [{
    ...template,
    entry: {
        app: "./src/index.js"
    },
    output: {
        publicPath: "/js/",
        path: path.resolve("dist"),

        filename: "[name].cjs",
        libraryTarget: "commonjs2",
        globalObject: 'this',
        libraryExport: "default",
    },
}];