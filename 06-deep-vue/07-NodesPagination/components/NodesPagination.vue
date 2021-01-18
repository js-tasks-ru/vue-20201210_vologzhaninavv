<script>
export default {
  name: 'NodesPagination',

  props: {
    page: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 10
    }
  },

  render: function (createElement) {
    const start = (this.page - 1) * this.perPage;
    const end = this.perPage;
    let elementsPerPage = [];

    if (this.$slots.default) {
      elementsPerPage = [...this.$slots.default];
      elementsPerPage = elementsPerPage.splice(start, end);
    }

    return createElement(
      'div',
      elementsPerPage
    )
  }
};
</script>

<style scoped></style>
