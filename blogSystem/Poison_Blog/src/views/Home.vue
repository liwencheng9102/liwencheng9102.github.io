<template>
  <div class="home">
    <Toplink></Toplink>

    <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white" ref="swipe">
      <van-swipe-item v-for="(item,index) in messaages" :key="index">
        <div
          class="header"
          :style="{'background': 'url('+item.img+') no-repeat center center','background-size': 'cover'}"
        >
          <div class="center">
            <div class="slogan">{{item.slogan}}</div>
            <div class="secondary-slogan">{{item.secondary}}</div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>

    <div class="content-block blog">
      <b-container class="bv-example-row container">
        <div class="block-heading cleafix">
          <div class="left">
            <h1>最热</h1>
            <p>受欢迎的热门博客</p>
          </div>
          <div class="right">
            <b-button variant="outline-dark" class="btn" @click="tohotBlog">更多</b-button>
          </div>
        </div>
        <div class="block-body">
          <b-row class="row">
            <b-col
              class="col-md-4"
              md="4"
              v-for="(blog,index) in popularBlogData"
              :key="index"
              @click="toArtical(blog._id)"
            >
              <div class="wrap">
                <div class="pageTop">
                  <div class="overlay"></div>
                  <van-image width="100%" height="250" fit="cover" :src="'http://127.0.0.1:3000/uploads'+blog.thumbnail" />
                </div>
                <div class="gtco-text text-left">
                  <h2>{{blog.titel}}</h2>
                  <p>{{blog.content}}</p>
                  <span class="gtco-category">{{blog.createdTime}} by {{blog.authorId}}</span>
                  <span class="iconSpan">
                    <van-icon name="good-job" />{{blog.likes}}
                  </span>
                  <span class="iconSpan">
                    <van-icon name="eye" />{{blog.views}}
                  </span>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
      </b-container>
    </div>

    <div class="content-block blog latest">
      <b-container class="bv-example-row container">
        <div class="block-heading cleafix">
          <div class="left">
            <h1>最新</h1>
            <p>近期最新发布的博客</p>
          </div>
          <div class="right">
            <b-button variant="outline-dark" class="btn" @click="tolatestBlog">更多</b-button>
          </div>
        </div>
        <div class="block-body">
          <b-row class="row">
            <b-col class="col-md-4" md="4" v-for="(blog,index) in latestBlogData" :key="index">
              <div class="wrap" @click="toArtical(blog._id)">
                <div class="pageTop">
                  <div class="overlay"></div>
                  <van-image
                    width="100%"
                    height="250"
                    fit="cover"
                    :src="'http://127.0.0.1:3000/uploads'+blog.thumbnail"
                  />
                </div>
                <div class="gtco-text text-left">
                  <h2>{{blog.titel}}</h2>
                  <p>{{blog.content}}</p>
                  <span class="gtco-category">{{blog.createdTime}} by {{blog.authorId}}</span>
                  <span class="iconSpan">
                    <van-icon name="good-job" />
                    {{blog.likes}}
                  </span>
                  <span class="iconSpan">
                    <van-icon name="eye" />
                    {{blog.views}}
                  </span>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
      </b-container>
    </div>
    <!-- #blog -->

    <div class="content-block footer">
      <div class="container">
        <div class="row text-center">
          <div class="col-xs-12 col-md-12">
            <p>@Poison_Missing 个人博客系统 开发不易,一分也是爱！</p>
          </div>
        </div>
      </div>
    </div>
    <!-- #footer -->
  </div>
</template>

<script>
import Vue from "vue";
import { Swipe, SwipeItem, Popup, Icon } from "vant";
import { Image as VanImage } from "vant";
Vue.use(VanImage);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Popup);
Vue.use(Icon);

import { LayoutPlugin, ButtonPlugin } from "bootstrap-vue";
Vue.use(LayoutPlugin);
Vue.use(ButtonPlugin);

const sd = require("silly-datetime");
import Toplink from "../components/Toplink";

export default {
  name: "Home",
  components: {
    Toplink
  },
  data() {
    return {
      messaages: [
        {
          img: require("../assets/imgs/stars.jpg"),
          slogan: "EXPLORE",
          secondary: "Looking up at the stars."
        },
        {
          img: require("../assets/imgs/womandog.jpg"),
          slogan: "CREATE",
          secondary: "Keeping feet on the ground."
        },
        {
          img: require("../assets/imgs/header-bg.jpg"),
          slogan: "PRATICE",
          secondary: "Practice proves truth."
        }
      ],
      latestBlogData: [],
      popularBlogData: []
    };
  },
  methods: {
    tolatestBlog() {
      this.$router.push({ name: "Bloglist", params: { type: "latest" } });
    },
    tohotBlog() {
      this.$router.push({ name: "Bloglist", params: { type: "hot" } });
    },
    toArtical(id) {
      this.$axios.get("/views", { params: { id } });
      this.$router.push({ name: "Artical", params: { id } });
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
    this.getArtical().then(() => {
      let data = JSON.parse(localStorage.getItem("artical"));
      data.forEach(e => {
        let time = sd.format(e.createdAt, "YYYY-MM-DD HH:mm"); //时间戳
        e.createdTime = time;
      });
      // console.log(data);
      //最新博客数组
      let latestData = [];
      for (let i = data.length - 1; i > data.length - 7; i--) {
        latestData.push(data[i]);
      }
      this.latestBlogData = latestData;

      //最热博客数组
      let popularData = data;
      for (let i = 0, arrLength = popularData.length; i < arrLength - 1; i++) {
        for (let j = 0; j < arrLength - i - 1; j++) {
          if (
            0.4 * popularData[j].views + 0.6 * popularData[j].likes <
            0.4 * popularData[j + 1].views + 0.6 * popularData[j + 1].likes
          ) {
            let temp = popularData[j];
            popularData[j] = popularData[j + 1];
            popularData[j + 1] = temp;
          }
        }
      }
      localStorage.setItem("popularData", JSON.stringify(popularData));
      for (let i = 0; i < 6; i++) {
        this.popularBlogData.push(popularData[i]);
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.my-swipe {
  .van-swipe-item {
    display: table;
    height: 100vh;
    width: 100%;
    position: relative;
    z-index: 0;
    overflow-x: hidden;
    .header {
      height: 100vh;
      width: 100%;
      position: relative;
      overflow: auto;
      display: table-cell;
      text-align: center;
      vertical-align: middle;

      .center {
        position: absolute;
        width: 100%;
        top: 42%;

        .slogan {
          font-size: 4em;
          margin-bottom: 15px;
          line-height: 1em;
          font-family: "Nixie One";
          color: $q-white;
        }

        .secondary-slogan {
          font-size: 1.6em;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1em;
          font-family: "Alegreya SC";
        }
      }
    }
  }
}

.blog.latest {
  background: $q-white;
}
.blog {
  padding: 60px 0 30px 0;
  background: #f1f0f0;
  .container {
    .block-heading {
      padding-bottom: 25px;
      text-align: left;
      overflow: hidden;
      .left {
        float: left;
      }
      p {
        margin-bottom: 0px;
      }
      .right {
        height: 80px;
        line-height: 80px;
        text-align: right;
      }
      .btn {
        display: inline-block;
        font-size: 20px;
        width: 100px;
      }
    }

    .block-body {
      .row {
        margin-left: -15px;
        margin-right: -15px;
        .wrap {
          cursor: pointer;
          display: block;
          width: 100%;
          position: relative;
          overflow: hidden;
          bottom: 0;
          margin-bottom: 30px;
          box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.08);
          border-radius: 10px;
          transition: all 0.3s;
          &:hover {
            bottom: 7px;
            text-decoration: none;
            box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.19);
            .pageTop {
              .overlay {
                opacity: 1;
                visibility: visible;
              }
              .van-image {
                transform: scale(1.2);
              }
            }
          }
          .pageTop {
            overflow: hidden;
            position: relative;
            margin: 0 0 10px 0;
            .overlay {
              opacity: 0;
              visibility: hidden;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              position: absolute;
              background: rgba(0, 0, 0, 0.4);
              transition: 0.7s;
              z-index: 99;
            }
            .van-image {
              transition: 0.3s;
            }
          }
          .gtco-text {
            padding: 0px 10px 10px 20px;
            overflow: hidden;
            h2 {
              font-size: 20px;
              font-weight: 400;
              margin: 0 0 10px 0;
              color: #2f3a6f;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1; // 控制多行的行数
              -webkit-box-orient: vertical;
            }
            p {
              font-size: 14px;
              color: $q-gray;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3; // 控制多行的行数
              -webkit-box-orient: vertical;
              margin-bottom: 10px;
            }
            span.iconSpan {
              float: right;
              color: $q-gray;
              line-height: 18px;
              font-size: 12px;
              margin-left: 5px;
            }
            .van-icon {
              vertical-align: middle;
            }
            span.gtco-category {
              font-size: 12px;
              color: $q-gray;
              float: left;
            }
          }
        }
      }
    }
  }
}

.footer {
  background: #2b3e51;
  color: $q-white;
  padding: 60px 0;
  p {
    font-size: 14px;
    margin: 0;
  }
}
</style>