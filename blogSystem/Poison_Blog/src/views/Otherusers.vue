<template>
  <div class="personal">
    <Topsearch></Topsearch>
    <div class="personalWrap">
      <b-container>
        <b-row>
          <b-col md="8" v-if="userInfo.avatar">
            <van-card :thumb="'http://127.0.0.1:3000/uploads'+userInfo.avatar">
              <template #price-top>
                <p>{{userInfo.username}}</p>
              </template>
              <template #bottom>
                <div class="baseinfo" v-if="userInfo.attention">
                  <span class="starSpan">发表>{{userBlogs.length}}</span>
                  <span class="fansSpan">粉丝>{{userInfo.fans.length}}</span>
                </div>
                <b-button
                  variant="outline-dark"
                  :class="{hidden:isAttention}"
                  @click="addAttentionOrNot"
                >
                  <span>关注</span>
                </b-button>
                <b-button
                  variant="outline-dark"
                  :class="{hidden:!isAttention}"
                  @click="addAttentionOrNot"
                >
                  <span>取消关注</span>
                </b-button>
              </template>
            </van-card>

            <b-card>
              <b-nav tabs>
                <b-nav-item :to="{name:'UserBlogs'}" exact exact-active-class="active">
                  <van-icon name="column" />
                  <span>文章</span>
                </b-nav-item>
                <b-nav-item :to="{name:'Attention'}" exact exact-active-class="active">
                  <van-icon name="like" />
                  <span>Ta的关注</span>
                </b-nav-item>
                <b-nav-item :to="{name:'Fans'}" exact exact-active-class="active">
                  <van-icon name="friends" />
                  <span>粉丝</span>
                </b-nav-item>
              </b-nav>
              <router-view></router-view>
            </b-card>
            <Footer></Footer>
          </b-col>
          <Sideshow></Sideshow>
        </b-row>
      </b-container>
    </div>
  </div>
</template>
<script>
import Topsearch from "../components/Topsearch";
import Footer from "../components/Footer";
import Sideshow from "../components/Sideshow";
import Vue from "vue";
import { Image as VanImage, Card, Toast, Dialog } from "vant";
Vue.use(Card);
Vue.use(VanImage);
Vue.use(Toast);
Vue.use(Dialog);
import {
  LayoutPlugin,
  CardPlugin,
  NavPlugin,
  ButtonPlugin
} from "bootstrap-vue";
Vue.use(LayoutPlugin);
Vue.use(CardPlugin);
Vue.use(NavPlugin);
Vue.use(ButtonPlugin);
export default {
  inject: ["reload"],
  name: "Personal",
  data() {
    return {
      show: false,
      userInfo: {},
      userBlogs: [],
      isAttention: false
    };
  },
  components: {
    Topsearch,
    Footer,
    Sideshow
  },
  methods: {
    addAttentionOrNot() {
      let bloggerInfo = this.$store.state.bloggerInfo
      if (this.$store.state.isLogin) {
        if (!this.isAttention) {
          //添加关注
          this.$axios
            .get("/addAttention", {
              params: { _id: bloggerInfo._id, userId: this.$route.params.id }
            })
            .then(res => {
              Toast.success(res.data.message);
              this.isAttention = true;
            });
          //添加粉丝
          this.$axios
            .get("/addFans", {
              params: { _id: this.$route.params.id, userId: bloggerInfo._id }
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
                    userId: this.$route.params.id
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
                    _id: this.$route.params.id,
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
         Toast.fail("登录后才能关注哦")
      }
    },
    getArtical() {
      return new Promise(resolve => {
        this.$axios.get("/getArtical").then(res => {
          // console.log("getArtical");
          localStorage.setItem("artical", JSON.stringify(res.data.docs));
          resolve();
        });
      });
    }
  },
  mounted() {
    let bloggerInfo = this.$store.state.bloggerInfo
    this.$axios
      .get("/getUserInfoById", { params: { id: this.$route.params.id } })
      .then(res => {
        this.userInfo = res.data.result;
        this.userInfo.fans.forEach(e => {
          if (bloggerInfo && e == bloggerInfo._id) {
            this.isAttention = true;
          }
        });
        //获取发表文章数量
        this.getArtical().then(() => {
          let data = JSON.parse(localStorage.getItem("artical"));
          data.forEach(e => {
            if (e.author_id == res.data.result._id) {
              this.userBlogs.push(e);
            }
          });
        });
      });
  }
};
</script>

<style lang='scss' scoped>
.personal {
  background: rgb(250, 250, 250);
}
.personalWrap {
  padding-top: 90px;
  text-align: left;
  .col-md-8 {
    padding: 0 10px 0 10px;
  }
  .van-card {
    .van-card__bottom {
      overflow: hidden;
      height: 100%;
      padding-top: 10px;
      .baseinfo {
        float: left;
        margin-top: 5px;
        cursor: pointer;
      }
      .starSpan {
        padding-right: 5px;
        border-right: 1px solid #eee;
      }
      .fansSpan {
        padding-left: 5px;
      }
      .btn {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .hidden {
        display: none;
      }
      span {
        vertical-align: middle;
      }
    }
    padding: 0;
    p {
      font-size: 21px;
      font-weight: 700;
      vertical-align: middle;
    }
  }
  .card {
    min-height: 80vh;
    margin-top: 20px;
    .nav-link {
      color: $q-dark;
    }
    .van-icon {
      vertical-align: middle;
      margin-right: 5px;
    }
    span {
      vertical-align: middle;
    }
  }
}
</style>