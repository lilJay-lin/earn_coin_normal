/**
 * Created by linxiaojie on 2015/11/17.
 */
var path = require('path');
var webpack = require('webpack');
//var commonsPlugin = webpack.optimize.CommonsChunkPlugin;
//var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'source-map',
    entry: {
        app: './src/index',
        //common: ['jquery']
    },
    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js'],
        alias: {
            //css: "src/css"
            /*            component: "src/react",
             reducers: "src/reducers"*/
        }
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/public/'
    },
    plugins: [
        /*new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()*/
        //new  commonsPlugin('common', 'common.js')
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
                //loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.html$/,
                 loader: 'mustache?{ minify: { removeComments: false } }'
                // loader: 'mustache?minify'
                // loader: 'mustache?noShortcut'
            }
        ]
    }
};
