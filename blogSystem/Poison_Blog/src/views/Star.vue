<template>
  <div class="myBlog">
    <van-card
      v-for="(item, index) in myStarBlog"
      :key="index"
      :title="item.titel"
      :thumb="'http://127.0.0.1:3000/uploads'+item.thumbnail"
      @click="toSpecific(item._id)"
    >
      <template #price-top>
        <div class="middle">
          <p>{{item.content}}</p>
        </div>
      </template>
      <template #bottom>
        <div class="bottom">
          <p>
            {{item.createdTime}}
            <span class="delete" @click="rmStar(item._id)">取消收藏</span>
          </p>
        </div>
      </template>
    </van-card>
  </div>
</template>
<script>
const sd = require("silly-datetime");
import Vue from "vue";
import { Toast, Dialog } from "vant";
Vue.use(Toast);
Vue.use(Dialog);
export default {
  inject: ["reload"],
  name: "Myblog",
  data() {
    return {
      myStarBlog: [],
      show: false
    };
  },
  methods: {
    toSpecific(id) {
      this.$router.push({ name: "Artical", params: { id } });
    },
    getBlogger() {
      return new Promise(resolve => {
        let userInfo = this.$store.state.bloggerInfo
        this.$axios
          .get("/getUserInfoById", { params: { id: userInfo._id } })
          .then(res => {
            let blogger = res.data.result;
            resolve(blogger);
          });
      });
    },
    rmStar(id) {
      event.stopPropagation();
      Dialog.confirm({
        message: "确定取消收藏吗？"
      })
        .then(() => {
          let userInfo = this.$store.state.bloggerInfo
          this.show = false;
          this.$axios.get("/uncollect", { params:{username:userInfo.username,id} }).then(res=>{
             Toast(res.data.message);
            this.reload();
          })
        })
        .catch(() => {
          return;
        });
    }
  },
  mounted() {
    this.getBlogger().then(user => {
      user.collect.forEach(e => {
        this.$axios.get("/getSpArt", { params: { id: e } }).then(res => {
          //   console.log(res.data.result[0]);
          let time = sd.format(res.data.result[0].createdAt, "YYYY-MM-DD HH:mm"); //时间戳
          res.data.result[0].createdTime = time
          this.myStarBlog.push(res.data.result[0]);
        });
      });
    });
  }
};
</script>

<style lang='scss' scoped>
.myBlog {
  padding-top: 10px;
}
.van-card {
  cursor: pointer;
  background: none;
  padding: 8px 0 8px 0;
  p {
    margin: 0;
  }
  .middle {
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; // 控制多行的行数
      -webkit-box-orient: vertical;
      margin-bottom: 7px;
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
    .delete:hover {
      color: $q-dark;
    }
    .number {
      vertical-align: middle;
    }
  }
}
</style>