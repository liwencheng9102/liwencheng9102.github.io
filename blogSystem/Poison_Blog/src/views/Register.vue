<template>
  <div class="register">
    <Toplink></Toplink>
    <div class="wrap">
      <b-card>
        <van-uploader
          v-model="fileList"
          :max-count="1"
          :after-read="afterRead"
          multiple
        />
        <p>请上传您的头像。</p>
        <van-form @submit="onSubmit">
          <van-field
            v-model="username"
            name="username"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
            v-model="confirm"
            type="password"
            name="confirm"
            label="确认密码"
            placeholder="请确认您的密码"
            :rules="[{ required: true, message: '请确认您的密码' }]"
          />
          <div style="margin: 16px;">
            <van-button
              round
              block
              type="info"
              native-type="submit"
              :style="{'background':'rgb(127,199,230)','border-color':'rgb(127,199,230)'}"
            >注册</van-button>
          </div>
        </van-form>
      </b-card>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { LayoutPlugin, CardPlugin } from "bootstrap-vue";
Vue.use(LayoutPlugin);
Vue.use(CardPlugin);
import { Form, Uploader, Button, Field, Toast } from "vant";
Vue.use(Form);
Vue.use(Uploader);
Vue.use(Button);
Vue.use(Field);
Vue.use(Toast);

import Toplink from "../components/Toplink";

export default {
  name: "Register",
  components: {
    Toplink
  },
  data() {
    return {
      username: "",
      password: "",
      confirm: "",
      fileList: [],
      file: {}
    };
  },
  methods: {
    onSubmit(values) {
      // console.log("submit", values); //{username: "aaa", password: "aaa", confirm: "aaa"}
      if (this.fileList.length == 1) {
        this.$axios.post("/register", values).then(res => {
          if (res.data.code == 200) {
            //上传图片
            var data = new FormData();
            // 将需要添加的参数添加进表单中
            data.append("file", this.file); //获取需要上传的文件
            data.append("username",this.username)//方便查找数据库对应的用户添加图片数据
            // console.log(data);
            let headers = {
              headers: { "Content-Type": "multipart/form-data" }
            }; //设置上传文件格式，为指定传输数据为二进制类型
            this.$axios.post("/uploads", data, headers).then(res => {
              console.log(res);
            });
            // console.log(res.data.message,res.data.result);
            Toast.success(res.data.message);
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 100) {
            this.username = "";
            this.password = "";
            this.confirm = "";
            Toast.fail(res.data.message);
          } else if (res.data.code == 102) {
            this.username = "";
            this.password = "";
            this.confirm = "";
            Toast.fail(res.data.message);
          } else if (res.data.code == 300) {
            this.username = "";
            this.password = "";
            this.confirm = "";
            Toast.fail(res.data.message);
          }
        });
      } else {
        Toast.fail("请上传您的头像！");
      }
    },
    afterRead(file) {
      this.file = file.file;
      // console.log(this.file);
    }
  }
};
</script>

<style lang='scss' scoped>
.register {
  width: 100%;
  height: 100vh;
  background: url("../assets/imgs/blueSky.jpg") no-repeat center center;
  background-size: cover;
}
.wrap {
  max-width: 440px;
  padding: 150px 40px 0 40px;
  margin: 0 auto;
  p {
    font-size: 14px;
    color: $q-gray;
  }
}
</style>