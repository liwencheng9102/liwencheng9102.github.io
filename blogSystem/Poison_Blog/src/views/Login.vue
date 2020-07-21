<template>
  <div class="login">
    <Toplink></Toplink>
    <div class="wrap">
      <b-card>
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
          <p class="leftP">忘记密码</p>
          <p class="rightP" @click="$router.push('/register')">新用户注册</p>
          <div style="margin: 16px;">
            <van-button
              round
              block
              type="info"
              native-type="submit"
              :style="{'background':'rgb(127,199,230)','border-color':'rgb(127,199,230)'}"
            >登录</van-button>
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
import { Form, Button, Field, Toast } from "vant";
Vue.use(Form);
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
      password: ""
    };
  },
  methods: {
    onSubmit(values) {
      // console.log("submit", values);
      this.$axios.post("/login", values).then(res => {
        if (res.data.code == 200) {
          Toast.success(res.data.message);
          this.$store.commit('changeLoginStatus',true)
          this.$store.commit('receive_userInfo',res.data.docs)
          this.$router.push({ name: "Home" });
          //将用户信息存入本地
          // localStorage.setItem('userInfo', JSON.stringify(res.data.docs));
          // localStorage.setItem('isLogin',true)
        } else {
          this.username = "";
          this.password = "";
          Toast.fail(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.login {
  width: 100%;
  height: 100vh;
  background: url("../assets/imgs/blueSky.jpg") no-repeat center center;
  background-size: cover;
}
.wrap {
  max-width: 440px;
  padding: 200px 40px 0 40px;
  margin: 0 auto;
  p{
    font-size: 10px;
    cursor: pointer;
  }
  .leftP{
    float: left;
    padding-left: 16px;
  }
  .rightP{
    float: right;
  }
}
</style>