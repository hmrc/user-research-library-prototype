const { parallel } = require('gulp');

const sass = require('./sass');

exports.default = parallel(sass.default);