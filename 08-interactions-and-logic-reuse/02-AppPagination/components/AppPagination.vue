<template>
  <div>
    <slot v-for="item in itemsPerPage" :item="item">
      {{ item }}
    </slot>
  </div>
</template>

<script>
export default {
  name: 'AppPagination',

  props: {
    page: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 10
    },
    items: {
      type: Array
    }
  },

  computed: {
    itemsPerPage() {
      const start = (this.page - 1) * this.perPage;
      const end = this.perPage;

      if (!this.items || !this.items.length) {
        return [];
      }

      let elementsPerPage = [...this.items];
      elementsPerPage = elementsPerPage.splice(start, end);

      return elementsPerPage;
    }
  }
};
</script>

<style></style>
