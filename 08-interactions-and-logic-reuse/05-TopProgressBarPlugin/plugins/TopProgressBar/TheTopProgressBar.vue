<template>
  <div class="progress" :class="classesProgress" :style="{'width': width}"></div>
</template>

<script>
export default {
  name: 'TheTopProgressBar',

  data() {
    return {
      status: null,
      classesProgress: {
        show: false,
        failed: false,
      },
      width: 0
    };
  },

  methods: {
    start() {
      if (this.status === 'start') {
        return;
      }

      this.status = 'start';
      this.classesProgress.failed = false;
      this.classesProgress.show = true;
      this.changeWidth();
    },

    finish() {
      if (!this.status) {
        return;
      }

      this.classesProgress.show = false;
      this.status = null;
    },

    fail() {
      if (this.status === 'fail') {
        return;
      }

      this.classesProgress.failed = true;
      this.status = 'fail';
    },

    changeWidth() {
      this.animate({
        duration: 2000,
        timing: (timeFraction) => {
          if (this.status === 'fail' || !this.status) {
            return 1;
          }

          return Math.sin(Math.acos(1 - timeFraction));
        },
        draw: (progress) => {
          this.width = progress * 100 + '%';

          if (progress === 1) {
            this.finish();
          }
        }
      });
    },

    animate({duration, draw, timing}) {
      let start = performance.now();

      requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;

        if (timeFraction < 0) {
          timeFraction = 0;
        }

        if (timeFraction > 1) {
          timeFraction = 1;
        }

        const progress = timing(timeFraction);
        draw(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      });
    }
  }
};
</script>

<style scoped>
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  width: 0;
  opacity: 0;
  background-color: var(--blue);
  transition: opacity 0.2s linear 0.2s;
  z-index: 999999;
}

.progress.show {
  opacity: 1;
  transition: none;
}

.progress.failed {
  background-color: #db3851;
}
</style>
