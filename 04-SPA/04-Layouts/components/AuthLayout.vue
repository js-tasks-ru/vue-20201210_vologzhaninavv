<template>
  <div class="page page_onboarding">
    <div class="container">
      <h1 class="page__title text-center">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',

  props: {
    title: {
      type: String
    }
  }
};
</script>

<style scoped>
.page.page_onboarding {
    max-width: 374px;
    width: 100%;
    margin: 0 auto;
}

@media all and (max-width: 992px) {
    .container {
        padding: 0 16px;
    }
}
</style>
