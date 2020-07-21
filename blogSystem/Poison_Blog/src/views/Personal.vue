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
                  <span
                    class="starSpan"
                    @click="$router.push({name:'MyAttention'})"
                  >关注>{{userInfo.attention.length}}</span>
                  <span
                    class="fansSpan"
                    @click="$router.push({name:'Myfans'})"
                  >粉丝>{{userInfo.fans.length}}</span>
                </div>
                <b-button
                  variant="outline-dark"
                  @click="$router.push({name:'Edit',params:{articalId:'new'}})"
                >
                  <van-icon name="edit" />
                  <span>新建</span>
                </b-button>
              </template>
            </van-card>

            <b-card>
              <b-nav tabs>
                <b-nav-item :to="{name:'Myblog'}" exact exact-active-class="active">
                  <van-icon name="column" />
                  <span>文章</span>
                </b-nav-item>
                <b-nav-item :to="{name:'Remind'}" exact exact-active-class="active">
                  <van-icon name="bell" :dot="dot" />
                  <span>动态</span>
                </b-nav-item>
                <b-nav-item :to="{name:'Message'}" exact exact-active-class="active">
                  <van-icon name="comment-circle" :dot="unreadMessageDot" />
                  <span>留言</span>
                </b-nav-item>
                <b-nav-item :to="{name:'Star'}" exact exact-active-class="active">
                  <van-icon name="star" />
                  <span>收藏</span>
                </b-nav-item>
                <b-nav-item :to="{name:'Draft'}" exact exact-active-class="active">
                  <van-icon name="comment" />
                  <span>草稿</span>
                </b-nav-item>
                <b-nav-item :to="{name:'Profile'}" exact exact-active-class="active">
                  <van-icon name="manager" />
                  <span>个人资料</span>
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
import { Image as VanImage } from "vant";
import { Card, Icon } from "vant";
Vue.use(Card);
Vue.use(VanImage);
Vue.use(Icon);
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
  name: "Personal",
  data() {
    return {
      userInfo: {},
      dot: false,
      unreadMessageDot:false,
      unreadArticals: [],
      unreadMessages:[]
    };
  },
  components: {
    Topsearch,
    Footer,
    Sideshow
  },
  methods: {
    getAttentionArticals(attention) {
      let bloggerInfo = this.$store.state.bloggerInfo;
      return new Promise(resolve => {
        let unreadArticals = [];
        for (let i = 0; i < attention.length; i++) {
          const element = attention[i];
          this.$axios
            .get("/getArtByOneAuthor", { params: { author_id: element } })
            .then(res => {
              res.data.result.forEach(e => {
                e.unread.forEach(item => {
                  //关注用户发布新文章未读提醒
                  if (item == bloggerInfo._id) {
                    this.dot = true;
                    unreadArticals.push(e);
                  }
                });
              });
              if (i == attention.length - 1) {
                resolve(unreadArticals);
              }
            });
        }
      });
    },
    getUnreadMessage() {
      let bloggerInfo = this.$store.state.bloggerInfo;
      return new Promise(resolve => {
        let comments = [];
        //查找自己发布的文章
        this.$axios
          .get("/getArtByOneAuthor", { params: { author_id: bloggerInfo._id } })
          .then(res => {
            let articals = res.data.result;
            for (let i = 0; i < articals.length; i++) {
              const element = articals[i];
              //查找文章下的留言
              this.$axios
                .get("/getCommentByArticalId", { params: { articalId: element._id } })
                .then(res => {
                  res.data.result.forEach(e=>{
                    comments.push(e)
                  })
                  if (i == articals.length - 1) {
                    resolve(comments);
                  }
                });
            }
          });
      });
    }
  },
  mounted() {
    let bloggerInfo = this.$store.state.bloggerInfo;
    this.$axios //获取博主信息
      .get("/getUserInfoById", { params: { id: bloggerInfo._id } })
      .then(res => {
        this.userInfo = res.data.result;
        //获取未读文章
        this.getAttentionArticals(this.userInfo.attention).then(
          unreadArticals => {
            this.unreadArticals = unreadArticals;
            // if (unreadArticals.length != 0) {
            this.$store.commit("receive_unreadArticals", unreadArticals);
          }
        );
      });
    //评论未读标记
    this.getUnreadMessage().then(comments => {
      // console.log(comments);
      comments.forEach(e=>{
        if (e.unread) {
          this.unreadMessages.push(e)
          this.unreadMessageDot = true
        }
      })
      this.$store.commit("receive_unreadMessages", this.unreadMessages);
    });
  },
  beforeRouteUpdate(to, from, next) {
    let bloggerInfo = this.$store.state.bloggerInfo;
    if (to.name == "Remind") {
      //去除未读标记
      this.unreadArticals.forEach(e => {
        this.$axios
          .post("/rmUnreadUser", { _id: e._id, unreadId: bloggerInfo._id })
          .then(res => {
            if (res.data.code == 200) {
              this.dot = false;
            }
          });
      });
    }
    if (to.name == "Message") {
      this.unreadMessages.forEach(e=>{
        this.$axios.post("/readMessage",{id:e._id}).then(res=>{
          if (res.data.code == 200) {
            this.unreadMessageDot = false
          }
        })
      })
    }
    next();
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
      .van-icon {
        vertical-align: middle;
        margin-right: 5px;
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