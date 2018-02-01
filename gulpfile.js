// Requis
var gulp = require('gulp');
var sass = require('gulp-sass');

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');


// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

// Variables de chemins
var source = './src'; // dossier de travail
var destination = './dist'; // dossier à livrer


gulp.task('sass', function () {
  return gulp.src('./src/assets/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/assets/sass/**/*.sass', ['sass']);
});




gulp.task('css', function () {
  return gulp.src(source + '/assets/css/styles.less')
    .pipe(plugins.less())
    .pipe(gulp.dest(destination + '/assets/css/'));
});


gulp.task('scripts', function() {
    return gulp.src("src/**/*.js")
        .pipe(concat('asap.js'))
        .pipe(gulp.dest("dist/js"));
});

gulp.task('js:watch', function () {
  gulp.watch('./src/**/*.js', ['scripts']);
});


gulp.task('watch', function(){
  gulp.watch('./src/**/*.js', ['scripts']);
  gulp.watch('./src/assets/sass/**/*.sass', ['sass']);
})

