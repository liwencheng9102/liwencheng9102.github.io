<template>
  <div class="artical">
    <Topsearch></Topsearch>
    <b-container>
      <b-row>
        <b-col md="3" class="leftside">
          <b-card v-if="authorInfo.avatar">
            <van-image
              width="80"
              height="80"
              fit="cover"
              :src="'http://127.0.0.1:3000/uploads' + authorInfo.avatar"
            />
            <h4>{{authorInfo.username}}</h4>
            <b-card-text>{{authorInfo.description}}</b-card-text>
            <b-button variant="primary" @click="toAuthorMain">TA的主页</b-button>
            <b-button
              variant="outline-dark"
              :class="{hidden:isAttention}"
              @click="addAttentionOrNot"
            >关注</b-button>
            <b-button
              variant="outline-dark"
              :class="{hidden:!isAttention}"
              @click="addAttentionOrNot"
            >取消关注</b-button>
          </b-card>

          <div class="recommend">
            <div class="text">推荐文章</div>
            <b-card
              no-body
              class="overflow-hidden"
              style="max-width: 540px;"
              v-for="(item, index) in blogData"
              :key="index"
              @click="toArtical(item._id)"
            >
              <b-row no-gutters>
                <b-col md="3">
                  <van-image
                    fit="cover"
                    width="65px"
                    height="65px"
                    :src="'http://127.0.0.1:3000/uploads'+item.thumbnail"
                  />
                </b-col>
                <b-col md="9">
                  <div class="articalInfo">
                    <h5>{{item.titel}}</h5>
                    <p>by {{item.authorId}}</p>
                  </div>
                </b-col>
              </b-row>
            </b-card>
          </div>
        </b-col>
        <b-col md="9" class="rightside">
          <b-card>
            <h1>{{articalTitle}}</h1>
            <mavon-editor codeStyle="monokai" v-html="artical"></mavon-editor>
            <div class="feedback">
              <div :class="[likeIt?'active':'','iconSpan']" @click="likeThis">
                <van-icon name="good-job" />
                <span>点赞</span>
              </div>
              <div class="iconSpan" @click="showInput">
                <van-icon name="comment" />
                <span>评论</span>
              </div>
              <div :class="[{ active: starIt },'iconSpan']" @click="starThis">
                <van-icon name="star" />
                <span>收藏</span>
              </div>
              <div class="iconSpan">
                <van-icon name="share" />
                <span>分享</span>
              </div>
            </div>
          </b-card>
          <MessageBoard :showIt="toHigher" :authorInfo="authorInfo"></MessageBoard>
          <Footer></Footer>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Topsearch from "../components/Topsearch";
import Footer from "../components/Footer";
import MessageBoard from "../components/MessageBoard";
import Vue from "vue";
import { Image as VanImage, Icon, Dialog, Toast } from "vant";
Vue.use(VanImage);
Vue.use(Icon);
Vue.use(Dialog);
Vue.use(Toast);
import { LayoutPlugin, CardPlugin, ButtonPlugin } from "bootstrap-vue";
Vue.use(LayoutPlugin);
Vue.use(CardPlugin);
Vue.use(ButtonPlugin);

import { mavonEditor } from "mavon-editor"; //引入mavonEditor
import "mavon-editor/dist/css/index.css";
export default {
  inject: ["reload"],
  name: "Artical",
  components: {
    Topsearch,
    Footer,
    mavonEditor,
    MessageBoard
  },
  data() {
    return {
      articalTitle: "",
      artical: "",
      authorInfo: {},
      blogData: [],
      likeIt: false,
      starIt: false,
      toHigher: false,
      isAttention: false //是否关注
    };
  },
  methods: {
    showInput() {
      this.toHigher = !this.toHigher;
    },
    toArtical(id) {
      this.$axios.get("/views", { params: { id } });
      this.$router.push({ name: "Artical", params: { id } });
      // this.$forceUpdate();
    },
    likeThis() {
      if (this.$store.state.isLogin) {
        this.likeIt = !this.likeIt;
        let userInfo = this.$store.state.bloggerInfo
        if (this.likeIt) {
          this.$axios
            .get("/likeItOrNot", {
              params: { _id: this.$route.params.id, likeIt: 1 }
            })
            .then(res => {
              Toast(res.data.message);
            });
          //在user表添加点赞数据
          this.$axios.get("/addLikeOrNot", {
            params: {
              userId: userInfo._id,
              articalId: this.$route.params.id,
              likeIt: 1
            }
          });
        } else {
          this.$axios
            .get("/likeItOrNot", {
              params: { _id: this.$route.params.id, likeIt: 0 }
            })
            .then(res => {
              Toast(res.data.message);
            });
          //在user表中删除点赞数据
          this.$axios.get("/addLikeOrNot", {
            params: {
              userId: userInfo._id,
              articalId: this.$route.params.id,
              likeIt: 0
            }
          });
        }
      } else {
        Dialog.confirm({
          message: "登录后才能点赞哦！"
        })
          .then(() => {
            this.show = false;
            this.$router.push({ name: "Login" });
          })
          .catch(() => {
            return;
          });
      }
    },
    starThis() {
      if (this.$store.state.isLogin) {
        this.starIt = !this.starIt;
        let userInfo = this.$store.state.bloggerInfo
        if (this.starIt) {
          if (this.authorInfo.username != userInfo.username) {
            this.$axios
              .get("/starItOrNot", {
                params: {
                  userId: userInfo._id,
                  articalId: this.$route.params.id,
                  starIt: 1
                }
              })
              .then(res => {
                Toast(res.data.message);
              });
          } else {
            Toast("自己的文章不能收藏哦！");
            this.starIt = false;
          }
        } else {
          this.$axios
            .get("/starItOrNot", {
              params: {
                userId: userInfo._id,
                articalId: this.$route.params.id,
                starIt: 0
              }
            })
            .then(res => {
              Toast(res.data.message);
            });
        }
      } else {
        Dialog.confirm({
          message: "登录后才能收藏哦！"
        })
          .then(() => {
            this.show = false;
            this.$router.push({ name: "Login" });
          })
          .catch(() => {
            return;
          });
      }
    },
    toAuthorMain() {
      let userInfo = this.$store.state.bloggerInfo
      if (userInfo && this.authorInfo._id == userInfo._id) {
        this.$router.push({ name: "Myblog" });
      } else {
        this.$router.push({
          name: "UserBlogs",
          params: { id: this.authorInfo._id }
        });
      }
    },
    addAttentionOrNot() {
      // let bloggerInfo = JSON.parse(localStorage.getItem("userInfo"));
      let bloggerInfo = this.$store.state.bloggerInfo
      if (this.$store.state.isLogin) {
        if (this.authorInfo._id != bloggerInfo._id) {
          if (!this.isAttention) {
            //添加关注
            this.$axios
              .get("/addAttention", {
                params: { _id: bloggerInfo._id, userId: this.authorInfo._id }
              })
              .then(res => {
                Toast.success(res.data.message);
                this.isAttention = true;
              });
            //添加粉丝
            this.$axios
              .get("/addFans", {
                params: { _id: this.authorInfo._id, userId: bloggerInfo._id }
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
                      userId: this.authorInfo._id
                    }
                  })
                  .then(res => {
                    if (res.data.code == 200) {
                      this.show = false;
                      this.isAttention = false;
                    }
                  });
                //移除粉丝
                this.$axios
                  .get("/rmFans", {
                    params: {
                      _id: this.authorInfo._id,
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
    let articals = JSON.parse(localStorage.getItem("artical"));
    let userInfo = this.$store.state.bloggerInfo
    let hotArticals = JSON.parse(localStorage.getItem("popularData"));
    articals.forEach(e => {
      if (this.$route.params.id == e._id) {
        this.articalTitle = e.titel;
        let result = mavonEditor.getMarkdownIt().render(e.content);
        this.artical = result;
        //获取作者信息
        this.$axios
          .get("/getUserInfoById", { params: { id: e.author_id } })
          .then(res => {
            this.authorInfo = res.data.result;
            //如果已关注
            this.authorInfo.fans.forEach(e => {
              if (userInfo && e == userInfo._id) {
                this.isAttention = true;
              }
            });
          });
      }
    });
    //获取推荐文章
    for (let i = 0; i < 9; i++) {
      if (this.$route.params.id != hotArticals[i]._id) {
        this.blogData.push(hotArticals[i]);
      }
    }
    if (this.$store.state.isLogin) {
      this.$axios
        .get("/getUserInfoById", { params: { id: userInfo._id } })
        .then(res => {
          let blogger = res.data.result;
          blogger.like.forEach(e => {
            if (e == this.$route.params.id) {
              this.likeIt = true;
            }
          });
          blogger.collect.forEach(e => {
            if (e == this.$route.params.id) {
              this.starIt = true;
            }
          });
        });
    }
  }
};
</script>

<style lang='scss' scoped>
@media screen and (max-width: 480px) {
  .container .row .leftside {
    padding: 0 10px 0 10px;
    margin-bottom: 5px;
    .recommend {
      display: none;
    }
  }
}
.artical {
  background-color: $bg;
  min-height: 100vh;
}
.container {
  padding: 10px;
  padding-top: 90px;
  .leftside {
    padding: 0 0 0 5px;
    .btn {
      margin: 5px;
    }
    .hidden {
      display: none;
    }
  }
  .rightside {
    padding: 0 10px 0 10px;
    .card {
      position: relative;
      min-height: 90vh;
      text-align: left;
      .shadow {
        box-shadow: none !important;
        z-index: 0;
        margin-bottom: 30px;
      }
    }
    .feedback {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: $q-f5;
      .iconSpan {
        cursor: pointer;
        float: left;
        margin: 5px 10px 5px 20px;
        padding: 5px;
      }
      .iconSpan.active .van-icon {
        color: $red;
      }
      .van-icon {
        vertical-align: middle;
      }
      span {
        font-size: 14px;
        margin-left: 5px;
        vertical-align: middle;
      }
    }
  }
  .recommend {
    padding-top: 20px;
    .text {
      padding-bottom: 10px;
      font-size: 14px;
      color: #969696;
    }
    .card {
      margin-bottom: 5px;
      cursor: pointer;
    }
    .col-md-3 {
      .van-image {
        vertical-align: bottom;
        padding: 5px;
      }
    }
    .articalInfo {
      text-align: left;
      height: 100%;
      position: relative;
      h5 {
        margin: 0px 0 5px 5px;
        padding-top: 5px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; // 控制多行的行数
        -webkit-box-orient: vertical;
      }
      p {
        font-size: 12px;
        position: absolute;
        margin: 0;
        left: 5px;
        bottom: 5px;
      }
    }
  }
}
</style>