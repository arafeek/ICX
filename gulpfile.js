// include gulp
var gulp = require('gulp');

// include plug-ins
var react = require('gulp-react');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var jsdoc = require('gulp-jsdoc');
var filesize = require('gulp-filesize');
var zip = require('gulp-zip');

// Toggele build main or ICX
var buildFor = 'icx'


// JSX FILES
// Tasks
var jsxList = [
    "jsx/icxtableView.js",
    "jsx/icxdisplay.js",
    "jsx/puffbox.js"
];



gulp.task('jsxFiles', function() {
    gulp.src(jsxList)
        .pipe(react())
        //.pipe(sourcemaps.init())
             .pipe(concat('fbr.js'))
             .pipe(uglify())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('build'));
});



// OTHER PUFFBALL / ICX FILES
var ourOthersList = [
    'js/helpers.js',
    'js/translate.js',
    'js/translate-zh.js',
    'js/words.js',
    'js/arrays.js',
    'main.js'
];


gulp.task('ourOthers', function () {
    gulp.src(ourOthersList)
        //.pipe(sourcemaps.init())
        .pipe(concat('pfb.js'))
        .pipe(filesize())
        .pipe(uglify())
        .pipe(filesize())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('build'));

});

// THEIR OTHERS
var theirOthersList = [
    // 'js/vendor/bitcoinjs-min.js',
    'js/vendor/markdown.js',
    'js/vendor/polyglot.min.js',
    'js/vendor/promise.min.js',
    'js/vendor/timeSince.js',
    'js/vendor/xbbcode.js',
    'js/vendor/react/build/react-with-addons.js'
];

gulp.task('theirOthers', function () {
    gulp.src(theirOthersList)
        //.pipe(sourcemaps.init())
        .pipe(concat('oth.js'))
        .pipe(filesize())
        .pipe(uglify())
        .pipe(filesize())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('build'));
});

// FILES TO COPY DIRECTLY
gulp.task('copyFiles', function() {
    gulp.src('styles/fonts/*',{base: '.'})
        .pipe(gulp.dest('build'));

    gulp.src('img/*',{base: '.'})
        .pipe(gulp.dest('build'));

    gulp.src('js/config.js',{base: '.'})
        .pipe(gulp.dest('build'));

    gulp.src('js/cryptoworker.js',{base: '.'})
        .pipe(gulp.dest('build'));

    gulp.src('js/vendor/bitcoinjs-min.js',{base: '.'})
        .pipe(gulp.dest('build'));

    gulp.src('js/everybit.js',{base: '.'})
        .pipe(gulp.dest('build'));

});

// CSS MINIFICATION
gulp.task('css', function () {
    gulp.src('styles/*.css')
        .pipe(concat('style.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/styles'));
});


// ZIP AS NEEDED
gulp.task('zip', function() {
    gulp.src(['build/*.js','build/*.html','build/img/*','build/styles/*','build/styles/fonts/*'],{base: '.'})
        .pipe(zip('puffball.zip'))
        .pipe(gulp.dest('build'));
});

gulp.task('doDocs', function() {
    gulp.src('js/core/*.js')
        .pipe(jsdoc('doc'));
}); 


gulp.task('default', ['jsxFiles', 'css', 'ourOthers', 'theirOthers', 'copyFiles']);
