<template>
  <div class="messageBoard">
    <b-card>
      <div class="userInput">
        <img :src="avatar" alt />
        <div class="rightSide">
          <textarea
            v-model="comment"
            :class="['textarea', {higherInput:showIt}]"
            ref="textarea"
            placeholder="写下你的评论..."
          ></textarea>
          <div class="btnBox">
            <b-button variant="outline-dark" @click="noSend">取消</b-button>
            <b-button variant="success" @click="addComment">发布</b-button>
          </div>
        </div>
      </div>
      <div class="showComment" v-for="(item, index) in commentData" :key="index">
        <a @click="toUserMain(item.from.bloggerId)">
          <img :src="'http://127.0.0.1:3000/uploads'+item.from.avatar" alt="avatar" />
        </a>
        <div class="contentBox">
          <div class="username">
            <a @click="toUserMain(item.from.bloggerId)">{{item.from.blogger}}</a>
            <van-tag plain round :class="{hidden:authorInfo.username!=item.from.blogger}">博主</van-tag>
          </div>
          <div class="createTime">{{item.from.time}}</div>
          <div class="comment">{{item.from.content}}</div>
          <div class="iconBtn">
            <div class="click" @click="addReply(item.from.blogger,item._id)">
              <van-icon name="comment-circle" />
              <span>回复</span>
            </div>
            <div class="click">
              <van-icon name="warning" />
              <span>举报</span>
            </div>
            <span
              :class="['delete',{hidden:bloggerInfo.username!=item.from.blogger}]"
              @click="deleteOne(item._id)"
            >删除</span>
          </div>
          <div class="replayBox">
            <div class="userReplay" v-for="(replyItem, index) in item.reply" :key="index">
              <div class="userTop">
                <a @click="toUserMain(replyItem.fromId)">
                  <img :src="'http://127.0.0.1:3000/uploads'+replyItem.fromAvatar" alt="avatar" />
                </a>
                <div class="userTitle">
                  <div class="userInfo">
                    <a @click="toUserMain(replyItem.fromId)">{{replyItem.from}}</a>
                    <van-tag plain round :class="{hidden:authorInfo.username!=replyItem.from}">博主</van-tag>
                  </div>
                  <div class="createTime">{{replyItem.replyTime}}</div>
                </div>
              </div>
              <div class="comment">{{replyItem.to}} {{replyItem.content}}</div>
              <div class="iconBtn">
                <div class="click" @click="addReply(replyItem.from,item._id)">
                  <van-icon name="comment-circle" />
                  <span>回复</span>
                </div>
                <div class="click">
                  <van-icon name="warning" />
                  <span>举报</span>
                </div>
                <span
                  :class="['delete',{hidden:bloggerInfo.username!=replyItem.from}]"
                  @click="deleteOneReply(item._id,replyItem)"
                >删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
import Vue from "vue";
import { CardPlugin, ButtonPlugin } from "bootstrap-vue";
Vue.use(CardPlugin);
Vue.use(ButtonPlugin);
import { Toast, Dialog, Icon, Tag } from "vant";
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Icon);
Vue.use(Tag);

const sd = require("silly-datetime");
export default {
  inject: ["reload"],
  name: "MessageBoard",
  data() {
    return {
      bloggerInfo: {},
      avatar: require("../assets/imgs/defaultAvatar.jpg"),
      comment: "",
      show: false,
      commentData: [],
      reply: false,
      commentId: ""
    };
  },
  props: ["showIt", "authorInfo"],
  methods: {
    addComment() {
      if (this.comment) {
        if (!this.reply) {
          if (this.$store.state.isLogin) {
            let obj = {
              artical: this.$route.params.id,
              from: {
                blogger: this.bloggerInfo.username,
                bloggerId: this.bloggerInfo._id,
                avatar: this.bloggerInfo.avatar,
                content: this.comment,
                time: sd.format(new Date(), "YYYY-MM-DD HH:mm")
              }
            };
            // this.commentData.unshift(obj);
            this.$axios.post("/addComment", obj).then(res => {
              Toast(res.data.message);
              this.comment = "";
              this.reload();
            });
          } else {
            Dialog.confirm({
              message: "登录后才能评论哦！"
            })
              .then(() => {
                this.show = false;
                this.$router.push({ name: "Login" });
              })
              .catch(() => {
                return;
              });
          }
        } else {
          let obj = {
            commentId: this.commentId,
            replyObj: {
              from: this.bloggerInfo.username,
              fromId: this.bloggerInfo._id,
              fromAvatar: this.bloggerInfo.avatar,
              to: this.$refs.textarea.placeholder,
              content: this.comment,
              replyTime: sd.format(new Date(), "YYYY-MM-DD HH:mm")
            }
          };
          this.$axios.post("/addReply", obj).then(res => {
            Toast(res.data.message);
            this.comment = "";
            this.reply = false;
            this.$refs.textarea.placeholder = "写下你的评论...";
            this.reload();
          });
        }
      } else {
        Toast("请输入留言内容");
        return;
      }
    },
    noSend() {
      this.comment = "";
      this.reply = false;
      this.$refs.textarea.placeholder = "写下你的评论...";
    },
    addReply(to, id) {
      this.reply = true;
      this.$refs.textarea.focus();
      this.$refs.textarea.placeholder = "@" + to;
      this.commentId = id;
    },
    deleteOne(id) {
      this.$axios.post("/rmComment", { id }).then(res => {
        Toast(res.data.message);
        this.reload();
      });
    },
    deleteOneReply(id, obj) {
      this.$axios.post("/rmOneReply", { id, obj }).then(res => {
        Toast(res.data.message);
        this.reload();
      });
    },
    //跳至用户主页
    toUserMain(id) {
      let userInfo = this.$store.state.bloggerInfo
      if (userInfo && id == userInfo._id) {
        this.$router.push({name:'Myblog'})
      }else{
        this.$router.push({name:'UserBlogs',params:{id}})
      }
    }
  },
  mounted() {
    //获取博主信息
    let userInfo = this.$store.state.bloggerInfo
    if (this.$store.state.isLogin) {
      this.bloggerInfo = userInfo;
      this.avatar = "http://127.0.0.1:3000/uploads" + userInfo.avatar;
    }
    //获取评论信息
    this.$axios.get("/getComment").then(res => {
      let comments = res.data.docs;
      comments.forEach(e => {
        if (e.artical == this.$route.params.id) {
          this.commentData.push(e);
        }
      });
      this.commentData.reverse();
    });
  },
  updated() {
    if (this.showIt) {
      this.$refs.textarea.focus();
    }
  }
};
</script>

<style lang='scss' scoped>
.messageBoard {
  margin-top: 5px;
}
.userInput {
  display: flex;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #eee;
    margin-right: 10px;
    vertical-align: middle;
  }
  .rightSide {
    flex-grow: 1;
    .textarea {
      padding: 12px 16px;
      width: 100%;
      height: 40px;
      font-size: 13px;
      border: 1px solid #eee;
      border-radius: 4px;
      background-color: #fafafa;
      display: inline-block;
      vertical-align: top;
      outline-style: none;
      overflow: auto;
      resize: none;
      transition: all 0.3s;
    }
    .higherInput {
      height: 90px;
    }
    .btnBox {
      margin-top: 10px;
      overflow: auto;
    }
    .btn {
      font-size: 12px;
      float: right;
      padding: 4px 12px;
      margin-left: 10px;
    }
  }
}
a{
  cursor: pointer;
}
.showComment {
  margin-top: 5px;
  display: flex;
  align-items: flex-start;
  text-align: left;
  img {
    width: 40px;
    height: 40px;
    border: 1px solid #eee;
    border-radius: 50%;
    overflow: hidden;
  }
  .contentBox {
    flex-grow: 1;
    margin: 0 0 0 10px;
    .username {
      font-size: 15px;
      font-weight: 500;
      a {
        text-decoration: none;
        color: $q-dark;
      }
      .van-tag {
        font-size: 12px;
      }
    }
    .createTime {
      margin-top: 2px;
      font-size: 12px;
      color: #969696;
    }
    .comment {
      margin-top: 5px;
      font-size: 15px;
      line-height: 1.5;
    }
    .iconBtn {
      margin-top: 5px;
      font-size: 14px;
      color: $q-gray;
    }
    .click {
      display: inline-block;
    }
    .van-icon {
      cursor: pointer;
      vertical-align: middle;
      margin-left: 5px;
    }
    span {
      cursor: pointer;
      vertical-align: middle;
      margin: 0 5px 0 5px;
    }
    .delete {
      color: $red;
      float: right;
    }
    .hidden {
      display: none;
    }
    .replayBox {
      margin-top: 10px;
    }
  }
}

.showComment .contentBox .replayBox .userReplay {
  padding: 10px 0 10px;
  border-top: 1px solid #eee;
  .userTop {
    display: flex;
    .userTitle {
      margin-left: 10px;
    }
    .userInfo {
      font-size: 15px;
      font-weight: 500;
      a {
        text-decoration: none;
        color: $q-dark;
      }
      .van-tag {
        font-size: 12px;
      }
    }
  }
  .comment {
    margin-left: 10px;
  }
  .iconBtn {
    margin-left: 5px;
  }
}
</style>