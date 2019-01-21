const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const count = require('gulp-count')

gulp.task('styles', () => {
  return gulp
    .src('./dev/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./public/styles'))
    .pipe(count('## scss-files selected'))
});

gulp.task('scripts', () => {
  return gulp
    .src('./dev/scripts/**/*.js')
    .pipe(
      babel({
        presets: ['@babel/env']
      })
      )
      .pipe(count('## js-files selected'))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./public/scripts'))
});

gulp.task('watch', function () {
  gulp.watch('./dev/styles/**/*.scss', ['styles']);
  gulp.watch('./dev/scripts/**/*.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'watch']);