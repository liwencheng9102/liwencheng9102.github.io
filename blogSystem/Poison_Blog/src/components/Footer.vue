<template>
  <div class="footer">
    <b-card>
      <div>
        <p>@Poison_Missing 个人博客系统 开发不易,一分也是爱！</p>
      </div>
    </b-card>
  </div>
</template>
<script>
import Vue from "vue";

import { CardPlugin } from "bootstrap-vue";
Vue.use(CardPlugin);
export default {
  name: "Footer"
};
</script>

<style lang='scss' scoped>

.footer {
  text-align: center;
  .card{
      margin-top: 5px;
  }
  p {
      display: inline-block;
      padding: 20px 0 20px 0;
    color: $footer;
    font-size: 14px;
    margin: 0;
  }
}
</style>