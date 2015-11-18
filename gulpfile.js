/* jshint -W097*/
/* jshint node:true */

'use strict';

var browersync = require('browser-sync');
var gulp = require('gulp');
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
/*
var config = {
    AUTOPREFIXER_BROWSERS: [
        'ie >= 8',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 2.3',
        'bb >= 10'
    ],
    uglify: {
        compress: {
            warnings: false
        },
        output: {
            ascii_only: true
        }
    }
};
*/


gulp.task("webpack", function(callback) {
    var myConfig = Object.create(webpackConfig);
    // run webpack
    webpack(
        // configuration
        myConfig
        , function(err, stats) {
            // if(err) throw new gutil.PluginError("webpack", err);
            // gutil.log("[webpack]", stats.toString({
            //     // output options
            // }));
            callback();
            //this.emit('end');//报错不中断
        });
});

gulp.task('appServer',function(){
    var files = [
        './public',
        './index.html',
    ];

    browersync.init(files, {
        server: {
            baseDir: './'
        }
    });
});


gulp.task('watch', function(){
    gulp.watch(['src/css/*.css'], ['webpack']);
    gulp.watch(['src/**/*.js'], ['webpack']);
    gulp.watch(['src/tpl/*.html'], ['webpack']);
});


gulp.task('default',['webpack', 'watch', 'appServer']);