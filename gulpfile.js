const { series, src, dest, watch } = require('gulp')
const htmlClean = require('gulp-htmlclean');
const lessDeal = require('gulp-less')
const cssClean = require('gulp-clean-css')
const stripDebug = require('gulp-strip-debug')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin');
const connect = require('gulp-connect');

const folder = {
    src: 'src/',
    dist: 'dist/',
}

// 各种任务
function html() {

    return src(folder.src + 'html/*')
        .pipe(htmlClean())  // html压缩  插件：htmlclean
        .pipe(dest(folder.dist + 'html'))
        .pipe(connect.reload());
}
function css() {

    return src(folder.src + 'css/*')
        .pipe(lessDeal())  // less转css  插件：gulp-less
        .pipe(cssClean())  // css压缩  插件：gulp-clean-css
        .pipe(dest(folder.dist + 'css'))
        .pipe(connect.reload());
}
function js() {

    return src(folder.src + 'js/*')
        .pipe(stripDebug())  // 清楚调试语句 如debugger console.log(变void 0)  插件：gulp-strip-debug
        .pipe(uglify())  // js压缩 （void 0 没有了）  插件：gulp-uglify
        .pipe(dest(folder.dist + 'js'))
        .pipe(connect.reload());
}
function image() {

    return src(folder.src + 'image/*')
    .pipe(imagemin(           // 图片压缩：缩小图片容量  插件：gulp-imagemin
        // [imagemin.optipng()]
    ))  
        .pipe(dest(folder.dist + 'image'))
}

// 服务器任务
function server(cb){
    connect.server({
        port : '8888',
        livereload:true,  // 自动刷新   实际文件修改后不会自动刷新网页要重启才可以，需要配合watch，但也要手动点网页的刷新按钮
    })
    cb();  // 表示结束
}

// 目标：文件一修改就实时刷新   配合watch：点网页刷新按钮后才会刷新
watch(folder.src+'html/*',{},function(cb){
    html();
    cb();
})
watch(folder.src+'css/*',{},function(cb){
    css();
    cb();
})
watch(folder.src+'js/*',{},function(cb){
    js();
    cb();
})

exports.default = series(html, css, js, image,server)