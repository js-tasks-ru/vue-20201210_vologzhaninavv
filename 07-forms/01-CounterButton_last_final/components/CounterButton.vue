<template>
  <button type="button" @click="increment">{{ localCount }}</button>
</template>

<script>
export default {
  name: 'CounterButton',

  model: {
    prop: 'count',
    event: 'increment'
  },

  props: {
    count: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      localCount: this.count
    };
  },

  watch: {
    count() {
      this.localCount = this.count;
    }
  },

  methods: {
    increment() {
      this.$emit('increment', ++this.localCount);
    }
  }
};
</script>

<style>

</style>
