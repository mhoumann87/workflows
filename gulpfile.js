var gulp = require('gulp'),
    gutil= require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect');

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSourses = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/templates.js'
];
var sassScourses = ['components/sass/style.scss'];
var htmlSources = ['builds/development/*.html'];

gulp.task('coffee', function() {
    gulp.src(coffeeSources)
    .pipe(coffee({bare: true})
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
    gulp.src(jsSourses)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
    gulp.src(sassScourses)
    .pipe(compass({
        sass: 'components/sass',
        image: 'builds/development/images',
        style: 'expanded'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest('builds/development/css'))
    .pipe(connect.reload())
});

gulp.task('html', function() {
    gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task('json', function(){
    gulp.src('builds/development/js/*.json')
    .pipe(connect.reload())
});

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSourses, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);
});

gulp.task('connect', function() {
    connect.server({
        root: 'builds/development',
        livereload: true
    });
});

gulp.task('default', ['json', 'html', 'coffee', 'js', 'compass', 'watch', 'connect']);