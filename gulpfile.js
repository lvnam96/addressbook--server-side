var gulp = require('gulp'),
    pump = require('pump'),
    rename = require('gulp-rename'),
    srcPath = './templates/src/',
    distPath = './templates/dist/',
    // Files/Paths that need to be watched by gulp
    watchPaths    = {
        css: [srcPath + 'css/style.css'],
        sass: [srcPath + 'scss/*.scss'],
        js:   [srcPath + 'js/app.js']
    };


gulp.task('sass', function (cb) {
    var sass = require('gulp-sass');
    pump([
        gulp.src(srcPath + 'scss/*.scss'),
        sass().on('error', sass.logError),
        gulp.dest(srcPath + 'css')
    ], cb);
});

gulp.task('js', function (cb) {
    var uglifyjs = require('uglify-es'),
        composer = require('gulp-uglify/composer'),
        minify = composer(uglifyjs, console),
        options = {};

    pump([
        gulp.src(srcPath + 'js/app.js'),
        minify(options),
        rename({ suffix: '.min' }),
        gulp.dest(distPath + 'js')
    ], cb);
});

gulp.task('css', function (cb) {
    var postcss = require('gulp-postcss');

    pump([
        gulp.src(srcPath + 'css/style.css'),
        postcss(),
        rename({ suffix: '.min' }),
        gulp.dest(distPath + 'css')
    ], cb);
});

// The watch task will be executed upon each file change
gulp.task('watch', function() {
    gulp.watch(watchPaths.js, ['js']);
    gulp.watch(watchPaths.css, ['css']);
    gulp.watch(watchPaths.sass, ['sass']);
});

// Default task is executed upon execution of gulp
gulp.task('default', ['css', 'js', 'watch']);
