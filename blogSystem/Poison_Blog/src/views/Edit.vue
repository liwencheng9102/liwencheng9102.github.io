<template>
  <div class="edit">
    <Topsearch></Topsearch>
    <div class="editWrap">
      <b-container>
        <b-form-input v-model="blogTitel" placeholder="请输入您的文章标题！"></b-form-input>
        <b-button variant="outline-secondary" v-bind:class="{'hidden':newBtn}" @click="addDraft">存草稿</b-button>
        <b-button
          variant="outline-secondary"
          v-bind:class="{'hidden':!newBtn}"
          @click="editArtical"
        >修改</b-button>
        <b-button
          variant="outline-secondary"
          v-bind:class="{'hidden':editBtn}"
          @click="addArtical"
        >发布</b-button>
        <mavon-editor :toolbars="markdownOption" v-model="handbook" ref="md" @imgAdd="$imgAdd" />
        <van-popup v-model="show" :close-on-click-overlay="false">
          <b-card>
            <van-uploader v-model="file" :max-count="1" :after-read="afterRead" multiple />
            <p>请选择文章的缩略图</p>
            <b-button variant="outline-dark" @click="addThumbnail">发布</b-button>
            <b-button variant="outline-dark" @click="regret">取消</b-button>
          </b-card>
        </van-popup>
        <Footer></Footer>
      </b-container>
    </div>
  </div>
</template>
<script>
import Topsearch from "../components/Topsearch";
import Footer from "../components/Footer";
import Vue from "vue";
// import Vue from "vue/dist/vue.js";
import {
  LayoutPlugin,
  CardPlugin,
  ButtonPlugin,
  FormInputPlugin
} from "bootstrap-vue";
Vue.use(LayoutPlugin);
Vue.use(CardPlugin);
Vue.use(ButtonPlugin);
Vue.use(FormInputPlugin);

import { Dialog, Popup, Uploader, Toast } from "vant";
Vue.use(Dialog);
Vue.use(Popup);
Vue.use(Uploader);
Vue.use(Toast);

import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "Edit",
  components: {
    Topsearch,
    Footer,
    mavonEditor
  },
  data() {
    return {
      show: false,
      file: [],
      blogTitel: "",
      markdownOption: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      handbook: "",
      thumbnail: {},
      editBtn: false,
      newBtn: false
    };
  },
  methods: {
    addArtical() {
      if (this.blogTitel) {
        if (this.handbook) {
          this.show = true;
        } else {
          Dialog.alert({
            message: "请填写文章内容！"
          }).then(() => {
            return;
          });
        }
      } else {
        Dialog.alert({
          message: "请填写文章标题！"
        }).then(() => {
          return;
        });
      }
    },
    addDraft() {
      if (this.blogTitel) {
        if (this.handbook) {
          let userInfo = this.$store.state.bloggerInfo;
          let obj = {
            status: 2,
            titel: this.blogTitel,
            content: this.handbook,
            authorId: userInfo.username,
            author_id: userInfo._id
          };
          this.$axios.post("/addArtical", obj).then(res => {
            if (res.data.code == 200) {
              this.blogTitel = "";
              this.handbook = "";
              this.$router.push({ name: "Draft" });
              Toast.success("已存入草稿箱");
            }
          });
        } else {
          Dialog.alert({
            message: "请填写文章内容！"
          }).then(() => {
            return;
          });
        }
      } else {
        Dialog.alert({
          message: "请填写文章标题！"
        }).then(() => {
          return;
        });
      }
    },
    afterRead(file) {
      this.thumbnail = file.file;
    },
    regret() {
      this.show = false;
    },
    publishArtical(obj) {
      //发布文章
      this.$axios.post("/addArtical", obj).then(res => {
        let newArtical = res.data.result;
        if (res.data.code == 200) {
          // console.log(this.thumbnail.name, "aaa");
          if (this.thumbnail.name) {
            //上传图片
            var data = new FormData();
            // 将需要添加的参数添加进表单中
            data.append("file", this.thumbnail); //获取需要上传的文件
            data.append("articalId", newArtical._id); //方便查找数据库对应的文章添加图片数据
            // console.log(data);
            let headers = {
              headers: { "Content-Type": "multipart/form-data" }
            }; //设置上传文件格式，为指定传输数据为二进制类型
            this.$axios.post("/uploads", data, headers).then(res => {
              if (res.data.code == 200) {
                console.log(res.data.message);
              }
            });
          }
          this.blogTitel = "";
          this.handbook = "";
          this.$router.push({ name: "Myblog" });
          Toast.success("文章发布成功！");
          this.show = false;
        }
      });
    },
    //发布订阅，给订阅者未读提醒
    addUnread() {
      let bloggerInfo = this.$store.state.bloggerInfo;
      return new Promise(resolve => {
        this.$axios
          .get("/getUserInfoById", { params: { id: bloggerInfo._id } })
          .then(res => {
            let unread = res.data.result.fans;
            resolve(unread);
          });
      });
    },
    //点击发布确定按钮
    addThumbnail() {
      this.addUnread().then(unread => {
        let userInfo = this.$store.state.bloggerInfo;
        let obj = {
          status: 1,
          titel: this.blogTitel,
          content: this.handbook,
          authorId: userInfo.username,
          author_id: userInfo._id,
          unread
        };
        if (this.$route.params.articalId == "draft") {
          this.publishArtical(obj);
          this.$axios.post("/deleteArtical", { id: this.$store.state.draftId });
        } else {
          this.publishArtical(obj);
        }
      });
    },
    //每次添加图片触发上传
    $imgAdd(pos, $file) {
      var formdata = new FormData();
      formdata.append("file", $file);
      formdata.append("legend", true);
      this.$axios({
        url: "/uploads",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(res => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        // $vm.$img2Url 详情见本页末尾
        let newPath = "http://127.0.0.1:3000/uploads" + res.data.url;
        this.$refs.md.$img2Url(pos, newPath);
      });
    },
    editArtical() {
      Dialog.confirm({
        message: "确定修改完成？"
      })
        .then(() => {
          if (this.$route.params.articalId == "draft") {
            let obj = {
              id: this.$store.state.draftId,
              titel: this.blogTitel,
              content: this.handbook
            };
            this.$axios.post("/editArtical", obj).then(res => {
              Toast.success(res.data.message);
              this.show = false;
              this.$router.push({ name: "Draft" });
            });
          } else {
            let obj = {
              id: this.$route.params.articalId,
              titel: this.blogTitel,
              content: this.handbook
            };
            this.$axios.post("/editArtical", obj).then(res => {
              Toast.success(res.data.message);
              this.show = false;
              this.$router.push({ name: "Myblog" });
            });
          }
        })
        .catch(() => {
          return;
        });
    }
  },
  mounted() {
    if (this.$route.params.articalId == "new") {
      console.log("new");
    } else if (this.$route.params.articalId == "draft") {
      this.newBtn = true;
      this.$axios.get("/getDraft").then(res => {
        let draftArr = res.data.docs;
        draftArr.forEach(e => {
          if (e._id == this.$store.state.draftId) {
            this.blogTitel = e.titel;
            this.handbook = e.content;
          }
        });
      });
    } else {
      let articals = JSON.parse(localStorage.getItem("artical"));
      articals.forEach(e => {
        if (e._id == this.$route.params.articalId) {
          this.blogTitel = e.titel;
          this.handbook = e.content;
          this.newBtn = true;
          this.editBtn = true;
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.edit {
  background: rgb(250, 250, 250);
  //   min-height: 100vh;
}
.editWrap {
  min-height: 100vh;
  padding-top: 90px;
  text-align: left;
  input {
    width: 86%;
    display: inline-block;
  }
  .btn {
    border: 1px solid #ced4da;
    margin-left: 10px;
  }
  .hidden {
    display: none;
  }
  .van-popup {
    width: 300px;
    border-radius: 0.25rem;
    .card {
      text-align: center;
    }
    p {
      font-size: 12px;
      color: $q-gray;
    }
    .btn {
      margin-left: 0;
      margin: 0 5px;
    }
  }
}
.v-note-wrapper {
  height: 75vh;
  z-index: 0;
}
@media screen and (max-width: 480px) {
  .v-note-wrapper {
    height: 85vh;
  }
  .editWrap {
    input {
      width: 58%;
    }
    .btn {
      margin-left: 5px;
    }
  }
}
</style>