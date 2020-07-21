<template>
  <div class="message">
    <van-card
      v-for="(item, index) in showArr"
      :key="index"
      :title="item.titel"
      :thumb="'http://127.0.0.1:3000/uploads'+item.thumbnail"
      @click="toSpecific(item.artical)"
    >
      <template #price-top>
        <div class="middle">
          <div class="userMessage">{{item.from.blogger}}留言：{{item.from.content}}</div>
          <div class="click" @click="showTextarea(item)">
            <van-icon name="comment-circle" />
            <span>回复</span>
          </div>
          <div class="click">
            <van-icon name="warning" />
            <span>举报</span>
          </div>
        </div>
        <div :class="['userInput', {hidden:item.hidden}]">
          <div class="rightSide">
            <textarea v-model="comment" class="textarea" ref="replyTextarea" placeholder="回复..."></textarea>
            <div class="btnBox">
              <b-button variant="outline-dark" @click="noSend(item)">取消</b-button>
              <b-button variant="success" @click="addReply(item)">回复</b-button>
            </div>
          </div>
        </div>
      </template>
      <template #bottom>
        <div class="bottom">
          <p>{{item.from.time}}</p>
        </div>
      </template>
    </van-card>
  </div>
</template>
<script>
const sd = require("silly-datetime");
import Vue from "vue";
import { Toast, Dialog, Icon } from "vant";
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Icon);
export default {
  inject: ["reload"],
  name: "Message",
  data() {
    return {
      show: false,
      comment: "",
      showArr: []
    };
  },
  methods: {
    toSpecific(id) {
      this.$router.push({ name: "Artical", params: { id } });
    },
    showTextarea(item) {
      event.stopPropagation();
      this.$refs.replyTextarea[item.index].focus();
      this.$refs.replyTextarea[item.index].placeholder =
        "@" + item.from.blogger;
      item.hidden = !item.hidden;
    },
    noSend(item) {
      event.stopPropagation();
      this.comment = "";
      item.hidden = true;
    },
    addReply(item) {
      event.stopPropagation();
      let bloggerInfo = this.$store.state.bloggerInfo;
      if (this.comment) {
        let obj = {
          commentId: item._id,
          replyObj: {
            from: bloggerInfo.username,
            fromId: bloggerInfo._id,
            fromAvatar: bloggerInfo.avatar,
            to: this.$refs.replyTextarea[item.index].placeholder,
            content: this.comment,
            replyTime: sd.format(new Date(), "YYYY-MM-DD HH:mm")
          }
        };
        this.$axios.post("/addReply", obj).then(res => {
          Toast(res.data.message);
          this.comment = "";
          this.$refs.replyTextarea[item.index].placeholder = "回复...";
          // this.reload();
        });
      } else {
        Toast("请输入留言内容");
        return;
      }
    }
  },
  mounted() {
    let data = this.$store.state.unreadMessages;
    this.$store.commit("addUnreadMessages", data);
    let showData = this.$store.state.showUnreadMessages;
    //  console.log(showData, "data");
    let arr = [];
    for (let i = 0; i < showData.length; i++) {
      const element = showData[i];
      this.$axios
        .get("/getSpArt", { params: { id: element.artical } })
        .then(res => {
          res.data.result.forEach(e => {
            delete e._id;
            let obj = { ...e, ...element, hidden: true };
            arr.unshift(obj);
          });
          if (i == showData.length - 1) {
            arr.forEach((e, index) => {
              e.index = index;
            });
            this.showArr = arr;
            // console.log(arr, "arr");
          }
        });
    }
  },
  destroyed() {}
};
</script>

<style lang='scss' scoped>
.message {
  padding-top: 10px;
}
.van-card {
  cursor: pointer;
  background: none;
  padding: 8px 0 8px 0;
  .middle {
    .userMessage {
      padding-top: 5px;
    }
    .click {
      display: inline-block;
      margin-right: 10px;
    }
    .van-icon {
      vertical-align: middle;
      margin-right: 3px;
    }
    span {
      vertical-align: middle;
    }
  }
  .bottom {
    overflow: hidden;
    span {
      float: right;
      color: $q-gray;
      font-size: 12px;
      margin: 0 5px 0 5px;
    }
    .number {
      vertical-align: middle;
    }
    p {
      margin: 0;
    }
  }
}
.userInput {
  display: flex;
  overflow: hidden;
  padding-top: 5px;
  &.hidden {
    height: 0;
  }
  .rightSide {
    flex-grow: 1;
    .textarea {
      padding: 5px;
      width: 100%;
      height: 32px;
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
    .btnBox {
      margin-top: 5px;
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
</style>