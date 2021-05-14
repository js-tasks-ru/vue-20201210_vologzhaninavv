<template>
  <meetups-calendar v-if="meetups" :meetups="meetups" />
</template>

<script>
import MeetupsCalendar from '../components/MeetupsCalendar';

export default {
  name: 'MeetupsPage',
  components: { MeetupsCalendar },

  data() {
    return {
      meetups: null,
    };
  },

  async mounted() {
    this.meetups = await fetch(`https://course-vue.javascript.ru/api/meetups`).then((res) => res.json());
  },
};
</script>

<style scoped>

</style>
