<template>
  <div class="fans">
    <ul class="user-list">
      <li v-for="(item, index) in fans" :key="index">
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
        <b-button
          variant="outline-dark"
          :class="{hidden:item.isAttention}"
          @click="addAttentionOrNot(item)"
        >关注</b-button>
        <b-button
          variant="outline-dark"
          :class="{hidden:!item.isAttention}"
          @click="addAttentionOrNot(item)"
        >取消关注</b-button>
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
  name: "Fans",
  data() {
    return {
      show: false,
      fans: []
    };
  },
  methods: {
    toSpecific(id) {
      let userInfo = this.$store.state.bloggerInfo;
      if (userInfo && id == userInfo._id) {
        this.$router.push({ name: "Myblog" });
      } else {
        this.$router.push({ name: "UserBlogs", params: { id } });
      }
    },
    getUserInfo() {
      return new Promise(resolve => {
        //获取渲染数据
        let arr = [];
        this.$axios
          .get("/getUserInfoById", { params: { id: this.$route.params.id } })
          .then(res => {
            let fans = res.data.result.fans;
            for (let i = 0; i < fans.length; i++) {
              const e = fans[i];
              this.$axios
                .get("/getUserInfoById", { params: { id: e } })
                .then(res => {
                  arr.push(res.data.result);
                  if (i == fans.length - 1) {
                    resolve(arr);
                  }
                });
            }
          });
      });
    },
    addAttentionOrNot(clickUser) {
      let bloggerInfo = this.$store.state.bloggerInfo;
      if (this.$store.state.isLogin) {
        if (clickUser._id != bloggerInfo._id) {
          if (!clickUser.isAttention) {
            //添加关注
            this.$axios
              .get("/addAttention", {
                params: { _id: bloggerInfo._id, userId: clickUser._id }
              })
              .then(res => {
                Toast.success(res.data.message);
                clickUser.isAttention = true;
              });
            //添加粉丝
            this.$axios
              .get("/addFans", {
                params: { _id: clickUser._id, userId: bloggerInfo._id }
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.reload();
                }
              });
          } else {
            Dialog.confirm({
              message: "确定取消关注吗"
            })
              .then(() => {
                //取消关注
                this.$axios
                  .get("/rmAttention", {
                    params: {
                      _id: bloggerInfo._id,
                      userId: clickUser._id
                    }
                  })
                  .then(res => {
                    if (res.data.code == 200) {
                      this.show = false;
                      clickUser.isAttention = false;
                    }
                  });
                //移除粉丝
                this.$axios
                  .get("/rmFans", {
                    params: {
                      _id: clickUser._id,
                      userId: bloggerInfo._id
                    }
                  })
                  .then(res => {
                    if (res.data.code == 200) {
                      this.reload();
                    }
                  });
              })
              .catch(() => {
                return;
              });
          }
        } else {
          Toast.fail("自己不能关注自己哦");
        }
      } else {
        Toast.fail("登录后才能关注哦");
      }
    }
  },
  mounted() {
    let bloggerInfo = this.$store.state.bloggerInfo;
    this.getUserInfo().then(arr => {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        //用户是否被博主关注
        for (let j = 0; j < item.fans.length; j++) {
          const element = item.fans[j];
          if (bloggerInfo && element == bloggerInfo._id) {
            item.isAttention = true;
          }
        }
        //获取发表数量
        this.$axios
          .get("/getArtByOneAuthor", {
            params: { author_id: item._id }
          })
          .then(res => {
            item.publish = res.data.result.length;
          });
      }
      this.fans = arr;
    });
  }
};
</script>

<style lang='scss' scoped>
@media screen and (max-width: 480px) {
  .fans .user-list {
    padding: 0;
    li .info {
      max-width: 180px;
    }
  }
}
.fans {
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
    .hidden {
      display: none;
    }
  }
}
</style>