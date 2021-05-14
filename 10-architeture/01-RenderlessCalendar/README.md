# RenderlessCalendar

Реализация `RenderlessCalendar` практически идентична прошлой реализации календаря. В слот можно передать массив с данными, необходимыми для рендеринга календаря. Если компонент реализуется без входного параметра, требуется также передавать методы для переключения месяца и текущий месяц.

```javascript
/** Короткий псевдоним для создания Date (клонирования, преобразования) */
const mkDate = (date) => new Date(date);
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
  name: 'RenderlessCalendar',

  props: {
    date: {
      type: String,
      default: () => new Date().toISOString().substr(0, 7), // YYYY-MM
      validate: (value) => /^\d{4}-(0[1-9]|1[0-2])\$/.test(value),
    },
  },

  data() {
    return {
      currentDate: null,
    };
  },

  watch: {
    date: {
      immediate: true,
      handler() {
        const [year, month] = this.date.split('-').map((s) => parseInt(s, 10));
        this.currentDate = new Date(Date.UTC(year, month - 1));
      },
    },
  },

  computed: {
    calendarCells() {
      const firstDateOfNextMonth = getFirstDateOfMonth(
        addMonth(this.currentDate, 1),
      );
      const lastDateOfMonth = addDays(firstDateOfNextMonth, -1);
      const startDate = addDays(
        this.currentDate,
        -(getWeekday(this.currentDate) - 1),
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
  },

  methods: {
    setPreviousMonth() {
      this.currentDate = addMonth(this.currentDate, -1);
      this.emitUpdateDate();
    },

    setNextMonth() {
      this.currentDate = addMonth(this.currentDate, 1);
      this.emitUpdateDate();
    },

    emitUpdateDate() {
      this.$emit('update:date', this.currentDate.toISOString().substr(0, 7));
    },
  },

  render(h) {
    const content = this.$scopedSlots.default({
      setPreviousMonth: this.setPreviousMonth,
      setNextMonth: this.setNextMonth,
      calendarCells: this.calendarCells,
    });
    return Array.isArray(content) && content.length > 1
      ? h('div', content)
      : content;
  },
};
```

Реализация шаблона при наличии решения предыдущей задачи на календарь не составит особой сложности.

```html
<template>
  <renderless-calendar
    class="rangepicker"
    :date.sync="localDate"
    v-slot="{ setPreviousMonth, setNextMonth, calendarCells }"
  >
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
  </renderless-calendar>
</template>
```
