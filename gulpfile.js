var gulp = require('gulp'),
    data = require('gulp-data'),
    stylus = require('gulp-stylus'),
    jade = require('gulp-jade'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    del = require('del'),
    browserSync = require('browser-sync');

gulp.task('stylus', function () {
    return gulp.src('app/stylus/main.styl')
        .pipe(stylus())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('jade', function () {
    return gulp.src('app/jade/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function () {
    return gulp.src([
            'app/libs/jquery/dist/jquery.min.js',
            'app/libs/what-input/dist/what-input.min.js',
            'app/libs/FlexSlider/jquery.flexslider-min.js',
            'app/libs/masonry/dist/masonry.pkgd.min.js',
            'app/libs/foundation-sites/dist/js/foundation.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['stylus'], function () {
    return gulp.src([
        'app/libs/foundation-sites/dist/css/foundation-flex.css',
        'app/libs/Font-Awesome/css/font-awesome.min.css',
        'app/libs/FlexSlider/flexslider.css'
        ])
        .pipe(concat('libs.css'))
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/css'));
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function () {
    return del.sync('dist');
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('watch', ['browser-sync', 'css-libs', 'js'], function () {
    gulp.watch('app/stylus/**/*.styl', ['stylus']);
    gulp.watch('app/jade/**/*.jade', ['jade']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'jade', 'stylus', 'js'], function () {

    var buildCss = gulp.src([
            'app/css/main.css',
            'app/css/libs.min.css'
        ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));

});
