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

            // stops plugin errors killing the Watch task
            if (config.exitOnError) {
                process.exit(1);
            }
        };

        cfg.isDebug = function () {
            return cfg.env === 'debug';
        };

        cfg.uglifySettings = {
            mangle: false
        };

        // Would be better to use something like require.js.
        // For simplicity, ordering js scripts in order of dependency.
        cfg.jsDependency = ['http.service.js', 'animate.js', 'menu.js'];

        return cfg;
    })();

    // Default Task
    gulp.task('default', ['watch']);

    // Watch Tasks
    gulp.task('watch', ['build:debug', 'connect'], function() {
        config.exitOnError = false;
        gulp.watch('./src/**/*.js', ['js']);
        gulp.watch('./src/index.html', ['index']);
    });

    /*** Build ***/
    gulp.task('build:debug', function(done) {
        config.env = 'debug';
        $.sequence('clean:debug', ['js', 'json'], 'index', done);
    });

    gulp.task('build:release', function(done) {
        config.env = 'release';
        $.sequence('clean:release', ['js', 'json'], 'index', done);
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

    gulp.task('json', function () {
        return gulp
            .src(['./src/**/*.json'])
            .pipe(gulp.dest(config.destDir()))
            .pipe(reload({
                stream: true
            }));
    });

    gulp.task('js', function() {
        return gulp
            .src(['./src/js/*.js'])
            .pipe($.order(config.jsDependency, { base: '.' }))
            .pipe($.if(!config.isDebug(), $.concat('app.js')))
            .pipe($.if(!config.isDebug(), $.uglify(config.uglifySettings)))
            .pipe(gulp.dest(config.destDir() + '/js'))
            .pipe(reload({
                stream: true
            }));
    });
    
    gulp.task('index', function() {
        var sources = gulp
            .src(['./**/*.js'], {
                read: false,
                cwd: config.destDir()
            })
            .pipe($.order(config.jsDependency, { base: config.destDir() + '/js' }));

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
        browserSync({
            logLevel: 'silent',
            open: false
        });
    });

    gulp.task('connect', ['build:debug'], function() {
        $.connect.server({
            port: 3000,
            root: config.destDir(),
            proxy: 'localhost:3000'
        });

        return gulp
            .src(config.destDir() + '/index.html')
            .pipe($.open('', {
                url: 'http://localhost:3000'
            }));
    });
})();