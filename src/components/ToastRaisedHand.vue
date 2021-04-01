<template>
  <div class="t-container">
    <span class='pb-2'>{{ userFullName }} поднял руку!</span>
    <button class="action" @click.stop="clicked">Дать право рисовать</button>
  </div>
</template>
<script>
export default {
  props: {
    userFullName: {
      type: String,
      required: true,
      default: ""
    }
  },
  methods: {
    clicked() {
      this.$emit("click");
    }
  }
};
</script>
<style>
.t-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  flex-direction: column;
}
.action {
  height: 40px;
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  border: thin solid currentColor;
}
</style>
