const mongoose = require("./db");
const UserSchema = mongoose.Schema({
    avatar: String,
    username: {
        type: String,
        trim: true,
    },
    password: String,
    userEmail: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        default: '该用户还没有填写相关简介...',
    },
    attention: [],
    fans: [],
    collect: [],
    like:[]
})

module.exports = mongoose.model("User", UserSchema);