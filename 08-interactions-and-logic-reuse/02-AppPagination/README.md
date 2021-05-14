# AppPagination

Решение задачи очень похоже на предыдущую задачу во Scoped Slot-ами, а также на предыдущую задачу с пагинацией.

Требуется вычислить данные текущей страницы и вывести их с помощью слота.



```html
<template>
  <div>
    <!-- В слот передаём один элемент с текущей страницы -->
    <slot v-for="item in pageItems" :item="item" />
  </div>
</template>

<script>
  export default {
  name: 'AppPagination',

  props: {
    page: Number,
    perPage: Number,
    items: {
      type: Array,
      required: true,
    },
  },
    
  computed: {
    pageItems() {
      // Вычисляемым свойством находим все элементы текущей страницы
      const start = (this.page - 1) * this.perPage;
      const end = this.page * this.perPage;
      return this.items.slice(start, end);
    },
  },
};
</script>
```  
