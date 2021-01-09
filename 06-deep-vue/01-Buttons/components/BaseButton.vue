<template>
  <component
    :is="tag"
    v-bind="$attrs"
    v-on="$listeners"
    :class="{'button_block': block}"
    class="button"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'BaseButton',

  props: {
    block: {
      type: Boolean
    },
    tag: {
      type: String,
      default: 'button',
      validator(value) {
        // Значение должно соответствовать одной из этих строк
        return ['button', 'a', 'router-link'].indexOf(value) !== -1
      }
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
  transition: 0.2s all;
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
</style>
