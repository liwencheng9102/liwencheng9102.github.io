const mongoose = require("./db");
const CommentSchema = mongoose.Schema({
    artical: String,
    from: {
        bloggerId:String,
        blogger:String,
        avatar:String,
        content:String,
        time:String
    },
    reply: [{
        from:String,
        fromId:String,
        fromAvatar:String,
        to:String,
        replyUnread:{
            type: Boolean,
            default: true,
        },
        content:String,
        replyTime:String
    }],
    unread:{
        type: Boolean,
        default: true,
    }
})

module.exports = mongoose.model("Comment", CommentSchema);