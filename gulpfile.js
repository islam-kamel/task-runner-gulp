const {src, dest, series, watch} = require("gulp");
const htmlMin = require("gulp-htmlmin");
const replace = require("gulp-replace");
const concatCss = require("gulp-concat-css");
const imagemin = require("gulp-imagemin");
const path = require("path");
const uglify = require("gulp-uglify");


function htmlTask() {
    return src("src/*.html")
        .pipe(htmlMin({collapseWhitespace: true}))
        .pipe(resolver(/((href)(\S+)\.css)(['"])+/g, {
            prefix: "href",
            output: "assets/css",
            rename: false,
            filename: "style.css"
        }))
        .pipe(resolver(/((src)(\S+)\.(jp([eg])|png))(['"])+/g, {prefix: "src", output: "assets/images"}))
        .pipe(resolver(/((src)(\S+)\.js)(['"])+/g, {
            prefix: "src",
            output: "assets/js",
            rename: true,
            filename: "all.min.js"
        }))
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
        .pipe(dest("dist/assets/js"))
}

function resolver(pattern, {...args}) {
    return replace(pattern, (match) => {
        let filename = path.basename(match).replace("\"", "").replace("'", "");
        if (args.rename) return `${args.prefix}="${args.output}/${filename}"`
        return `${args.prefix}="${args.output}/${filename}"`
    })
}

function watchChange() {
    watch("src/*.html",series(htmlTask))
    watch("src/*.js",series(JsMini))
    watch("src/*.css", series(cssTask));
    watch("src/*.png", series(imagesTask));
}


exports.default = series( series(htmlTask, cssTask, imagesTask, JsMini), watchChange)
