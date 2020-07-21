<template>
  <div class="personal">
    <Topsearch></Topsearch>
    <div class="personalWrap">
      <b-container>
        <b-row>
          <b-col md="8" v-if="userInfo.avatar" >
            <van-card :thumb="'http://127.0.0.1:3000/uploads'+userInfo.avatar" @click="$router.push({name:'Myblog'})">
              <template #price-top>
                <p>{{userInfo.username}}</p>
              </template>
              <template #bottom>
                <div class="baseinfo" v-if="userInfo.attention">
                  <span class="starSpan">关注>{{userInfo.attention.length}}</span>
                  <span class="fansSpan">粉丝>{{userInfo.fans.length}}</span>
                </div>
                <b-button variant="outline-dark" @click="toEdit">
                  <van-icon name="edit" />
                  <span>新建</span>
                </b-button>
              </template>
            </van-card>

            <b-card>
              <b-nav tabs>
                <b-nav-item :to="{name:'MyAttention'}" exact exact-active-class="active">
                  <van-icon name="like"/>
                  <span>我的关注</span>
                </b-nav-item>
                <b-nav-item :to="{name:'Myfans'}" exact exact-active-class="active">
                  <van-icon name="friends" />
                  <span>我的粉丝</span>
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
      userInfo: {}
    };
  },
  components: {
    Topsearch,
    Footer,
    Sideshow
  },
  methods: {
    toEdit(){
      event.stopPropagation();
      this.$router.push({name:'Edit',params:{articalId:'new'}})
    }
  },
  mounted() {
    let bloggerInfo = this.$store.state.bloggerInfo
     this.$axios
      .get("/getUserInfoById", { params: { id: bloggerInfo._id } })
      .then(res => {
        this.userInfo = res.data.result;
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
    .van-card__thumb{
      cursor: pointer;
    }
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
      cursor: pointer;
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