<template>
  <div id="app">
    <div class="progress" style="width: 100%; background-color: rgb(76, 107, 182); opacity: 0;"></div>

    <div class="wrapper bg-grey">
      <the-header />

      <main class="main">
        <slot />
      </main>

      <the-footer />
    </div>

  </div>
</template>

<script>
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';

export default {
  name: 'BaseLayout',

  components: {
    TheHeader,
    TheFooter
  }
};
</script>

<style scoped>
main {
  flex: 1 0 auto;
}
</style>
