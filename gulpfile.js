var gulp = require('gulp'),
    gutil= require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    jsonMinify = require('gulp-jsonminify');

var env,
    coffeeSources,
    jsSourses,
    sassScourses,
    htmlSources,
    jsonSourses,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env === 'development') { 
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];
 jsSourses = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/templates.js'
];
sassScourses = ['components/sass/style.scss'];
htmlSources = [ outputDir + '/*.html'];
jsonSourses = [ outputDir + 'js/*.json'];

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
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
    gulp.src(sassScourses)
    .pipe(compass({
        sass: 'components/sass',
        image: outputDir + 'images',
        style: sassStyle
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('html', function() {
    gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHtml()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});
gulp.task('images', function() {
    gulp.src('builds/development/images/**/*.*')
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/images/')))
    .pipe(connect.reload())
})

gulp.task('json', function(){
    gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonMinify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js/')))
    .pipe(connect.reload())
});

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSourses, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch(jsonSourses, ['json']);
    gulp.watch('builds/development/images/**/*.*', ['images']);
});

gulp.task('connect', function() {
    connect.server({
        root: 'outputDir',
        livereload: true
    });
});

gulp.task('default', [
    'json', 
    'html',
    'images', 
    'coffee', 
    'js', 
    'compass', 
    'watch', 
    'connect'
    ]);