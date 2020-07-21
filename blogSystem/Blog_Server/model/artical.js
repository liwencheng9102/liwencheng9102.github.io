const mongoose = require("./db");
const ArticalSchema = mongoose.Schema({
    titel: String,
    content: String,
    unread:[],
    thumbnail: {
        type: String,
        default: '/20200710202516.jpeg',
    }, //缩略图
    status: Number, // 1、发布 2、草稿箱
    views: {
        type: Number,
        default: 0,
    }, // 浏览次数
    likes: {
        type: Number,
        default: 0,
    }, //点赞数
    createdAt: {
        type: Date,
        default: Date.now,
    },
    authorId:String,
    author_id:String
})

module.exports = mongoose.model("artical", ArticalSchema);