const { series, src, dest } = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');

function buildSass() {
    return src([
        'src/assets/sass/**/*.scss'
    ])
    .pipe(plumber())
    .pipe(sass({
        outputStyle: 'expanded',
        sourceMap: true
    }))
    .pipe(cleanCSS())
    .pipe(dest('public/stylesheets/'));
}

exports.default = series(buildSass);