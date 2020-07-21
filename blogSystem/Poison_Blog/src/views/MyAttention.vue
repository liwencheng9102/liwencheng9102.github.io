<template>
  <div class="myAttention">
    <ul class="user-list">
      <li v-for="(item, index) in attentionUsers" :key="index">
        <img
          :src="'http://127.0.0.1:3000/uploads'+item.avatar"
          alt="avatar"
          @click="toSpecific(item._id)"
        />
        <div class="info">
          <a class="name" @click="toSpecific(item._id)">{{item.username}}</a>
          <div class="meta">{{item.description}}</div>
          <div class="meta">
            <span>关注{{item.attention.length}}</span>
            <span>粉丝{{item.fans.length}}</span>
            <span>发表{{item.publish}}</span>
          </div>
        </div>
        <b-button variant="outline-dark" @click="rmAttention(item._id)">取消关注</b-button>
      </li>
    </ul>
  </div>
</template>
<script>
import Vue from "vue";
import { Toast, Dialog } from "vant";
Vue.use(Toast);
Vue.use(Dialog);
import { ButtonPlugin } from "bootstrap-vue";
Vue.use(ButtonPlugin);
export default {
  inject: ["reload"],
  name: "MyAttention",
  data() {
    return {
      show: false,
      attentionUsers: []
    };
  },
  methods: {
    toSpecific(id) {
      this.$router.push({ name: "UserBlogs", params: { id } });
    },
    getUserInfo() {
      return new Promise(resolve => {
        let bloggerInfo = this.$store.state.bloggerInfo;
        //获取渲染数据
        let arr = [];
        this.$axios
          .get("/getUserInfoById", { params: { id: bloggerInfo._id } })
          .then(res => {
            let userAttention = res.data.result.attention;
            for (let i = 0; i < userAttention.length; i++) {
              const e = userAttention[i];
              this.$axios
                .get("/getUserInfoById", { params: { id: e } })
                .then(res => {
                  arr.push(res.data.result);
                  if (i == userAttention.length - 1) {
                    resolve(arr);
                  }
                });
            }
          });
      });
    },
    rmAttention(id) {
      let bloggerInfo = this.$store.state.bloggerInfo;
      this.$axios
        .get("/rmAttention", { params: { _id: bloggerInfo._id, userId: id } })
        .then(res => {
          if (res.data.code == 200) {
            this.$axios
              .get("/rmFans", {
                params: {
                  _id: id,
                  userId: bloggerInfo._id
                }
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.reload();
                }
              });
          }
        });
    }
  },
  mounted() {
    this.getUserInfo().then(arr => {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        //获取发表数量
        this.$axios
          .get("/getArtByOneAuthor", {
            params: { author_id: item._id }
          })
          .then(res => {
            item.publish = res.data.result.length;
            if (i == arr.length - 1) {
              this.attentionUsers = arr;
            }
          });
      }
    });
  }
};
</script>

<style lang='scss' scoped>
@media screen and (max-width: 480px) {
  .myAttention .user-list {
    padding: 0;
    li .info {
      max-width: 180px;
    }
  }
}
.myAttention {
  padding-top: 20px;
}
.user-list {
  list-style: none;
  margin: 0;
  padding: 0 10px 0 10px;
  li {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
    line-height: normal;
    position: relative;
    img {
      width: 65px;
      height: 65px;
      margin-right: 8px;
      border: 1px solid #ddd;
      border-radius: 50%;
      vertical-align: middle;
      object-fit: cover;
      cursor: pointer;
    }
    .info {
      vertical-align: middle;
      display: inline-block;
      max-width: 500px;
      a {
        font-size: 15px;
        font-weight: 700;
        color: #333;
        cursor: pointer;
      }
    }
    .meta {
      padding-top: 2px;
      font-size: 12px;
      color: #969696;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1; // 控制多行的行数
      -webkit-box-orient: vertical;
      span {
        margin-right: 10px;
        padding-right: 10px;
        border-right: 1px solid #969696;
      }
      span:last-child {
        border: none;
      }
    }
    .btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 15px;
    }
  }
}
</style>