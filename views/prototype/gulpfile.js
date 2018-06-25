var gulp = require('gulp'),
    srcPath = './src/',
    distPath = './build/',
    watchPaths = {
        imgs: srcPath + 'imgs/**',
        html: srcPath + '*.html',
        css: srcPath + 'css/style.css',
        sass: srcPath + 'scss/**/*.scss',
        js: srcPath + 'js/*.js'
    },
    bs = require('browser-sync').create();

// gulp.task('html', function (cb) {
//     var htmlmin = require('gulp-htmlmin');
//     return gulp.src(watchPaths.html)
//         .pipe(htmlmin({ collapseWhitespace: true }))
//         .pipe(gulp.dest(distPath));
// });

gulp.task('sass', function (cb) {
    var sass = require('gulp-sass');
    return gulp.src(srcPath + 'scss/*.scss')
        // .pipe(sass.sync().on('error', sass.logError))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(srcPath + 'css'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('css', ['sass'], function (cb) {
    var postcss = require('gulp-postcss');
    return gulp.src(watchPaths.css)
        .pipe(postcss())
        .pipe(gulp.dest(distPath + 'css'));
});

// gulp.task('imgs', function(cb) {
//     var imagemin = require('gulp-imagemin');
//     var pngquant = require('imagemin-pngquant');
//     // gulp.task('images', ['hugo'], () => {
//     return gulp.src(watchPaths.imgs)
//         .pipe(imagemin({
//             progressive: true,
//             use: [pngquant()]
//         }))
//         .pipe(gulp.dest(distPath + 'imgs'));
// });

gulp.task('js', function (cb) {
    var uglifyjs = require('uglify-es'),
        composer = require('gulp-uglify/composer'),
        minify = composer(uglifyjs, console),
        options = {};
    return gulp.src(srcPath + 'js/scripts.js')
        .pipe(minify(options))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(distPath + 'js'));
});

gulp.task('browser-sync', function (cb) {
    bs.init({
        server: {
            baseDir: srcPath,
            routes : {// https://stackoverflow.com/questions/39301788/browser-sync-serve-node-modules-out-of-src-directory
                '/vendor' : './node_modules'
            }
        }
    });
    gulp.watch(watchPaths.sass, ['sass']);
    gulp.watch(watchPaths.html).on('change', bs.reload);
    gulp.watch(watchPaths.js).on('change', bs.reload);
});

// gulp.task('default', ['imgs', 'css', 'html']);
gulp.task('default', ['css', 'js']);
