<template>
  <calendar-view :date.sync="date">
    <template #cell="{ timestamp }">
      <calendar-view-event
        v-for="meetup in meetupsByDate[timestamp]"
        :key="meetup.id"
        tag="router-link"
        :to="{ name: 'meetup', params: { meetupId: meetup.id } }"
        >{{ meetup.title }}</calendar-view-event
      >
    </template>
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

  data() {
    return {
      currentDate: new Date(),
    };
  },

  computed: {
    date: {
      get() {
        return this.currentDate.toISOString().substr(0, 7);
      },
      set(value) {
        const [year, month] = value.split('-').map((s) => parseInt(s, 10));
        this.currentDate = new Date(Date.UTC(year, month - 1));
      },
    },

    meetupsByDate() {
      const result = {};
      for (const meetup of this.meetups) {
        if (!result[meetup.date]) {
          result[meetup.date] = [meetup];
        } else {
          result[meetup.date].push(meetup);
        }
      }
      return result;
    },
  },
};
</script>

<style></style>
