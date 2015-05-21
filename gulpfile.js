(function() {
    'use strict';

    var gulp = require('gulp'),
        $ = require('gulp-load-plugins')(),
        del = require('del'),
        browserSync = require('browser-sync'),
        reload = browserSync.reload;

    /** Configuration & Helper Methods **/
    var config = (function () {
        var cfg = {};
        cfg.port = 3000;
        cfg.exitOnError = true;
        cfg.env = 'debug';
        
        cfg.destDir = function () {
            return ['./dist/', cfg.env].join('');
        };
                        
        cfg.handleError = function (error) {
            var errorMessage = $.util.colors.red(error);
            $.util.log(errorMessage);

            if (config.exitOnError) { // stops plugin errors killing the Watch task
                process.exit(1);
            }
        };

        cfg.isDebug = function () {
            return cfg.env === 'debug';
        };

        cfg.uglifySettings = {
            mangle: false
        };

        return cfg;
    })();

    // Default Task
    gulp.task('default', ['build:debug', 'watch']);
    gulp.task('release', ['build:release', 'watch']);

    // Watch Tasks
    gulp.task('watch', ['browser-sync'], function() {
        config.exitOnError = false;
        gulp.watch('./src/**/*.js', ['js']);
        gulp.watch('./src/index.html', ['index']);
    });

    /*** Build ***/
    gulp.task('build:debug', function(done) {
        config.env = 'debug';
        $.sequence('clean:debug', 'js', 'index', done);
    });

    gulp.task('build:release', function(done) {
        config.env = 'release';
        $.sequence('clean:release', 'js', 'index', done);
    });

    /*** Clean ***/
    gulp.task('clean:debug', function(done) {
        config.env = 'debug';
        del(config.destDir(), {
            force: true
        }, done);
    });

    gulp.task('clean:release', function(done) {
        config.env = 'release';
        del(config.destDir(), {
            force: true
        }, done);
    });

    gulp.task('js', function() {
        return gulp
            .src(['./src/js/*.js'])
            .pipe($.if(!config.isDebug(), $.concat('app.js')))
            .pipe($.if(!config.isDebug(), $.uglify(config.uglifySettings)))
            .pipe(gulp.dest(config.destDir() + '/js'))
            .pipe(reload({
                stream: true
            }));
    });
    
    gulp.task('index', function() {
        var sources = gulp
            .src(['./**/*.css', './**/*.js'], {
                read: false,
                cwd: config.destDir()
            });

        return gulp
            .src('./src/index.html')
            .pipe($.inject(sources))
            .pipe(gulp.dest(config.destDir()))
            .pipe(reload({
                stream: true
            }));
    });

    /*** Serve & Reload ***/
    gulp.task('browser-sync', function() {
        browserSync.init({
            server: {
                baseDir: config.destDir()
            }
        });
    });
})();