/*
  Возможности для кнопки:
  1) Первый вариант в спискее для сброса выбранного значения
  2) Возможность сделать вариант выпадающего списка неактивным
  3) Возиожность сделать саму кнопку неактивной
  4) Вынести button в отдельный компонент, чтобы не было дублирования
 */

<template>
  <div class="dropdown" :class="{ show: show }">
    <button
      type="button"
      class="button dropdown__toggle"
      :class="classes.button"
      @click="toggleDropdown"
    >
      <app-icon
        v-if="dataButton.icon"
        :icon="dataButton.icon"
      />
      {{ dataButton.title }}
    </button>

    <div class="dropdown__menu" :class="{ show: show }">
      <button
        v-for="option in options"
        :key="option.value"
        class="dropdown__item"
        :class="classes.item"
        type="button"
        :value="option.value"
        @click="change(option.value)"
      >
        <app-icon
          v-if="option.icon"
          :icon="option.icon"
        />
        {{ option.text }}
      </button>
    </div>
  </div>
</template>

<script>
import AppIcon from './AppIcon';

export default {
  name: 'DropdownButton',

  components: { AppIcon },

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    title: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: String
    }
  },

  data() {
    return {
      // состояние выпадающего списка
      show: false,
      classes: {
        button: {},
        item: {}
      }
    };
  },

  computed: {
    // данные кнопки для вывода
    dataButton() {
      let selectedOption = this.options.find((option) => option.value === this.value);

      if (selectedOption) {
        return {
          title: `${this.title} - ${selectedOption.text}`,
          icon: selectedOption.icon
        };
      }

      return {
        title: this.title,
        icon: null
      };
    }
  },

  created() {
    const withIcon = this.options.some((option) => option.icon);

    // вычисляемые классы для кнопки
    this.classes.button = {
      dropdown__toggle_icon: withIcon
    };

    // общие вычисляемые классы элементов выпад.списка
    this.classes.item = {
      dropdown__item_icon: withIcon
    };
  },

  methods: {
    // изменить значение компонента
    change(value) {
      this.toggleDropdown();
      this.$emit('change', value);
    },
    // сменить видимость выпадающего списка
    toggleDropdown() {
      this.show = !this.show;
    }
  }
};
</script>

<style scoped>
.button {
    display: inline-block;
    padding: 10px 24px;
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    color: initial;
    text-align: center;
    border: 4px solid transparent;
    transition: .2s all;
    outline: none;
    box-shadow: none;
    background-color: transparent;
    cursor: pointer;
    text-decoration: none;
}

.button.button_block {
   display: block;
    width: 100%;
}

.button.button_primary {
    background-color: var(--blue);
    border-color: var(--blue);
    color: var(--white);
}

.button.button_primary:hover {
    background-color: var(--blue-light);
    border-color: var(--blue-light);
    color: var(--blue);
}

.button.button_secondary {
    background-color: var(--white);
    border-color: var(--blue);
    color: var(--blue);
}

.button.button_secondary:hover {
    border-color: var(--blue-light);
}

.button.button_danger {
    background-color: var(--white);
    border-color: var(--red);
    color: var(--red);
}

.button.button_danger:hover {
    border-color: var(--red-light);
}

.dropdown {
    position: relative;
    display: inline-block;
}

.button.dropdown__toggle {
    border: 2px solid var(--blue-light);
    position: relative;
    background-color: var(--white);
    background-position: calc(100% - 10px) calc(100% - 10px);
    border-radius: 8px;
    padding-right: 56px;
    font-weight: 500;
}

.button.dropdown__toggle:after {
    content: '';
    position: absolute;
    top: 15px;
    right: 16px;
    transform: none;
    background: url('/assets/icons/icon-chevron-down.svg') no-repeat;
    background-size: cover;
    display: block;
    width: 24px;
    height: 24px;
    transition: .2s transform;
}

.button.dropdown__toggle.dropdown__toggle_icon {
    padding-left: 56px;
}

.dropdown__toggle_icon .icon {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translate(0, -50%);
}

.show > .button.dropdown__toggle {
    border-color: var(--blue);
    border-bottom-color: transparent;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.show > .button.dropdown__toggle:after {
    transform: rotate(180deg);
}

.dropdown__menu {
    margin: 0;
    width: 100%;
    padding: 0;
    border-radius: 0 0 8px 8px;
    left: 0;
    z-index: 95;
    background-clip: padding-box;
    display: none;
    flex-direction: column;
    border: 2px solid var(--blue);
    border-top: none;
    overflow: hidden;
}

.dropdown__menu.show {
    display: flex;
    position: absolute;
    transform: translate3d(0px, 52px, 0px);
    top: -1px;
    left: 0;
    will-change: transform;
    right: auto;
    bottom: auto;
}

.dropdown__item {
    padding: 8px 16px;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    background-color: var(--white);
    box-shadow: none;
    border: none;
    cursor: pointer;
    text-align: left;
}

.dropdown__item:hover,
.dropdown__item:focus {
    background-color: var(--grey-light);
}

.dropdown__item.dropdown__item_icon {
    padding-left: 56px;
    position: relative;
}

.dropdown__item.dropdown__item_icon > .icon {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translate(0, -50%);
}
</style>
