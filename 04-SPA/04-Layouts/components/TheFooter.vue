<template>
  <footer class="footer">
    <div class="container">
      &copy; {{ yearCopyright }}. learn.javascript.ru <a href="https://learn.javascript.ru/courses/vue" target="_blank">Vue.js Course</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',

  data() {
    return {
      yearCopyright: new Date().getFullYear()
    };
  }
};
</script>

<style scoped>
.footer {
  padding: 100px 0 60px;
  text-align: center;
}
</style>
