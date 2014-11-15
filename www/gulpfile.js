var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');



//watch task
gulp.task('watch', function () {
	gulp.watch(['./scss/**/*.scss'], ['sass']);
});


gulp.task('sass', function(){
	return gulp.src('./scss/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('./css/'));
})