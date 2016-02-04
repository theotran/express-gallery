var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

var PathTo = {
  SassFiles: './sass/**/*.scss',
  PublicFolder: './public',
  PublicCss: './public/styles',
  PublicCssFiles: './public/styles/*.css'
};

//running gulp is only to run the scss files

//watch sass for any changes
gulp.task('watch-files', function (){
  gulp.watch(PathTo.SassFiles, ['compile-sass']);
});

//compile your sass
gulp.task('compile-sass', function (){
  return gulp
          .src(PathTo.SassFiles, ['compile-sass'])
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest(PathTo.PublicCss));
});


gulp.task('default', ['compile-sass', 'watch-files']);