<template>
  <div class="meetups-list">
    <div v-for="item in items">
      <slot :item="item">
        {{ item }}
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListView',

  props: ['items']
};
</script>

<style scoped>
.meetups-list {
}
</style>
