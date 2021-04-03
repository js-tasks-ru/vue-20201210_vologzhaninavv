<template>
  <calendar-view :startDate="startDate">
    <template v-slot="{ year, month, date }">
      <template v-if="meetupsByDate[year] && meetupsByDate[year][month]">
        <calendar-view-event
          v-for="meetup in meetupsByDate[year][month][date]"
          :key="meetup.id"
          tag="router-link"
          :to="{ name: 'meetup', params: { meetupId: meetup.id } }"
          >{{ meetup.title }}</calendar-view-event
        >
      </template>
    </template>
  </calendar-view>
</template>

<script>
import CalendarView from './CalendarView';
import CalendarViewEvent from './CalendarViewEvent';

export default {
  name: 'MeetupsCalendar',

  components: {
    CalendarViewEvent,
    CalendarView,
  },

  props: {
    meetups: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      // за изначальное состояния взята текущая дата
      startDate: new Date(),
    };
  },

  computed: {
    // объект с митапами для вывода по датам
    meetupsByDate() {
      let meetupsByDate = {};

      // перебор всех митапов для распределения по месяцам и датам
      this.meetups.forEach((meetup, i) => {
        let meetupFullDate = new Date(meetup.date);
        let meetupMonth = meetupFullDate.getMonth();
        let meetupYear = meetupFullDate.getFullYear();
        let meetupDate = meetupFullDate.getDate();

        if (!meetupsByDate[meetupYear]) {
          meetupsByDate[meetupYear] = {};
        }

        if (!meetupsByDate[meetupYear][meetupMonth]) {
          meetupsByDate[meetupYear][meetupMonth] = {};
        }

        if (!meetupsByDate[meetupYear][meetupMonth][meetupDate]) {
          meetupsByDate[meetupYear][meetupMonth][meetupDate] = [];
        }

        meetupsByDate[meetupYear][meetupMonth][meetupDate].push({
          id: meetup.id,
          title: meetup.title
        });
      });

      return meetupsByDate;
    }
  }
};
</script>

<style></style>
