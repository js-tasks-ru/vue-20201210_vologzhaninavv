# CalendarView

При уже разработанном календаре ранее требуется только определиться с параметром слота и вывести данные в ячейке.

Параметром слота может быть:
- Дата в формате `YYYY-MM-DD`;
- Экземпляр `Date` дня в полночь по UTC (00:00:00.000Z);
- Timestamp (число миллисекунд с 01.01.1970) дня в полночь по UTC;
- Объект со свойствами для года, месяца и дня `{ year, month, day }`;
- И др.

Какой именно формат выбрать — не очень важно, так как любой из них легко привести к нужному дню.

Наиболее универсальным решением было бы предоставить во множестве слотов разные форматы. Так пользователь компонента сможет выбрать наиболее удобный для него.

```html
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
```

Вторую сложность может создать вывод митапов в ячейках календаря. 
Если ранее список митапов каждого дня формировался в одном коде с формированием дней календаря, например, фильтром, то теперь это должны быть разные процессы.

Как и в прошлом решении, достаточно один раз построить объект, где ключ — день, а значение — список митапов в этот день.

```javascript
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
```

Остаётся воспользоваться решением этим объектом в каждой ячейке.

```html
<template>
  <calendar-view>
    <template #cell="{ timestamp }">
      <router-link
        v-for="meetup in meetupsByDate[timestamp]"
        :key="meetup.id"
        :to="{ name: 'meetup', params: { meetupId: meetup.id } }"
        class="rangepicker__event"
        >{{ meetup.title }}</router-link
      >
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
```
