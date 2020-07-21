<template>
  <div class="toplink">
    <div class="top">
      <div class="pull-left">
        <h3 @click="toHome">Blog</h3>
        <van-search
          class="search"
          v-model="value"
          shape="round"
          @search="onSearch"
          placeholder="请输入搜索关键词"
          :style="{'display':'inline-block','background': 'inherit','padding':0,'width': '50%'}"
        />
        <div class="iconClick" @click="showPopup">
          <van-icon name="wap-nav" />
        </div>
        <van-popup
          v-model="show"
          position="right"
          :style="{ height: '100%',width:'300px'}"
          closeable
          close-icon="close"
        >
          <div id="drawer-right">
            <van-image round fit="cover" width="100px" height="100px" :src="userAvatar" />
            <ul class="nav nav-pills nav-stacked">
              <li @click="linkTO(item.name)" v-for="(item, index) in lisData" :key="index">
                <van-icon :name="item.iconName" />
                <span>{{item.spanInfo}}</span>
              </li>
              <li :class="{ quitShow: !quitBtn }" @click="quitLogin">
                <van-icon name="arrow-left" />
                <span>退出登录</span>
              </li>
            </ul>
            <div :class="[{ loginShow: quitBtn },'status']">
              <span @click="$router.push({name:'Login'})">登录</span>/
              <span @click="$router.push({name:'Register'})">注册</span>
            </div>

            <div class="social">
              <h2>Stay Connected</h2>

              <span>
                <van-icon name="phone" />
              </span>
              <span>
                <van-icon name="chat" />
              </span>
              <span>
                <van-icon name="alipay" />
              </span>
              <span>
                <van-icon name="wechat" />
              </span>
            </div>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Popup, Icon, Search, Dialog } from "vant";
Vue.use(Popup);
Vue.use(Icon);
Vue.use(Search);
Vue.use(Dialog);

export default {
  inject: ["reload"],
  name: "Toplink",
  data() {
    return {
      value: "",
      show: false,
      pageY: 0,
      quitBtn: false,
      userAvatar: require("../assets/imgs/defaultAvatar.jpg"),
      lisData: [
        {
          name: "Myblog",
          iconName: "manager",
          spanInfo: "我的主页"
        },
        {
          name: "Star",
          iconName: "star",
          spanInfo: "我的收藏"
        },
        {
          name: "MyAttention",
          iconName: "like",
          spanInfo: "我的关注"
        },
        {
          name: "Myfans",
          iconName: "friends",
          spanInfo: "我的粉丝"
        },
        {
          name: "Draft",
          iconName: "comment",
          spanInfo: "我的草稿"
        },
        {
          name: "Profile",
          iconName: "setting",
          spanInfo: "我的设置"
        }
      ]
    };
  },
  computed: {},
  methods: {
    showPopup() {
      this.show = true;
    },
    toHome() {
      this.$router.push({ name: "Home" });
    },
    linkTO(name) {
      if (this.$store.state.isLogin) {
        if (this.$route.name != name) {
          this.$router.push({ name });
        }
      } else {
        Dialog.confirm({
          message: "请先登录！"
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
    quitLogin() {
      Dialog.confirm({
        message: "确定退出登录吗？"
      })
        .then(() => {
          this.show = false;
          this.quitBtn = false;
          this.userAvatar = require("../assets/imgs/defaultAvatar.jpg");
          this.$store.commit("changeLoginStatus", false);
          this.$store.commit("receive_userInfo", {});
          // localStorage.removeItem("isLogin");
          // localStorage.removeItem("userInfo");
          this.$router.push({ name: "Login" });
        })
        .catch(() => {
          return;
        });
    },
    onSearch(){
      this.$axios.get("/likeArticalSearch",{params:{value:this.value}}).then(res=>{
        // console.log(res.data.result);
        this.$store.commit("receive_searchResult",res.data.result)
        if (this.$route.params.type == "search") {
          this.reload()
        }else{
          this.$router.push({name:"Bloglist",params:{type:"search"}})
        }
        this.value = ''
      })
    }
  },
  created() {
    if (this.$store.state.isLogin) {
      let userInfo = this.$store.state.bloggerInfo
      this.quitBtn = true;
      this.userAvatar = "http://127.0.0.1:3000/uploads" + userInfo.avatar;
    } else {
      this.quitBtn = false;
    }
  }
};
</script>

<style lang="scss" scoped>
#drawer-right {
  background: #2b3e51;
  width: 300px;
  height: 100%;
  padding: 20px;
  text-align: center;
  .van-image {
    margin: 30px 0 20px 0;
  }
  ul.nav {
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    line-height: 20px;
    cursor: pointer;
    li {
      width: 100%;
      display: block;
      border-radius: 4px;
      padding: 10px 15px;
      font-size: 18px;
      color: $q-blue;
      &.quitShow {
        display: none;
      }
      span {
        vertical-align: middle;
      }
      .van-icon {
        width: 25px;
        vertical-align: top;
      }
      &:hover {
        background-color: $q-white;
      }
    }
  }
  .status {
    margin-top: 5px;
    cursor: pointer;
    color: $q-blue;
  }
  .loginShow {
    display: none;
  }
  .social {
    margin-top: 20px;
    color: $q-white;
    text-align: center;
    span {
      font-size: 35px;
      padding-left: 20px;
    }
  }
}

.top {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 15px;
  height: auto;
  z-index: 500;
  border: 1px solid #f0f0f0;
  background: rgb(255, 255, 255);

  .pull-left {
    line-height: 48px;
    overflow: hidden;
    h3 {
      cursor: pointer;
      float: left;
      line-height: 40px;
      color: $q-dark;
      margin: 0;
    }
    .iconClick {
      cursor: pointer;
      color: $q-dark;
      float: right;
      line-height: 40px;
      font-size: 40px;
    }
  }
}
</style>
