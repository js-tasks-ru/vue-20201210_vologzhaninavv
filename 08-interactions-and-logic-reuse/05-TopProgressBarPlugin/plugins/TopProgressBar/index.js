import Vue from 'vue';

export default {
  start() {
    Vue.prototype.$progress.start();
  },
  finish() {
    Vue.prototype.$progress.finish();
  },
  fail() {
    Vue.prototype.$progress.fail();
  }
};
