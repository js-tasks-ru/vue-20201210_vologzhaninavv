export const MeetupInfo = {
  template: `<ul v-if="organizer || place || date" class="info-list">
      <li v-if="organizer">
        <img class="icon info-list__icon" alt="icon" src="/assets/icons/icon-user.svg" />
        {{ organizer }}
      </li>
      <li v-if="place">
        <img class="icon info-list__icon" alt="icon" src="/assets/icons/icon-map.svg" />
        {{ place }}
      </li>
      <li v-if="date">
        <img class="icon info-list__icon" alt="icon" src="/assets/icons/icon-cal-lg.svg" />
        <time :datetime="dateOnlyString">{{ localDate }}</time>
      </li>
    </ul>`,

  // props
  props: {
    organizer: {
      type: String,
      required: true
    },
    place: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },

  // computed
  computed: {
    // дата для вывода на страницу
    localDate() {
      return this.date.toLocaleString(navigator.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    // дата для вывода в datetime
    dateOnlyString() {
      const YYYY = this.date.getUTCFullYear();
      const MM = (this.date.getUTCMonth() + 1).toString().padStart(2, '0');
      const DD = this.date.getUTCDate().toString().padStart(2, '0');
      return `${YYYY}-${MM}-${DD}`;
    }
  }
};
