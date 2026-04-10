const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const csscomb = require("gulp-csscomb");

const PATH = {
  scss: "./src/scss/style.scss",
  scssAll: "./src/scss/**/*.scss",
  css: "./src/css/",
  html: "./src/*.html",
  js: "./src/js/*.js",
};

function stylesDev() {
  return src(PATH.scss, { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(csscomb())
    .pipe(dest(PATH.css, { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

function stylesBuild() {
  return src(PATH.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest(PATH.css));
}

function server() {
  browserSync.init({
    server: {
      baseDir: "./src",
    },
  });
}

function watcher() {
  watch(PATH.scssAll, stylesDev);
  watch(PATH.html).on("change", browserSync.reload);
  watch(PATH.js).on("change", browserSync.reload);
}

exports.dev = series(stylesDev, server, watcher);
exports.build = stylesBuild;
exports.default = exports.dev;
