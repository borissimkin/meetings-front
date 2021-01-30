<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import router from "@/router/router";
import store from "@/store/store";

export default {
  router: router,
  store: store,
  name: 'App',

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  background-color: #222222;

  min-height: 100%;
  /*margin-top: 60px;*/
}
html,
body {
  height: 100%;
}
</style>
