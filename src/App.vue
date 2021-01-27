<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import router from "@/router/router";

export default {
  router: router,
  name: 'App',

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
