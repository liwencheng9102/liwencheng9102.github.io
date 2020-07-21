<template>
  <div class="profile">
    <table class="information">
      <tr>
        <td class="top-line">
          <img :src="avatar" alt="avatar" />
        </td>
        <td class="top-line">
          <a class="btn">
            <input class="hide" type="file" unselectable="on" @change="uploadPhoto" ref="inputer" />更改头像
          </a>
        </td>
      </tr>
      <tr>
        <td class="setting-title">绑定邮箱</td>
        <td>
          <input type="text" v-model="email" placeholder="请输入邮箱" />
        </td>
      </tr>
      <tr>
        <td class="setting-title">修改密码</td>
        <td>
          <input type="password" v-model="password" placeholder="原密码" />
          <input type="password" v-model="newPassword" placeholder="新密码" />
          <span class="button" @click="changePassword">确认修改</span>
        </td>
      </tr>
      <tr>
        <td class="setting-title pull-left">个人简介</td>
        <td>
          <textarea v-model="description" placeholder="填写你的个人简介"></textarea>
        </td>
      </tr>
    </table>
    <span class="saveAll" @click="clickSaveBtn">保存</span>
  </div>
</template>
<script>
import Vue from "vue";
import { Dialog, Toast } from "vant";
Vue.use(Dialog);
Vue.use(Toast);
export default {
  inject: ["reload"],
  name: "Profile",
  data() {
    return {
      email: "",
      password: "",
      newPassword: "",
      avatar: "",
      description: ""
    };
  },
  methods: {
    getApiUserInfo() {
      let userInfo = this.$store.state.bloggerInfo
      this.$axios
        .get("/getUserInfoById", { params: { id: userInfo._id } })
        .then(res => {
          //  console.log('userInfo',res.data.result)
          // localStorage.setItem("userInfo", JSON.stringify(res.data.result));
          this.$store.commit('receive_userInfo',res.data.result)
          this.reload();
        });
    },

    uploadPhoto() {
      let userInfo = this.$store.state.bloggerInfo
      let file = this.$refs.inputer.files[0];
      var data = new FormData();
      // 将需要添加的参数添加进表单中
      data.append("file", file); //获取需要上传的文件
      data.append("username", userInfo.username);
      let headers = {
        headers: { "Content-Type": "multipart/form-data" }
      }; //设置上传文件格式，为指定传输数据为二进制类型
      this.$axios.post("/uploads", data, headers).then(res => {
        if (res.data.code == 200) {
          this.getApiUserInfo();
          Toast.success("头像修改成功！");
        }
      });
    },
    changePassword() {
      let userInfo = this.$store.state.bloggerInfo
      if (this.password && this.newPassword) {
        if (this.password == userInfo.password) {
          if (this.password != this.newPassword) {
            this.getApiUserInfo();
            Toast.success("密码修改成功");
          } else {
            Toast.fail("新密码和原密码一致");
          }
        } else {
          Toast.fail("原密码错误");
        }
      } else {
        Toast.fail("请输入");
      }
    },
    clickSaveBtn() {
      let userInfo = this.$store.state.bloggerInfo
      if (this.email && this.email != userInfo.email) {
        this.$axios
          .post("/changeUserInfo", {
            id: userInfo._id,
            userEmail: this.email
          })
          .then(res => {
            if (res.data.code == 200) {
              this.getApiUserInfo();
              Toast.success("保存成功");
            }
          });
      }
      if (this.description && this.description != userInfo.description) {
        this.$axios
          .post("/changeUserInfo", {
            id: userInfo._id,
            description: this.description
          })
          .then(res => {
            if (res.data.code == 200) {
              this.getApiUserInfo();
              Toast.success("保存成功");
            }
          });
      }
    }
  },
  mounted() {
    let userInfo = this.$store.state.bloggerInfo
    this.avatar = "http://127.0.0.1:3000/uploads" + userInfo.avatar;
    this.email = userInfo.userEmail;
    this.description = userInfo.description;
  }
};
</script>

<style lang='scss' scoped>
.information {
  width: 100%;
  background-color: transparent;
  border-collapse: collapse;
  border-spacing: 0;
  tr:first-child {
    border: none;
  }
  tr {
    border-bottom: 1px solid #f0f0f0;
    td {
      padding: 20px 0;
    }
    .setting-title {
      font-size: 15px;
      color: #969696;
      padding-left: 15px;
    }
    .pull-left {
      float: left;
    }
    input {
      padding: 5px 10px;
      margin: 5px 10px 5px 0;
      font-size: 15px;
      border: 1px solid #c8c8c8;
      border-radius: 4px;
      background-color: hsla(0, 0%, 71%, 0.1);
    }
    textarea {
      width: 80%;
      height: 100px;
      padding: 8px 10px;
      font-size: 15px;
      border: 1px solid #c8c8c8;
      border-radius: 4px;
      background-color: hsla(0, 0%, 71%, 0.1);
      display: block;
      resize: none;
      outline-style: none;
    }
    .button {
      width: 80px;
      display: inline-block;
      text-align: center;
      border-radius: 20px;
      border: none;
      margin-top: 5px;
      cursor: pointer;
      color: #fff;
      background-color: #42c02e;
      padding: 6px 12px;
      font-size: 14px;
      line-height: 1.42857;
    }
  }
  .top-line {
    .btn {
      margin-left: 10px;
    }
    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border: 1px solid #ddd;
      border-radius: 50%;
      cursor: pointer;
    }
    a {
      font-size: 14px;
      border: 1px solid rgba(59, 194, 29, 0.7);
      color: #42c02e;
      padding: 4px 12px;
      font-weight: 400;
      line-height: normal;
      border-radius: 40px;
      background: none;
      display: inline-block;
      margin-bottom: 0;
      text-align: center;
    }
    .hide {
      cursor: pointer;
      position: absolute;
      width: 82px;
      opacity: 0;
    }
  }
}
.saveAll {
  width: 100px;
  margin: 30px 20px 30px;
  display: inline-block;
  text-align: center;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  color: #fff;
  background-color: #42c02e;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857;
}
</style>