/*
  Полезные функции по работе с датой можно описать вне Vue компонента
 */

 /**
  * Возвращает новую дату
  * @param currentDate - дата (Date) для изменения
  * @param date - новый день месяца
  * @param month - новый месяц
  * @return {Date} - новая дата
  */
function setDate(currentDate, date, month) {
  let newDate = new Date(currentDate);

  if (month !== undefined) {
    return new Date(newDate.setMonth(month, date));
  }

  return new Date(newDate.setDate(date));
}

export const MeetupsCalendar = {
  name: 'MeetupsCalendar',

  template: `<div class="rangepicker">
    <div class="rangepicker__calendar">
      <div class="rangepicker__month-indicator">
        <div class="rangepicker__selector-controls">
          <button @click="changeCurrentMonth(-1)" class="rangepicker__selector-control-left"></button>
          <div>{{ localDate }}</div>
          <button @click="changeCurrentMonth(1)" class="rangepicker__selector-control-right"></button>
        </div>
      </div>

      <div class="rangepicker__date-grid">
        <div v-for="day in days" :key="day.id" :class="{'rangepicker__cell': true, 'rangepicker__cell_inactive': !day.active}">
          {{ day.day }}

          <template v-if="day.meetups.length">
            <a v-for="meetup in day.meetups" :key="meetup.id" class="rangepicker__event">{{ meetup.title }}</a>
          </template>
        </div>
      </div>

    </div>
  </div>`,

  // Пропсы
  props: {
    meetups: {
      type: Array,
      required: true
    }
  },

  // В качестве локального состояния требуется хранить что-то,
  // что позволит определить текущий показывающийся месяц.
  // Изначально должен показываться текущий месяц
  data() {
    return {
      // за изначальное состояния взята текущая дата
      currentDate: new Date(),
    };
  },

  // Вычислимые свойства помогут как с получением списка дней, так и с выводом информации
  computed: {
    // просматриваемый месяц
    currentMonth() {
      return this.currentDate.getMonth();
    },
    // день недели первого дня текущего месяца
    firstDayOfCurrentMonth() {
      let date = setDate(this.currentDate, 1);
      return date.getDay() || 7;
    },
    // день недели последнего дня текущего месяца
    lastDayOfCurrentMonth() {
      let date = setDate(this.currentDate, 0, this.currentMonth + 1);
      return date.getDay() || 7;
    },
    // дни предыдущего месяца
    daysPrevMonth() {
      const endDay = setDate(this.currentDate, 0).getDate();
      const startDay = endDay - (this.firstDayOfCurrentMonth - 1) + 1;
      return this.getDatesOfMonth(startDay, endDay, this.currentMonth - 1);
    },
    // дни текущего месяца
    daysCurrentMonth() {
      const lastDayOfMonth = setDate(this.currentDate, 0, this.currentMonth + 1).getDate();
      return this.getDatesOfMonth(1, lastDayOfMonth, this.currentMonth);
    },
    // дни следующего месяца
    daysNextMonth() {
      return this.getDatesOfMonth(1, 7 - this.lastDayOfCurrentMonth, this.currentMonth + 1);
    },
    // все дни для вывода календаря
    days() {
      return [...this.daysPrevMonth, ...this.daysCurrentMonth, ...this.daysNextMonth];
    },
    // дата для вывода на страницу
    localDate() {
      return this.currentDate.toLocaleString(navigator.language, {
        month: 'long',
        year: 'numeric',
      })
    },
    // объект с митапами для вывода по датам
    meetupsByDate() {
      let meetupsByDate = {};

      // перебор всех митапов для распределения по месяцам и датам
      this.meetups.forEach((meetup, i) => {
        let meetupFullDate = new Date(meetup.date);
        let meetupMonth = meetupFullDate.getMonth();
        let meetupYear = meetupFullDate.getFullYear();
        let meetupDate = meetupFullDate.getDate();

        if (!meetupsByDate[`${meetupYear}${meetupMonth}`]) {
          meetupsByDate[`${meetupYear}${meetupMonth}`] = {};
        }

        if (!meetupsByDate[`${meetupYear}${meetupMonth}`][meetupDate]) {
          meetupsByDate[`${meetupYear}${meetupMonth}`][meetupDate] = [];
        }

        meetupsByDate[`${meetupYear}${meetupMonth}`][meetupDate].push({
          id: meetup.id,
          title: meetup.title
        });
      });

      return meetupsByDate;
    }
  },

  // Методы понадобятся для переключения между месяцами
  methods: {
    // изменить текущий месяц
    changeCurrentMonth(diffMonth) {
      this.currentDate = setDate(this.currentDate, 1, this.currentMonth + diffMonth);
    },
    // получить массив дат для вывода
    getDatesOfMonth(startDate, endDate, month) {
      let days = [];

      for (let i = startDate; i <= endDate; i++) {
        let meetupsByDate = this.meetupsByDate[`${this.currentDate.getFullYear()}${this.currentMonth}`] || [];

        days.push({
          id: `${month}_${i}`,
          day: i,
          active: month === this.currentMonth,
          meetups: meetupsByDate[i] || []
        });
      }

      return days;
    }
  }
};
