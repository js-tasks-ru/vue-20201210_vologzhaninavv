<script>
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

export default {
  name: 'RenderlessCalendar',

  props: {
    startDate: {
      type: Date,
      default: new Date()
    }
  },

  // В качестве локального состояния требуется хранить что-то,
  // что позволит определить текущий показывающийся месяц.
  // По умолчанию должен показываться текущий месяц
  data() {
    return {
      // за изначальное состояния взята дата? переданная в props
      currentDate: this.startDate,
    };
  },

  // Вычислимые свойства помогут как с получением списка дней, так и с выводом информации
  computed: {
    // просматриваемый год
    currentYear() {
      return this.currentDate.getFullYear();
    },
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
        days.push({
          id: `${month}_${i}`,
          month: month,
          day: i,
          active: month === this.currentMonth
        });
      }

      return days;
    }
  },

  render(h) {
    return h(
      'div',
      [
        this.$scopedSlots.default({
          currentYear: this.currentYear,
          localDate: this.localDate,
          days: this.days,
          changeCurrentMonth: this.changeCurrentMonth
        })
      ]
    )
  },
};
</script>
