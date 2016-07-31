/**
 * Created by Maxwell on 7/15/2016.
 */
'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var mainBowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');
var path = require('path');
var del = require('del');
var merge = require('merge-stream');
gulp.task('default', ['build-dev']);

gulp.task('serve', function(){
    plugins.connect.server({
        root:'.'
    })
});

gulp.task('build-dev', function (callback) {
    runSequence('clean', 'sass',
        ['js', 'partials', 'images', 'index', 'fonts'],
        callback);
});

gulp.task('build-prod', function (callback) {
    runSequence('clean', ['js-prod', 'sass-prod'],
        ['partials-prod', 'images', 'index-prod', 'fonts'],
        callback);
});

gulp.task('develop', function (callback) {
    runSequence('clean', 'sass',
        ['js', 'partials', 'images', 'index', 'fonts'],
        'watch','serve',
        callback);
});

gulp.task('clean', function () {
    return del('./public');
});

gulp.task('clean-dep', function () {
    return del(['./node_modules', './bower_components']);
});

gulp.task('help', plugins.helptext({
    'develop': 'Builds project in development mode and starts file watch process',
    'help': 'This help message',
    'build-dev': 'Builds entire project in development mode',
    'build-prod': 'Builds entire project in production mode',
    'clean': 'Deletes /public folder',
    'clean-dep': 'Deletes node and bower dependency folders',
    'sass':'Compiles sass files for development mode',
    'sass-prod':'Compiles minified sass files for production',
    'js': 'Annotates and copies *.js files for development mode',
    'js-prod': 'Annotates, concatenates, and uglifies *.js files for production',
    'partials': 'Copies partial *.html views for development mode',
    'partials-prod': 'Creates minified *.html views for production',
    'images': 'Copies images for development mode',
    'index': 'Injects dependencies into index and copies for development mode',
    'index-prod': 'Injects dependencies into index and minifies html for production',
    'fonts': 'Injects dependent fonts from bower_components',
    'watch': 'Sets up file-watching background service for automatic builds on save'
}));

gulp.task('sass', function () {
    var sassOptions = {
        errLogToConsole: true,
        outputStyle: 'expanded'
    };
    var input = './src/stylesheets/style.scss';
    var output = './public/css';
    return gulp
        .src(input)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass(sassOptions).on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(output))
        .pipe(plugins.livereload());
});

gulp.task('sass-prod', function () {
    var sassOptions = {
        errLogToConsole: true,
        outputStyle: 'compressed'
    };
    var input = './src/stylesheets/style.scss';
    var output = './public/css';
    return gulp
        .src(input)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass(sassOptions).on('error', plugins.sass.logError))
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.autoprefixer())
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(output));
});

gulp.task('js', function () {
    var input = './src/js/**/*.js';
    var output = './public/js';
    return gulp.src(input)
        .pipe(plugins.ngAnnotate())
        .pipe(gulp.dest(output))
        .pipe(plugins.livereload());
});

gulp.task('js-prod', function () {
    var input = './src/js/**/*.js';
    var output = './public/js';
    return gulp.src(input)
        .pipe(plugins.concat('townCrier.min.js'))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
        .pipe(gulp.dest(output));
});

gulp.task('partials', function () {
    var input = ['./src/js/**/*.html', './src/*.html', '!./src/index.html'];
    var output = './public/js';
    return gulp.src(input)
        .pipe(gulp.dest(output))
        .pipe(plugins.livereload());
});

gulp.task('partials-prod', function () {
    var input = ['./src/js/**/*.html', './src/*.html', '!./src/index.html'];
    var output = './public/js';
    return gulp.src(input)
        .pipe(gulp.dest(output))
        .pipe(plugins.htmlmin({collapseWhitespace: true}));
});

gulp.task('images', function () {
    var favicon = './src/favicon.ico'
    var favStream = gulp.src(favicon)
        .pipe(gulp.dest('./public'));

    var input = './src/images/*';
    var output = './public/images';
    var imgStream =  gulp.src(input)
        .pipe(gulp.dest(output))
        .pipe(plugins.livereload());
    return merge(imgStream, favStream);

});

gulp.task('fonts', function () {
    return gulp.src(mainBowerFiles())
        .pipe(plugins.filter('**/*.{otf,eot,svg,ttf,woff,woff2}'))
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('index', function () {
    var input = './src/index.html';
    var output = './public';
    var sources = gulp.src('./**/*.js', {read: false, cwd: path.join(__dirname, '/src')});
    return gulp.src(input)
        .pipe(plugins.inject(sources))
        .pipe(plugins.inject(gulp.src(mainBowerFiles(), {read: false}), {name: 'bower'}))
        .pipe(gulp.dest(output))
        .pipe(plugins.livereload());
});

gulp.task('index-prod', function () {
    var input = './src/index.html';
    var output = './public';
    var sources = gulp.src('./js/*.js', {read: false, cwd: path.join(__dirname, '/public')});
    return gulp.src(input)
        .pipe(plugins.inject(sources))
        .pipe(plugins.inject(gulp.src(mainBowerFiles(), {read: false}), {name: 'bower'}))
        .pipe(plugins.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(output));
});

gulp.task('watch', function () {
    plugins.livereload.listen();
    gulp.watch('./src/*.html', ['index']);
    gulp.watch('./src/images/*', ['images']);
    gulp.watch('./src/js/**/*.html', ['partials']);
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/stylesheets/**/*.scss', ['sass']);
});

