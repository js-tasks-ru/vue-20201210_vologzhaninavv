<template>
  <div class="rangepicker">
    <div class="rangepicker__calendar">
      <div class="rangepicker__month-indicator">
        <div class="rangepicker__selector-controls">
          <button
            class="rangepicker__selector-control-left"
            @click="setPreviousMonth"
          ></button>
          <div>{{ localCurrentMonthAndYear }}</div>
          <button
            class="rangepicker__selector-control-right"
            @click="setNextMonth"
          ></button>
        </div>
      </div>
      <div class="rangepicker__date-grid">
        <div
          v-for="cell in calendarCells"
          :key="cell.timestamp"
          class="rangepicker__cell"
          :class="{ rangepicker__cell_inactive: !cell.isCurrentMonth }"
        >
          {{ cell.date }}
          <slot name="cell" v-bind="cell" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/** Короткий псевдоним для создания Date (клонирования, преобразования) */
const mkDate = (date) => new Date(date);
/** Сбрасывает время в дате до 00:00:00.000 по UTC, оставляя только дату */
const resetTime = (date) =>
  new Date(date.toISOString().replace(/T.*$/, 'T00:00:00.000Z'));
/** Получение дня недели числом от 1 (ПН) до 7 (ВС) из даты {Date} */
const getWeekday = (date) => date.getUTCDay() || 7;
/** Увеличение и уменьшение даты на определённое число дней или месяцев */
const addDays = (date, days) =>
  mkDate(date.getTime() + 1000 * 60 * 60 * 24 * days);
const addMonth = (date, n) =>
  mkDate(mkDate(date).setUTCMonth(date.getUTCMonth() + n));
/** Получение первой даты месяца */
const getFirstDateOfMonth = (date) => mkDate(mkDate(date).setUTCDate(1));

export default {
  name: 'CalendarView',

  data() {
    return {
      currentDate: resetTime(new Date()),
    };
  },

  computed: {
    firstDateOfCurrentMonth() {
      return getFirstDateOfMonth(this.currentDate);
    },

    calendarCells() {
      const firstDateOfNextMonth = getFirstDateOfMonth(
        addMonth(this.currentDate, 1),
      );
      const lastDateOfMonth = addDays(firstDateOfNextMonth, -1);
      const startDate = addDays(
        this.firstDateOfCurrentMonth,
        -(getWeekday(this.firstDateOfCurrentMonth) - 1),
      );
      const finishDate = addDays(
        lastDateOfMonth,
        7 - getWeekday(lastDateOfMonth),
      );
      const cells = [];

      for (
        let dayOfCalendar = startDate;
        dayOfCalendar <= finishDate;
        dayOfCalendar = addDays(dayOfCalendar, 1)
      ) {
        cells.push({
          Date: dayOfCalendar,
          timestamp: +dayOfCalendar,
          year: dayOfCalendar.getUTCFullYear(),
          month: dayOfCalendar.getUTCMonth(),
          date: dayOfCalendar.getUTCDate(),
          isCurrentMonth:
            dayOfCalendar.getUTCMonth() === this.currentDate.getUTCMonth(),
        });
      }

      return cells;
    },

    localCurrentMonthAndYear() {
      return `${new Date(
        this.currentDate.getTime() +
          this.currentDate.getTimezoneOffset() * 60 * 1000,
      ).toLocaleDateString(navigator.language, {
        month: 'long',
      })} ${this.currentDate.getUTCFullYear()}`;
    },
  },

  methods: {
    setPreviousMonth() {
      this.currentDate = addMonth(this.firstDateOfCurrentMonth, -1);
    },

    setNextMonth() {
      this.currentDate = addMonth(this.firstDateOfCurrentMonth, 1);
    },
  },
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
