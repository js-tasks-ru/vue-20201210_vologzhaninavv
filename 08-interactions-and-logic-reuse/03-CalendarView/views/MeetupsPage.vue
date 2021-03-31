<template>
  <meetups-calendar v-if="meetups" :meetups="meetups" />
</template>

<script>
import MeetupsCalendar from '../components/MeetupsCalendar';
import { fetchMeetups } from '../data';

export default {
  name: 'MeetupsPage',
  components: { MeetupsCalendar },

  data() {
    return {
      meetups: null,
    };
  },

  async mounted() {
    this.meetups = await fetchMeetups();
  },
};
</script>

<style></style>
