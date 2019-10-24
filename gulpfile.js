const gulp = require("gulp");
const uglify =require("gulp-uglify");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const minifycss = require("gulp-minify-css");
//启动监听
gulp.task("watchall",async ()=>{
    //监视当前项目目录下的所有html文件有没有改动，如果有改动，执行回调函数的代码
    gulp.watch("*.html",async ()=>{
        //把当前目录下的所有的html文件，放在"E:\\Front\\WWW\\Tmall_project"。
        gulp.src("*.html")
        .pipe(gulp.dest("E:\\Front\\WWW\\Tmall_project"));
    }
);

    // img/**/*: 表示img文件夹下的所有文件及其子文件夹下的所有文件，依次类推，直到最内层的文件夹
    gulp.watch("img/**/*",async ()=>{
        //把当前目录下的所有的html文件，放在"D:\\phpStudy\\WWW\\Tmall_project\\img"。
        gulp.src("img/**/*")
        .pipe(gulp.dest("E:\\Front\\WWW\\Tmall_project\\img"));
    });

    gulp.watch(["js/banner.js"],async ()=>{
        gulp.src(["js/banner.js"])
        .pipe(concat("common.js"))//拼接成一个js文件
        .pipe(gulp.dest("E:\\Front\\WWW\\Tmall_project\\js"));//放在该路径下
    });
    gulp.watch("css/**/*",async()=>{
        gulp.src("css/**/*")
        .pipe(minifycss())
        .pipe(gulp.dest("E:\\Front\\WWW\\Tmall_project\\css"));
    });
});