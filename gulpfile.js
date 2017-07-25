var gulp = require('gulp');
// var uglify = require('gulp-uglify');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('uglifyjs', function (cb) {
    var uglifyjs = require('uglify-es');
    var composer = require('gulp-uglify/composer');
    var minify = composer(uglifyjs, console);
	var pump = require('pump');
    var options = {};

    pump([
        gulp.src('./templates/src/js/app.js'),
        minify(options),
        gulp.dest('./templates/dist/js')
    ],
    cb
  );
});

gulp.task('postcss', function () {
    var postcss = require('gulp-postcss');

    return gulp.src('./templates/src/css/*.css')
        .pipe(postcss())
        .pipe(gulp.dest('./templates/dist/css'));
});
