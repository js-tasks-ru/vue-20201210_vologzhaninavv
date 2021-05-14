<template>
  <div class="rangepicker">
    <div class="rangepicker__calendar">
      <div class="rangepicker__month-indicator">
        <div class="rangepicker__selector-controls">
          <button
            @click="changeCurrentMonth(-1)"
            class="rangepicker__selector-control-left"
          ></button>
          <div>{{ localDate }}</div>
          <button
            @click="changeCurrentMonth(1)"
            class="rangepicker__selector-control-right"
          ></button>
        </div>
      </div>

      <div class="rangepicker__date-grid">
        <div
          v-for="day in days"
          :key="day.id"
          :class="{
            rangepicker__cell: true,
            rangepicker__cell_inactive: !day.active
          }"
        >
          {{ day.day }}
          <slot :year="currentYear" :month="day.month" :date="day.day"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

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
  name: 'CalendarView',

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
  }
};
</script>

<style scoped>
.rangepicker {
  position: relative;
  margin: 32px 0 0;
}

.rangepicker__selector {
  display: flex;
  background-color: var(--white);
  flex-direction: row;
  justify-content: space-between;
  flex: 1 0 100%;
}

.rangepicker__calendar {
  flex-grow: 1;
}

.rangepicker__month-indicator {
  text-align: center;
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  color: var(--blue);
  background-color: var(--blue-extra);
  padding: 24px;
  display: flex;
  justify-content: center;
}

.rangepicker__selector-controls {
  max-width: 325px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-transform: capitalize;
}
.rangepicker__selector-controls button {
  border: none;
  padding: 0;
}

.rangepicker__selector-control-left,
.rangepicker__selector-control-right {
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s all;
  background: url('../assets/icons/icon-pill-active.svg') left center no-repeat;
  background-size: cover;
}

.rangepicker__selector-control-left:hover,
.rangepicker__selector-control-right:hover {
  opacity: 0.8;
}

.rangepicker__selector-control-right {
  transform: rotate(180deg);
}

.rangepicker__date-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

/* Dates */
.rangepicker__date-grid {
  border: 1px solid var(--grey);
  border-bottom: none;
}

.rangepicker__cell {
  position: relative;
  height: auto;
  padding: 6px 8px;
  background-color: var(--white);
  color: var(--grey-8);
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border-bottom: 1px solid var(--grey);
  border-left: 1px solid var(--grey);
  text-align: right;
}

.rangepicker__cell.rangepicker__cell_inactive {
  background-color: var(--grey-light);
}

@media all and (max-width: 767px) {
  .rangepicker__cell:nth-child(5n + 1) {
    border-left: none;
  }
}

@media all and (min-width: 767px) {
  .rangepicker__date-grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .rangepicker__cell {
    height: 144px;
  }

  .rangepicker__cell:nth-child(7n + 1) {
    border-left: none;
  }
}
</style>
