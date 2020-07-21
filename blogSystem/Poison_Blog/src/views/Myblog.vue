<template>
  <div class="myBlog">
    <van-card
      v-for="(item, index) in myBlog"
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
            {{item.createdTime}}
            <span class="delete" @click="deleteArtical(item._id)">删除</span>
            <span class="edit" @click="editArtical(item._id)">编辑</span>
          </p>
        </div>
      </template>
    </van-card>
  </div>
</template>
<script>
const sd = require("silly-datetime");
import Vue from "vue";
import { Toast, Dialog } from "vant";
Vue.use(Toast);
Vue.use(Dialog);
export default {
  inject: ["reload"],
  name: "Myblog",
  data() {
    return {
      myBlog: [],
      show: false
    };
  },
  methods: {
    toSpecific(id) {
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
    },
    editArtical(id) {
      event.stopPropagation();
      Dialog.confirm({
        message: "确定修改吗？"
      })
        .then(() => {
          this.show = false;
          this.$router.push({name:'Edit',params:{articalId:id}})
        })
        .catch(() => {
          return;
        });
    },
    deleteArtical(id) {
      event.stopPropagation();
      Dialog.confirm({
        message: "确定删除吗？"
      })
        .then(() => {
          this.show = false;
          this.$axios.post("/deleteArtical", { id }).then(res => {
            Toast(res.data.message);
            this.reload();
          });
        })
        .catch(() => {
          return;
        });
    }
  },
  mounted() {
    let userInfo = this.$store.state.bloggerInfo
    this.getArtical().then(() => {
      let data = JSON.parse(localStorage.getItem("artical"));
      data.forEach(e => {
        if (e.authorId == userInfo.username) {
          let time = sd.format(e.createdAt, "YYYY-MM-DD HH:mm"); //时间戳
          e.createdTime = time;
          this.myBlog.unshift(e);
        }
      });
    });
  }
};
</script>

<style lang='scss' scoped>
.myBlog {
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
    .edit:hover {
      color: $q-dark;
    }
    .delete {
      color: $red;
    }
    .delete:hover {
      color: red;
    }
    .number {
      vertical-align: middle;
    }
  }
}
</style>