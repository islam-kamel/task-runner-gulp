const {src, dest, series} = require("gulp");
const htmlMin = require("gulp-htmlmin");
const replace = require("gulp-replace");
const concatCss = require("gulp-concat-css");
const imagemin = require("gulp-imagemin");
const path = require("path");
const uglify = require('gulp-uglify');

const route = {
    html: "dist",
    css: "assets/css",
    js: "assets/js",
    img: "assets/images"
}

function htmlTask() {
    return src("src/*.html")
        .pipe(htmlMin({collapseWhitespace: true}))
        .pipe(resolver(/((href)(\S+)\.css)(['"])+/g, {prefix: "href", output: "assets/css", rename: false, filename: "style.css"}))
        .pipe(resolver(/((src)(\S+)\.(jp([eg])|png))(['"])+/g, {prefix: "src", output: "assets/images"}))
        .pipe(resolver(/((src)(\S+)\.js)(['"])+/g, {prefix: "src", output: "assets/js", rename: true, filename:"all.min.js"}))
        .pipe(dest("dist"))
}

function cssTask() {
    return src("src/*.css")
        .pipe(concatCss("style.css"))
        .pipe(dest("dist/assets/css"))
}

function imagesTask() {
    return src("src/*.png")
        .pipe(imagemin())
        .pipe(dest("dist/assets/images"))
}

function JsMini() {
    return src("src/*.js")
        .pipe(uglify())
        .pipe( dest("dist/assets/js") )
}
function resolver(pattern, {...args}) {
    return replace(pattern, (match) => {
        let filename = path.basename(match).replace("\"", "").replace("'", "");
        if (args.rename) return `${args.prefix}="${args.output}/${filename}"`
        return `${args.prefix}="${args.output}/${filename}"`
    })
}


exports.default = series(htmlTask, cssTask, imagesTask,JsMini)