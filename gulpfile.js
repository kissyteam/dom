var gulp = require('gulp');
var filter = require('gulp-filter');
var kclean = require('gulp-kclean');
var modulex = require('gulp-modulex');
var path = require('path');
var rename = require('gulp-rename');
var packageInfo = require('./package.json');
var src = path.resolve(process.cwd(), 'lib');
var build = path.resolve(process.cwd(), 'build');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var replace = require('gulp-replace');

gulp.task('lint', function () {
    return gulp.src('./lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .pipe(jscs());
});

gulp.task('clean', function () {
    return gulp.src(build, {
        read: false
    }).pipe(clean());
});

gulp.task('build-base', ['lint'], function () {
    return gulp.src('./lib/dom/base.js')
        .pipe(modulex({
            modulex: {
                packages: {
                    'dom/base': {
                        base: path.resolve(src, 'dom/base')
                    }
                }
            }
        }))
        .pipe(kclean({
            files: [
                {
                    src: './lib/dom/base-debug.js',
                    outputModule: 'dom/base'
                }
            ]
        }))
        .pipe(replace(/@VERSION@/g, packageInfo.version))
        .pipe(gulp.dest(path.resolve(build, 'dom')))
        .pipe(filter('base-debug.js'))
        .pipe(replace(/@DEBUG@/g, ''))
        .pipe(uglify())
        .pipe(rename('base.js'))
        .pipe(gulp.dest(path.resolve(build, 'dom')));
});


gulp.task('build-class', ['lint'], function () {
    return gulp.src('./lib/dom/class.js')
        .pipe(modulex({
            modulex: {
                packages: {
                    'dom/class': {
                        base: path.resolve(src, 'dom/class')
                    }
                }
            },
            excludeModules: ['dom/base']
        }))
        .pipe(kclean({
            files: [
                {
                    src: './lib/dom/class-debug.js',
                    outputModule: 'dom/class'
                }
            ]
        }))
        .pipe(replace(/@VERSION@/g, packageInfo.version))
        .pipe(gulp.dest(path.resolve(build, 'dom')))
        .pipe(filter('class-debug.js'))
        .pipe(replace(/@DEBUG@/g, ''))
        .pipe(uglify())
        .pipe(rename('class.js'))
        .pipe(gulp.dest(path.resolve(build, 'dom')));
});

gulp.task('build-ie', ['lint'], function () {
    return gulp.src('./lib/dom/ie.js')
        .pipe(modulex({
            modulex: {
                packages: {
                    'dom/ie': {
                        base: path.resolve(src, 'dom/ie')
                    }
                }
            },
            excludeModules: ['dom/base']
        }))
        .pipe(kclean({
            files: [
                {
                    src: './lib/dom/ie-debug.js',
                    outputModule: 'dom/ie'
                }
            ]
        }))
        .pipe(replace(/@VERSION@/g, packageInfo.version))
        .pipe(gulp.dest(path.resolve(build, 'dom')))
        .pipe(filter('ie-debug.js'))
        .pipe(replace(/@DEBUG@/g, ''))
        .pipe(uglify())
        .pipe(rename('ie.js'))
        .pipe(gulp.dest(path.resolve(build, 'dom')));
});

gulp.task('build', ['build-base', 'build-ie', 'build-class']);

gulp.task('default', ['build']);