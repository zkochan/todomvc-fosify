'use strict';

var gulp       = require('gulp');
var util       = require('gulp-util');
//var imagemin   = require('gulp-imagemin');
var less       = require('gulp-less');
var jshint     = require('gulp-jshint');
var dotify     = require('gulp-dotify');
var header     = require('gulp-header');
var footer     = require('gulp-footer');
var minifyCSS  = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var concat     = require('gulp-concat');
var fosify = require('fosify');

var dir = {
    dev:  'dev/',
    prod: 'publish/',
    src:  'src/'
};

// Lint Task
gulp.task('lint', function() {
    gulp.src(dir.src + 'js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('css', function() {
    var destination = (util.env.production ? dir.prod : dir.dev) + 'css/';

    gulp.src(dir.src + 'css/base.less')
        .pipe(less())
        .pipe(util.env.production ? minifyCSS() : util.noop())
        .pipe(gulp.dest(destination));
});

gulp.task('images', function() {
    var destination = (util.env.production ? dir.prod : dir.dev) + 'img/';

    gulp.src(dir.src + 'img/**/*')
//        .pipe(imagemin())
        .pipe(gulp.dest(destination));
});

gulp.task('templates', function() {
    var destination = dir.src + 'js/';

    gulp.src(dir.src + 'js/templates/**/*.html')
        .pipe(dotify({
            separator: '/',
            root: 'templates'
        }))
        .pipe(concat('templates.js'))
        .pipe(header('var JST = {};'))
        .pipe(footer('module.exports = JST;'))
        .pipe(gulp.dest(destination));
});

gulp.task('scripts', function() {
    var destination = (util.env.production ? dir.prod : dir.dev) + 'js/';

    fosify({
      source: dir.src + 'js',
      dest: destination,
      minify: util.env.production,
      watch: false
    });
});

gulp.task('resources', function() {
    var destination = (util.env.production ? dir.prod : dir.dev) + 'assets/';

    gulp.src(dir.src + 'index.html')
        .pipe(util.env.production ? minifyHTML() : util.noop())
        .pipe(gulp.dest(destination));

    gulp.src([
            dir.src + 'assets/**/*',
            'bower_components/html5shiv/dist/html5shiv.js'
        ])
        .pipe(gulp.dest(destination));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    if (util.env.production) { return; }

    gulp.watch(dir.src + 'css/**/*.less', ['css']);
    gulp.watch(dir.src + 'img/**/*', ['images']);
    gulp.watch(dir.src + 'js/templates/**/*.html', ['templates']);
    gulp.watch(dir.src + 'js/**/*.js', ['scripts']);
    gulp.watch(dir.src + 'index.html', ['resources']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['css', 'images', 'templates', 'scripts', 'resources', 'watch']);
