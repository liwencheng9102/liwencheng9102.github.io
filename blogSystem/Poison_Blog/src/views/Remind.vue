<template>
  <div class="remind">
    <van-card
      v-for="(item, index) in unreadBlogs"
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
          <p>{{item.createdTime}} by {{item.authorId}}</p>
        </div>
      </template>
    </van-card>
  </div>
</template>
<script>
const sd = require("silly-datetime");
// import Vue from "vue";
// import { Toast, Dialog } from "vant";
// Vue.use(Toast);
// Vue.use(Dialog);
export default {
  name: "Remind",
  data() {
    return {
      unreadBlogs: [],
      show: false
    };
  },
  methods: {
    toSpecific(id) {
      this.$router.push({ name: "Artical", params: { id } });
    },
  },
  mounted() {
    // let bloggerInfo = this.$store.state.bloggerInfo;
    let data = this.$store.state.unreadArticals;
    this.$store.commit("addUnreadArtical", data);
    this.$store.state.showUnreadArticals.forEach(e => {
      let time = sd.format(e.createdAt, "YYYY-MM-DD HH:mm"); //时间戳
      e.createdTime = time;
      this.unreadBlogs.unshift(e);
    });
  },
  destroyed() {
    this.$store.commit("rmUnreadArticals");
  },
};
</script>

<style lang='scss' scoped>
.remind {
  padding-top: 10px;
}
.van-card {
  cursor: pointer;
  background: none;
  padding: 8px 0 8px 0;
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
    span {
      float: right;
      color: $q-gray;
      font-size: 12px;
      margin: 0 5px 0 5px;
    }
    .number {
      vertical-align: middle;
    }
  }
}
</style>