<template>
  <div class="bloglist">
    <Topsearch></Topsearch>
    <div class="bloglistWrap">
      <b-container>
        <b-row>
          <b-col md="8">
            <b-card>
              <van-card
                v-for="(item, index) in moreArticals"
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
                      {{item.createdTime}} by {{item.authorId}}
                      <span class="iconSpan">
                        <van-icon name="eye" />
                        <span class="number">{{item.views}}</span>
                      </span>
                      <span class="iconSpan">
                        <van-icon name="good-job" />
                        <span class="number">{{item.likes}}</span>
                      </span>
                    </p>
                  </div>
                </template>
              </van-card>
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
import Sideshow from "../components/Sideshow";
import Footer from "../components/Footer";
import Vue from "vue";
import { Card, Button, Tag, Calendar } from "vant";
Vue.use(Tag);
Vue.use(Button);
Vue.use(Card);
Vue.use(Calendar);

const sd = require("silly-datetime");
import { LayoutPlugin, CardPlugin } from "bootstrap-vue";
Vue.use(LayoutPlugin);
Vue.use(CardPlugin);

export default {
  name: "Bloglist",
  data() {
    return {
      moreArticals: []
    };
  },
  methods: {
    toSpecific(id) {
      this.$axios.get("/views", { params: { id } });
      this.$router.push({ name: "Artical", params: { id } });
    }
  },
  mounted() {
    let articals = JSON.parse(localStorage.getItem("artical"));
    articals.forEach(e => {
      let time = sd.format(e.createdAt, "YYYY-MM-DD HH:mm"); //时间戳
      e.createdTime = time;
    });
    let hotArticals = JSON.parse(localStorage.getItem("popularData"));
    if (this.$route.params.type == "latest") {
      this.moreArticals = articals.reverse();
    } else if (this.$route.params.type == "hot") {
      this.moreArticals = hotArticals;
    }else{
      this.moreArticals = this.$store.state.searchResult
    }
  },
  components: {
    Topsearch,
    Sideshow,
    Footer
  }
};
</script>

<style lang="scss" scoped>
.bloglist {
  background: rgb(250, 250, 250);
}
.bloglistWrap {
  padding-top: 78px;
  text-align: left;
}
.row {
  padding: 12px 0 10px 0px;
  font-size: 14px;
  .col-md-8 {
    cursor: pointer;
    padding: 0 10px 0 10px;
    margin-bottom: 10px;
    .card-body {
      padding: 10px;
      min-height: 80vh;
    }
    .van-card {
      background: none;
      padding: 8px;
    }
  }
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
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; // 控制多行的行数
    -webkit-box-orient: vertical;
    span.iconSpan {
      color: $q-gray;
      line-height: 16px;
      font-size: 12px;
      margin-left: 5px;
    }
    .van-icon {
      vertical-align: middle;
    }
    .number {
      vertical-align: middle;
    }
  }
}
</style>