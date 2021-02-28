<template>
  <div id="page">
    <div>Это я и моя хомпага</div>
    <router-link :to="`/room/123456789`"> /room/123456789 </router-link>
    <router-link :to="`/room/131313131`">
      /room/несуществующая комната
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped></style>
