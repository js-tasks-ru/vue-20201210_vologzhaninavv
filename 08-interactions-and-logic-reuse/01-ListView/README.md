# ListView

Для вывода списка в `ListView` достаточно использовать обычный `v-for`.

Для того, чтобы пользователь компонента смог определить, как рендерится элемент списка, требуется передать этот элемент списка через параметры слота. Дополнительно можно передать индекс.

```html
<!-- ListView -->
<template>
  <div class="meetups-list">
    <slot v-for="(item, index) in items" :item="item" :index="index" />
  </div>
</template>

<script>
export default {
  name: 'ListView',

  props: {
    items: {
      type: Array,
      required: false,
    },
  },
};
</script>
```

При использовании соответственно требуется использовать элемент списка из слота.

```html
<!-- MeetupsList -->
<template>
  <list-view :items="meetupsWithCoverAndBadge" v-slot="{ item }">
    <list-view-card
      tag="router-link"
      :to="{ name: 'meetup', params: { meetupId: item.id } }"
      :key="item.id"
      :title="item.title"
      :cover="item.cover"
      :badge="item.badge"
      :badge-success="item.badgeSuccess"
    >
      <meetup-info
        :date="item.date"
        :place="item.place"
        :organizer="item.organizer"
      />
    </list-view-card>
  </list-view>
</template>
```
