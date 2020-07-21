
const formidable = require("formidable");
const sd = require("silly-datetime")
const path = require("path");
const fs = require("fs");


exports.Upload = function(req,callback){
    // 把上传图片封装成模块
    const form = formidable({ multiples: true });

    form.uploadDir = "./uploads";//设置图片上传地址

    form.parse(req, (err, fields, files) => {
        if (err) {
            callback(err,null);
            return;
        }
        // console.log('fields:',fields,'files:',files)
        // 图片路径设置
        let tt = sd.format(new Date(),'YYYYMMDDHHmmss'); //时间戳
        let ext = path.extname(files.file.name); //后缀名

        // 旧路径 
        let oldpath = __dirname + "/../" + files.file.path;
        // 新路径
        let newpath = __dirname + "/../uploads/" + tt + ext;
        fs.rename(oldpath,newpath,(err)=>{
            if(err){
                callback(err,null);
                return;
            }
            fields.photo = "/" + tt + ext;
            callback(null,fields);
        })
    });
}