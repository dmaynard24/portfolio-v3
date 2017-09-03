var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    minify = require('gulp-clean-css'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence'),
    wrap = require('gulp-wrap'),
    browserSync = require('browser-sync').create();

/* --------------------------- development process for building ---------------------------------  */
gulp.task('default', function(callback) {
 runSequence('clean:dist',['sass','js','images','move:fonts','layout','move:lib','video','browserSync','watch'],callback)
});

gulp.task('release', function(callback) {
 runSequence('clean:dist',['sass','js','images','move:fonts','layout','move:lib','video'],callback)
});

/* browser sync auto reloads the browser */
gulp.task('browserSync', function() {
 browserSync.init({
   server: {
     baseDir: 'dist/'
   }
 })
});

/* concats all files into a 'styles.css' converts the sass to css autoprefixes it, and moves to proper location */
gulp.task('sass', function() {
 return gulp.src(['src/scss/__*.scss', 'src/scss/_*.scss', 'src/scss/*.scss'])
   .pipe(concat('styles.css'))
   .pipe(sass())
   .pipe(autoprefixer({
     browsers: ['last 2 versions', 'android 4'],
     cascade: false
   }))
   .pipe(minify({compatibility: 'ie8'}))
   .pipe(gulp.dest('dist/css/'))
   .pipe(browserSync.reload({
     stream: true
   }))
});

/* minifies scripts.js and moves it */
gulp.task('js', function() {
 return gulp.src(['src/js/*.js','src/js/*.json'])
   .pipe(gulpIf( 'scripts.js', uglify()))
   .pipe(gulp.dest('dist/js/'))
   .pipe(browserSync.reload({
     stream: true
   }))
});

/* watchers to help browser sync auto reload */
gulp.task('watch', ['browserSync', 'sass', 'js'], function() {
 gulp.watch('src/scss/**/*.scss', ['sass']);
 gulp.watch('src/**/*.html', ['layout',browserSync.reload]);
 gulp.watch('src/js/**/*.js', ['js']);
});

/* cleans out folder */
gulp.task('clean:dist', function() {
 return del.sync('dist', {force: true});
});

/* grab all images and move them */
gulp.task('images', function() {
 return gulp.src('src/assets/img/**/*.+(png|jpg|gif|svg)')
 .pipe(gulp.dest('dist/assets/img/'))
});

gulp.task('video', function() {
 return gulp.src('src/assets/video/**/*.+(mp4|m4v|mov)')
 .pipe(gulp.dest('dist/assets/video/'))
});

gulp.task('move:fonts', function() {
 return gulp.src('src/assets/fonts/**.*')
 .pipe(gulp.dest('dist/assets/fonts/'))
});

gulp.task('move:lib', function() {
 return gulp.src('src/lib/**/*.*')
 .pipe(gulp.dest('dist/lib/'))
});

gulp.task('layout', function() {
  return gulp.src(['src/**/*.html', '!src/layout.html'])
    .pipe(wrap({src: 'src/layout.html'}))
    .pipe(gulp.dest('dist/'));
});

/*
gulp.task('move:icon', function() {
 return gulp.src('src/assets/favicon/**.*')
 .pipe(gulp.dest('dist/assets/favicon/'))
});
*/