/// <binding BeforeBuild='css' />
const gulp = require("gulp"),
    sass = require("gulp-sass"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    cleanCSS = require("gulp-clean-css");

const CSS_EXTENSION = ".css",
    SCSS_EXTENSION = ".scss";

const CSS_FOLDER_DEVELOPMENT = "src/styles/*" + SCSS_EXTENSION,
    CSS_FOLDER_PRODUCTION = "build";

const CSS_FILE_DEVELOPMENT = "style" + CSS_EXTENSION,
    CSS_FILE_PRODUCTION = "style.min" + CSS_EXTENSION;

gulp.task("css", function () {
    return gulp.src(CSS_FOLDER_DEVELOPMENT)
        .pipe(sass())
        .pipe(concat(CSS_FILE_DEVELOPMENT))
        .pipe(gulp.dest(CSS_FOLDER_PRODUCTION))
        .pipe(rename(CSS_FILE_PRODUCTION))
        .pipe(cleanCSS())
        .pipe(gulp.dest(CSS_FOLDER_PRODUCTION));
});