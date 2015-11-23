/* jshint -W097*/
/* jshint node:true */

'use strict';

var browersync = require('browser-sync');
var gulp = require('gulp');
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var $ = require('gulp-load-plugins')();
var config = {
    dist:{
      css: './public/css'
    },
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
        './*.html',
    ];

    browersync.init(files, {
        server: {
            baseDir: './'
        }
    });
});

gulp.task("build:less", function(){
    return gulp.src('./src/less/*.less')
        .pipe($.plumber({errorHandler: function (err) {
            // 处理编译less错误提示  防止错误之后gulp任务直接中断
            // $.notify.onError({
            //           title:    "编译错误",
            //           message:  "错误信息: <%= error.message %>",
            //           sound:    "Bottle"
            //       })(err);
            console.log(err);
            this.emit('end');
        }}))
        .pipe($.less())
        /*        .pipe($.rename(function(path) {
         if (path.basename === 'zwui') {
         path.basename = pkg.name + '.basic';
         }
         }))*/
        .pipe($.autoprefixer({browsers: config.AUTOPREFIXER_BROWSERS}))
        //.pipe($.replace('//dn-amui.qbox.me/font-awesome/4.3.0/', '../'))
        //.pipe(gulp.dest(config.dist.css))
        .pipe($.size({showFiles: true, title: 'source'}))
        // Disable advanced optimizations - selector & property merging, etc.
        // for Issue #19 https://github.com/allmobilize/amazeui/issues/19
        .pipe($.minifyCss({noAdvanced: true}))
        .pipe($.rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(gulp.dest(config.dist.css))
        .pipe($.size({showFiles: true, title: 'minified'}))
        .pipe($.size({showFiles: true, gzip: true, title: 'gzipped'}));
});

gulp.task('watch', function(){
    gulp.watch(['src/less/*.less'], ['build:less']);
    //gulp.watch(['src/css/*.css'], ['webpack']);
    gulp.watch(['src/**/*.js'], ['webpack']);
    gulp.watch(['src/tpl/*.html'], ['webpack']);
});


gulp.task('default',['webpack', 'watch', 'appServer']);