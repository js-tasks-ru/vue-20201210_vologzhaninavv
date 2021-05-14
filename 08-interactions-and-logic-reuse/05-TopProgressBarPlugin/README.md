# TopProgressBarPlugin

## Компонент

Работа компонента сводится к хранению текущего состояния и плавного изменения состояния.

```html
<template>
  <div
    class="progress"
    :class="{
      show,
      failed,
    }"
    :style="{
      width: currentProgress + '%',
    }"
  ></div>
</template>

<script>
// Воспользуемся Tweenjs для плавного изменения состояния
import { Tween, Easing, update } from './vendor/tween.esm';

// Сохраним константы
const START_DELAY = 500;
const MAX_PROGRESS = 95;
const MAX_DURATION = 30000;
const FINISH_DURATION = 200;

export default {
  name: 'TheTopProgressBar',

  data() {
    return {
      // Текущий прогресс
      currentProgress: 0,
      // Отображается ли прогресс в текущий момент
      show: false,
      // Успешный ли прогресс
      failed: false,

      // id для requestAnimationFrame
      requestAnimationFrameId: null,
      // id для задержки запуска
      startDelayTimeoutId: null,
    };
  },

  mounted() {
    // Когда компонент смонтирован, запускаем анимацию обновления
    this.requestAnimationFrameId = requestAnimationFrame(this.update);
  },

  methods: {
    // Функция обновления использует update из Tween.js
    update(time = 0) {
      this.requestAnimationFrameId = requestAnimationFrame(this.update);
      update(time);
    },

    start() {
      // Если прогресс уже запущен, игнорируем повторный запуск
      if (this.tweenProgress || this.startDelayTimeoutId !== null) {
        return;
      }

      // Сбрасываемся до начального состояния
      this.currentProgress = 0;
      this.failed = false;
      this.show = true;

      // Добавляем задержку запуска
      this.startDelayTimeoutId = setTimeout(() => {
        this.startDelayTimeoutId = null;

        // Запускаем плавное изменение состояния
        this.tweenProgress = this.createCurrentProgressTween(
          0,
          MAX_PROGRESS,
          MAX_DURATION,
          Easing.Exponential.Out,
        )
          .onComplete(() => {
            this.tweenProgress = null;
          })
          .onStop(() => {
            this.tweenProgress = null;
          })
          .start();
      }, START_DELAY);
    },

    // Вспомогательный метод запуска плавного изменения
    createCurrentProgressTween(from, to, duration, easing) {
      return new Tween({ value: from })
        .to({ value: to }, duration)
        .easing(easing)
        .onUpdate(({ value }) => {
          this.currentProgress = value;
        });
    },

    // Вспомогательная функция остановки прогресса
    stop() {
      // Если завершение уже в процессе - игнорируем
      if (this.tweenFinish) {
        return;
      }

      // Останавливаем прогресс загрузки
      if (this.tweenProgress) {
        this.tweenProgress.stop();
      }

      // Запускаем быстрый прогресс завершения
      this.tweenFinish = this.createCurrentProgressTween(
        this.currentProgress,
        100,
        FINISH_DURATION,
        Easing.Linear.None,
      )
        .onComplete(() => {
          this.show = 0;
          this.tweenFinish = null;
        })
        .onStop(() => {
          this.show = 0;
          this.tweenFinish = null;
        })
        .start();
    },

    finish() {
      // Если прогресс в задержке перед запуском - отменяем
      if (this.startDelayTimeoutId !== null) {
        clearTimeout(this.startDelayTimeoutId);
        this.startDelayTimeoutId = null;
      }

      // Если в процесс загрузки - останавливаем
      if (this.tweenProgress) {
        this.stop();
      }
    },

    fail() {
      this.failed = true;
      this.stop();
    },
  },

  // Хотя для одноразового компонента, который всегда существует, утечка памяти не опасна,
  // лучше всегда очищать ресурсы при уничтожении
  beforeDestroy() {
    cancelAnimationFrame(this.update);
    if (this.startDelayTimeoutId !== null) {
      clearTimeout(this.startDelayTimeoutId);
    }
  },
};
</script>
```

## TopProgressBar

Сделаем простой объект для хранения экземпляра прогресс бара и методов доступа к нему.

```javascript
export default {
  instance: null,

  start() {
    this.instance && this.instance.start();
  },

  finish() {
    this.instance && this.instance.finish();
  },

  fail() {
    this.instance && this.instance.fail();
  },
};
```

## Плагин

```javascript
import TopProgressBar from './index';
import TheTopProgressBar from './TheTopProgressBar';

export const TopProgressBarPlugin = {
  /**
   * @param {VueConstructor} Vue
   * @param {Object} options
   * @param {VueRouter} [options.router]
   */
  install(Vue, { router } = {}) {
    // Если экземпляр ещё не создан - создаём
    if (!TopProgressBar.instance) {
      // Подготовим контейнер
      const container = document.body.appendChild(
        document.createElement('div'),
      );
      // Создаём и монтируем экземпляр
      TopProgressBar.instance = new Vue(TheTopProgressBar).$mount(container);
    }

    // Интегрируем в роутер
    if (router) {
      // Перед переходом запускаем прогресс
      router.beforeEach((to, from, next) => {
        TopProgressBar.start();
        next();
      });
      // После перехода останавливаем прогресс
      router.afterEach(() => {
        TopProgressBar.finish();
      });
      // В случае ошибки завершаем прогресс с ошибкой
      router.onError((err) => {
        TopProgressBar.fail();
        // Пробрасываем дальше
        throw err;
      });
    }
    
    // Добавляем ссылку в прототип и глобальные свойства Vue 
    Vue.$progress = TopProgressBar;
    Vue.prototype.$progress = TopProgressBar;
  },
};
```
