<template>
  <div id="app">
    <router-view :key="key" v-if="isRouterAlive" />
  </div>
</template>
<script>
export default {
  name:'app',
  provide(){
    return{
      reload:this.reload
    }
  },
  data() {
    return {
      isRouterAlive:true
    }
  },
  computed:{
    key(){
      return this.$route.path + Math.random();
    }
  },
  methods: {
    reload(){
      this.isRouterAlive = false
      this.$nextTick(()=>{
        this.isRouterAlive = true
      })
    }
  },
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
