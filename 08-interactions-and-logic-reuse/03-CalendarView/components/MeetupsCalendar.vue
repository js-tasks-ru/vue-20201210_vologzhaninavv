<template>
  <calendar-view>
    <!-- Каждый митап - ссылка на страницу митапа -->
    <!-- Используя слот требуется вывести список митапов дня в каждой ячейке -->
    <!--
    -->
    <template v-slot="{ year, month, date }">
      <template v-if="meetupsByDate[year] && meetupsByDate[year][month]">
        <router-link
          v-for="meetup in meetupsByDate[year][month][date]"
          :key="meetup.id"
          :to="{ name: 'meetup', params: { meetupId: meetup.id } }"
          class="rangepicker__event"
          >
          {{ meetup.title }}</router-link
        >
      </template>
    </template>
  </calendar-view>
</template>

<script>
import CalendarView from './CalendarView';

export default {
  name: 'MeetupsCalendar',

  props: {
    meetups: {
      type: Array,
      required: true,
    },
  },

  components: {
    CalendarView,
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

<style scoped>
.rangepicker__event {
  --maxLines: 2;
  --lineHeight: 16px;
  --fontSize: 14px;

  display: block;

  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: var(--fontSize);
  line-height: var(--lineHeight);
  font-weight: 600;
  color: var(--white);
  padding: 4px 6px;
  border-radius: 2px;
  background-color: var(--blue);
  text-decoration: none;
  margin-top: 4px;
}

@media all and (min-width: 767px) {
  .rangepicker__event {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: calc(var(--maxLines) * var(--lineHeight) + 6px);
  }
}
</style>
