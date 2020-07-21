const express = require('express');
const app = express();
const user = require('./model/user')
const artical = require('./model/artical')
const comment = require('./model/comment')
const {
    Upload
} = require('./function/upload')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// 静态资源引入必须在，跨域之前执行
app.use(express.static("./dist"))
app.use('/uploads', express.static("./uploads"))
//设置允许跨域访问该服务. 后台上线必须把同源策略允许代码删除
// app.all('*', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header('Access-Control-Allow-Methods', '*');
//     res.header('Content-Type', 'application/json;charset=utf-8');
//     next();
// });

//注册
app.post("/register", (req, res) => {
    // console.log(req.body)
    let {
        username,
        password,
        confirm
    } = req.body;
    // 验证数据
    if (password != confirm) {
        res.json({
            code: 100,
            message: "密码前后不一致!"
        });
        return;
    }
    let datalist = []
    user.find({}, (err, docs) => {
        if (err) {
            console.log('数据库查找失败!')
            return
        }
        datalist = docs
        if (datalist.length == 0) {
            // 添加数据库
            user.create(req.body, function (err, result) {
                if (err) {
                    res.json({
                        code: 300,
                        message: "加入数据库失败"
                    });
                    console.log(err)
                    return
                }
                res.json({
                    code: 200,
                    message: "数据操作成功",
                    result
                });
            })
        } else {
            for (let i = 0; i < datalist.length; i++) {
                if (username == datalist[i].username) {
                    // console.log('round')
                    res.json({
                        code: 102,
                        message: "用户名已存在！"
                    });
                    return;
                }
                if (i == datalist.length - 1) {
                    // console.log('add')
                    // 添加数据库
                    user.create(req.body, function (err, result) {
                        if (err) {
                            res.json({
                                code: 300,
                                message: "加入数据库失败!"
                            });
                            console.log(err)
                            return
                        }
                        res.json({
                            code: 200,
                            message: "注册成功！",
                            result
                        });
                    })
                }
            }
        }
    })
})
app.get('/', (req, res) => {
    res.send("后台连接成功！")
})
//上传图片保存进服务器uploads文件夹
app.post("/uploads", (req, res) => {
    Upload(req, function (err, fields) {
        if (err) {
            console.log("图片操作失败");
            return;
        }
        // console.log(fields);//{ username: 'admin', photo: '/20200707232040.jpeg' }
        if (fields.username) {
            user.findOneAndUpdate({
                username: fields.username
            }, {
                $set: {
                    avatar: fields.photo
                }
            }, (err, result) => {
                if (err) {
                    console.log("findOneAndUpdate", err);
                    return;
                }
                // console.log(result)
                res.json({
                    code: 200,
                    message: "图片已存入服务器！",
                });
            })
        }
        if (fields.legend) { //编辑器每次贴图触发上传
            res.json({
                code: 200,
                message: "图片已存入服务器！",
                url: fields.photo
            });
        }
        if (fields.articalId) { //上传文章缩略图
            let {
                articalId,
                photo
            } = fields
            artical.findOneAndUpdate({
                _id: articalId
            }, {
                $set: {
                    thumbnail: photo
                }
            }, (err, result) => {
                if (err) {
                    console.log("articalFindOneAndUpdate", err);
                    return;
                }
                res.json({
                    code: 200,
                    message: "图片已存入服务器！",
                });
            })
        }
    })
})
//登录
app.post("/login", (req, res) => {
    let {
        username,
        password
    } = req.body;
    user.find({}, (err, result) => {
        if (err) {
            console.log('数据库查找失败!')
            return
        }
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            if (username == element.username) {
                user.findOne({
                    username
                }, (err, docs) => {
                    if (err) {
                        console.log('findOne', err)
                        return
                    }
                    if (password == docs.password) {
                        res.json({
                            code: 200,
                            message: "登录成功！",
                            docs
                        });
                    } else {
                        res.json({
                            code: 400,
                            message: "密码错误！",
                        });
                    }
                })
                return
            }
            if (i == result.length - 1) {
                res.json({
                    code: 100,
                    message: "用户名不存在！"
                });
            }
        }
    })
})
//获取所有用户信息
app.post("/getAllUsers", (req, res) => {
    user.find({}, (err, result) => {
        if (err) {
            console.log('数据库查找失败!')
            return
        }
        res.json({
            code: 200,
            message: "成功",
            result
        });
    })
})
//修改用户信息
app.post("/changeUserInfo", (req, res) => {
    // console.log(req.body);
    if (req.body.newPassword) {
        user.findOneAndUpdate({
            _id: req.body.id
        }, {
            $set: {
                password: req.body.newPassword
            }
        }, (err, result) => {
            if (err) {
                console.log('数据库更新失败!')
                return
            }
            res.json({
                code: 200,
                message: "修改密码成功",
                result
            });
        })
    } else if (req.body.userEmail) {
        user.findOneAndUpdate({
            _id: req.body.id
        }, {
            $set: {
                userEmail: req.body.userEmail
            }
        }, (err, result) => {
            if (err) {
                console.log('数据库更新失败!')
                return
            }
            res.json({
                code: 200,
                message: "绑定邮箱成功",
                result
            });
        })
    } else {
        user.findOneAndUpdate({
            _id: req.body.id
        }, {
            $set: {
                description: req.body.description
            }
        }, (err, result) => {
            if (err) {
                console.log('数据库更新失败!')
                return
            }
            res.json({
                code: 200,
                message: "个人简介添加成功",
                result
            });
        })
    }

})
//提交文章
app.post("/addArtical", (req, res) => {
    // let {status,titel,content,authorId} = req.body;
    artical.create(req.body, function (err, result) {
        if (err) {
            res.json({
                code: 300,
                message: "加入数据库失败"
            });
            console.log(err)
            return
        }
        res.json({
            code: 200,
            message: "数据操作成功",
            result
        });
    })
})
//查找所有发布文章
app.get("/getArtical", (req, res) => {
    artical.find({
        status: 1
    }, (err, docs) => {
        if (err) {
            console.log('数据库查找失败!')
            return
        }
        res.json({
            code: 200,
            message: "文章数据操作成功",
            docs
        });
    })
})
//查找草稿箱文章
app.get("/getDraft", (req, res) => {
    artical.find({
        status: 2
    }, (err, docs) => {
        if (err) {
            console.log('数据库查找失败!')
            return
        }
        res.json({
            code: 200,
            message: "文章数据操作成功",
            docs
        });
    })
})
//根据id查找具体文章
app.get("/getSpArt", (req, res) => {
    artical.find({
        _id: req.query.id
    }, (err, result) => {
        if (err) {
            console.log('数据库查找失败!')
            return
        }
        res.json({
            code: 200,
            message: "文章数据操作成功",
            result
        });
    })
})
//根据作者查找文章
app.get("/getArtByOneAuthor", (req, res) => {
    artical.find({
        author_id: req.query.author_id,
        status: 1
    }, (err, result) => {
        if (err) {
            console.log('数据库查找失败!')
            return
        }
        res.json({
            code: 200,
            message: "文章数据操作成功",
            result
        });
    })
})
//移除文章未读标记
app.post("/rmUnreadUser", (req, res) => {
    let {
        _id,
        unreadId
    } = req.body
    artical.findOneAndUpdate({
        _id
    }, {
        $pull: {
            unread: unreadId
        }
    }, (err, result) => {
        if (err) {
            console.log('数据库更新失败!')
            return
        }
        res.json({
            code: 200,
            message: "成功",
            result
        });
    })
})
//文章模糊搜索
app.get("/likeArticalSearch", (req, res) => {
    let reg = new RegExp(req.query.value);
    let _filter = {
        //多字段匹配
        $or: [{
                'titel': {
                    $regex: reg,
                    $options: 'i'
                }
            },
            {
                'content': {
                    $regex: reg,
                    $options: 'i'
                }
            },
            {
                'authorId': {
                    $regex: reg,
                    $options: 'i'
                }
            },
        ]
    }
    artical.find({
        ..._filter,
        status: 1
    }, (err, result) => {
        if (err) {
            console.log('失败!')
            return
        }
        res.json({
            code: 200,
            message: "成功",
            result
        });
    })
})
//用户添加关注
app.get("/addAttention", (req, res) => {
    let {
        _id,
        userId
    } = req.query
    user.findOneAndUpdate({
        _id
    }, {
        $push: {
            attention: userId
        }
    }, (err, result) => {
        if (err) {
            console.log('数据库更新失败!')
            return
        }
        res.json({
            code: 200,
            message: "关注成功",
            result
        });
    })
})
//用户取消关注
app.get("/rmAttention", (req, res) => {
    let {
        _id,
        userId
    } = req.query
    user.findOneAndUpdate({
        _id
    }, {
        $pull: {
            attention: userId
        }
    }, (err, result) => {
        if (err) {
            console.log('数据库更新失败!')
            return
        }
        res.json({
            code: 200,
            message: "取关成功",
            result
        });
    })
})
//用户添加粉丝
app.get("/addFans", (req, res) => {
    let {
        _id,
        userId
    } = req.query
    user.findOneAndUpdate({
        _id
    }, {
        $push: {
            fans: userId
        }
    }, (err, result) => {
        if (err) {
            console.log('数据库更新失败!')
            return
        }
        res.json({
            code: 200,
            message: "成功",
            result
        });
    })
})
//用户移除粉丝
app.get("/rmFans", (req, res) => {
    let {
        _id,
        userId
    } = req.query
    user.findOneAndUpdate({
        _id
    }, {
        $pull: {
            fans: userId
        }
    }, (err, result) => {
        if (err) {
            console.log('数据库更新失败!')
            return
        }
        res.json({
            code: 200,
            message: "成功",
            result
        });
    })
})
//点赞
app.get('/likeItOrNot', (req, res) => {
    if (req.query.likeIt == 1) {
        artical.findOneAndUpdate({
            _id: req.query._id
        }, {
            $inc: {
                likes: 1
            }
        }, (err, result) => {
            if (err) {
                console.log('数据库查找失败!')
                return
            }
            res.json({
                code: 200,
                message: "觉得很赞",
                result
            });
        })
    } else {
        artical.findOneAndUpdate({
            _id: req.query._id
        }, {
            $inc: {
                likes: -1
            }
        }, (err, result) => {
            if (err) {
                console.log('数据库查找失败!')
                return
            }
            res.json({
                code: 200,
                message: "取消赞",
                result
            });
        })
    }
})
//在用户库中添加点赞文章
app.get('/addLikeOrNot', (req, res) => {
    if (req.query.likeIt == 1) {
        user.findOneAndUpdate({
            _id: req.query.userId
        }, {
            $push: {
                like: req.query.articalId
            }
        }, (err, result) => {
            if (err) {
                console.log('数据库查找失败!')
                return
            }
            res.json({
                code: 200,
                message: "觉得很赞",
                result
            });
        })
    } else {
        user.findOneAndUpdate({
            _id: req.query.userId
        }, {
            $pull: {
                like: req.query.articalId
            }
        }, (err, result) => {
            if (err) {
                console.log('数据库查找失败!')
                return
            }
            res.json({
                code: 200,
                message: "取消赞",
                result
            });
        })
    }
})
//收藏文章
app.get('/starItOrNot', (req, res) => {
    if (req.query.starIt == 1) {
        user.findOneAndUpdate({
            _id: req.query.userId
        }, {
            $push: {
                collect: req.query.articalId
            }
        }, (err, result) => {
            if (err) {
                console.log('数据库查找失败!')
                return
            }
            res.json({
                code: 200,
                message: "收藏成功",
                result
            });
        })
    } else {
        user.findOneAndUpdate({
            _id: req.query.userId
        }, {
            $pull: {
                collect: req.query.articalId
            }
        }, (err, result) => {
            if (err) {
                console.log('数据库查找失败!')
                return
            }
            res.json({
                code: 200,
                message: "取消收藏",
                result
            });
        })
    }
})
//取消收藏
app.get('/uncollect', (req, res) => {
    user.findOneAndUpdate({
        username: req.query.username
    }, {
        $pull: {
            collect: req.query.id
        }
    }, (err, result) => {
        if (err) {
            console.log('数据库操作失败!')
            return
        }
        res.json({
            code: 200,
            message: "取消收藏",
            result
        });
    })
})
//文章阅读量
app.get('/views', (req, res) => {
    artical.findOneAndUpdate({
        _id: req.query.id
    }, {
        $inc: {
            views: 1
        }
    }, (err, result) => {
        if (err) {
            console.log('数据库查找失败!')
            return
        }
        res.json({
            code: 200,
            message: "阅读量+1",
            result
        });
    })
})
//根据id查找特定用户
app.get('/getUserInfoById', (req, res) => {
    user.findOne({
        _id: req.query.id
    }, (err, result) => {
        if (err) {
            console.log('数据库查找失败!')
            return
        }
        res.json({
            code: 200,
            message: "用户信息查询成功",
            result
        });
    })
})
//添加评论
app.post('/addComment', (req, res) => {
    // console.log(req.body);
    let {
        artical,
        from
    } = req.body
    comment.create({
        artical,
        from
    }, (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        res.json({
            code: 200,
            message: "发布一条留言",
            result
        });
    })
})
//添加回复
app.post('/addReply', (req, res) => {
    let {
        commentId,
        replyObj
    } = req.body
    comment.findOneAndUpdate({
        _id: commentId
    }, {
        $push: {
            reply: replyObj
        }
    }, (err, result) => {
        if (err) {
            console.log('数据库更新失败!')
            return
        }
        res.json({
            code: 200,
            message: '回复成功',
            result
        });
    })
})
//删除评论
app.post('/rmComment', (req, res) => {
    comment.deleteOne({
        _id: req.body.id
    }, err => {
        if (err) {
            return
        }
        res.json({
            code: 200,
            message: '删除成功'
        });
    })
})
//删除一条回复
app.post('/rmOneReply', (req, res) => {
    let {
        id,
        obj
    } = req.body
    comment.findOneAndUpdate({
        _id: id
    }, {
        $pull: {
            reply: obj
        }
    }, (err, docs) => {
        if (err) {
            return
        }
        res.json({
            code: 200,
            message: '删除成功',
            docs
        });
    })
})
//获取全部评论信息
app.get('/getComment', (req, res) => {
    comment.find({}, (err, docs) => {
        if (err) {
            console.log(err)
            return
        }
        res.json({
            code: 200,
            message: "查询成功",
            docs
        });
    })
})
//删除文章
app.post('/deleteArtical', (req, res) => {
    artical.deleteOne({
        _id: req.body.id
    }, err => {
        if (err) {
            console.log(err)
            return
        }
        res.json({
            code: 200,
            message: "删除成功",
        });
    })
})
//修改文章
app.post('/editArtical', (req, res) => {
    let {
        id,
        titel,
        content
    } = req.body
    artical.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            titel,
            content
        }
    }, (err, result) => {
        if (err) {
            console.log('数据库查找失败!')
            return
        }
        res.json({
            code: 200,
            message: "修改成功",
            result
        });
    })
})
//查找博主文章的留言
app.get("/getCommentByArticalId", (req, res) => {
    comment.find({
        artical: req.query.articalId
    }, (err, result) => {
        if (err) {
            console.log('失败!')
            return
        }
        res.json({
            code: 200,
            message: "成功",
            result
        });
    })
})
//已阅读留言
app.post("/readMessage", (req, res) => {
    comment.findOneAndUpdate({
        _id: req.body.id
    }, {
        $set: {
            unread: false
        }
    }, (err, result) => {
        if (err) {
            console.log('失败!')
            return
        }
        res.json({
            code: 200,
            message: "成功",
            result
        });
    })
})
app.listen(3000, () => {
    console.log('http://127.0.0.1:3000')
})