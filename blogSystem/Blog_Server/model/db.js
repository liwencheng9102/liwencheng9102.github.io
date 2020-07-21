var mongoose =  require("mongoose");

// 创建数据库连接
mongoose.connect("mongodb://127.0.0.1:27017/poison_blog",{useUnifiedTopology:true,useNewUrlParser:true},(err)=>{
    if(err){
        throw Error("数据库连接失败");
    }else{
        console.log("数据库连接成功");
    }
})
module.exports = mongoose;