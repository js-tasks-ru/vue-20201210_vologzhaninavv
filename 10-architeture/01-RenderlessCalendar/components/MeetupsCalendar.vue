<template>
  <calendar-view>
    <!--
    <calendar-view-event
      tag="router-link"
      :to="{ name: 'meetup', params: { meetupId: meetup.id } }"
      >{{ meetup.title }}</calendar-view-event
    >
    -->
  </calendar-view>
</template>

<script>
import CalendarView from './CalendarView';
import CalendarViewEvent from './CalendarViewEvent';

export default {
  name: 'MeetupsCalendar',

  props: {
    meetups: {
      type: Array,
      required: true,
    },
  },

  components: {
    CalendarViewEvent,
    CalendarView,
  },
};
</script>

<style></style>
