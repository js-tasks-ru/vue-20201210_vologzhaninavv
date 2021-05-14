import TopProgressBar from './index';
import TheTopProgressBar from './TheTopProgressBar';

export default {
  install(Vue, options = {}) {
    let { router, container } = options;

    if (!container) {
      container = document.createElement('div');
      document.body.appendChild(container);
    }

    const topProgressBar = new Vue(TheTopProgressBar).$mount(container);

    if (router) {
      router.beforeEach((to, from, next) => {
        topProgressBar.start();
        next();
      });

      router.afterEach((to, from) => {
        topProgressBar.finish();
      });

      router.onError((err) => {
        topProgressBar.fail();
      });
    }

    Vue.prototype.$progress = topProgressBar;
  }
};
