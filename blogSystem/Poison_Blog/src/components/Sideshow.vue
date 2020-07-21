<template>
  <b-col md="4" class="sideshow">
    <van-calendar
      title="日历"
      :poppable="false"
      :show-confirm="false"
      :style="{ height: '380px' }"
      :show-title="false"
      color="#999AAA"
      row-height="60"
    />
    <div class="recommend">
      <div class="text">推荐作者</div>
      <b-card
        no-body
        class="overflow-hidden"
        style="max-width: 540px;"
        v-for="(item, index) in authors"
        :key="index"
      >
        <b-row no-gutters>
          <b-col md="3">
            <van-image
              round
              fit="cover"
              width="80px"
              height="80px"
              :src="'http://127.0.0.1:3000/uploads'+item.avatar"
            />
          </b-col>
          <b-col md="9">
            <b-card-body>
              <b-row>
                <b-col md="8">
                  <b-card-text>{{item.username}}</b-card-text>
                  <b-card-text class="meta">{{item.description}}</b-card-text>
                  <b-card-text class="meta">发表:{{item.publish}} 粉丝:{{item.fans.length}}</b-card-text>
                </b-col>
                <b-col md="4">
                  <b-button
                    variant="outline-dark"
                    :class="{hidden:item.isAttention}"
                    @click="addAttentionOrNot(item)"
                  >关注</b-button>
                  <b-button
                    variant="outline-dark"
                    :class="{hidden:!item.isAttention}"
                    @click="addAttentionOrNot(item)"
                  >取关</b-button>
                </b-col>
              </b-row>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </b-col>
</template>
<script>
import Vue from "vue";
import { Calendar, Toast, Dialog } from "vant";
import { Image as VanImage } from "vant";
Vue.use(VanImage);
Vue.use(Calendar);
Vue.use(Toast);
Vue.use(Dialog);

import { LayoutPlugin, CardPlugin, ButtonPlugin } from "bootstrap-vue";
Vue.use(LayoutPlugin);
Vue.use(CardPlugin);
Vue.use(ButtonPlugin);

export default {
  inject: ["reload"],
  name: "Sideshow",
  data() {
    return {
      authors: []
    };
  },
  methods: {
    getAllUsers() {
      return new Promise(resolve => {
        this.$axios.post("/getAllUsers").then(res => {
          let allUsers = res.data.result;
          for (let i = 0, arrLength = allUsers.length; i < arrLength; i++) {
            //获取发表数量
            this.$axios
              .get("/getArtByOneAuthor", {
                params: { author_id: allUsers[i]._id }
              })
              .then(res => {
                allUsers[i].publish = res.data.result.length;
                if (i == arrLength - 1) {
                  resolve(allUsers);
                }
              });
          }
        });
      });
    },
    addAttentionOrNot(clickUser) {
      let bloggerInfo = this.$store.state.bloggerInfo;
      if (this.$store.state.isLogin) {
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
        Toast.fail("登录后才能关注哦");
      }
    }
  },
  mounted() {
    let bloggerInfo = this.$store.state.bloggerInfo;
    this.getAllUsers().then(allUsersArr => {
      for (let i = 0, arrLength = allUsersArr.length; i < arrLength - 1; i++) {
        for (let j = 0; j < arrLength - i - 1; j++) {
          if (
            allUsersArr[j].publish + allUsersArr[j].fans.length <
            allUsersArr[j + 1].publish + allUsersArr[j + 1].fans.length
          ) {
            let temp = allUsersArr[j];
            allUsersArr[j] = allUsersArr[j + 1];
            allUsersArr[j + 1] = temp;
          }
        }
      }
      let arr = [];
      for (let i = 0; i < 6; i++) {
        if (allUsersArr[i]._id != bloggerInfo._id) {
          arr.push(allUsersArr[i]);
        }
      }
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        //用户是否被博主关注
        for (let j = 0; j < item.fans.length; j++) {
          const element = item.fans[j];
          if (bloggerInfo && element == bloggerInfo._id) {
            item.isAttention = true;
          }
        }
      }
      this.authors = arr;
    });
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 480px) {
  .sideshow {
    display: none;
  }
}
.recommend {
  padding-top: 20px;
  font-size: 14px;
  .text {
    padding-bottom: 10px;
    font-size: 14px;
    color: #969696;
  }
  .card {
    margin-bottom: 5px;
  }
  .col-md-3 {
    padding: 10px 0 10px 0;
    .van-image {
      padding: 5px;
    }
  }
  .col-md-9 {
    p{
      margin-bottom: 2px;
    }
    .meta {
      font-size: 12px;
      color: #969696;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1; // 控制多行的行数
      -webkit-box-orient: vertical;
    }
    .hidden {
      display: none;
    }
  }
}
</style>