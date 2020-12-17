import Vue from './vue.esm.browser.js';

/** URL адрес API */
const API_URL = 'https://course-vue.javascript.ru/api';

/** ID митапа для примера; используйте его при получении митапа */
const MEETUP_ID = 6;

/**
 * Возвращает ссылку на изображение митапа для митапа
 * @param meetup - объект с описанием митапа (и параметром meetupId)
 * @return {string} - ссылка на изображение митапа
 */
function getMeetupCoverLink(meetup) {
  return `${API_URL}/images/${meetup.imageId}`;
}

/**
 * Возвращает дату в формате datetime
 * @param date - дата в миллисекундах
 * @return {string} - дата в формате datetime
 */
function getDateOnlyString(date) {
  const YYYY = date.getUTCFullYear();
  const MM = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const DD = date.getUTCDate().toString().padStart(2, '0');
  return `${YYYY}-${MM}-${DD}`;
}

/**
 * Словарь заголовков по умолчанию для всех типов элементов программы
 */
const agendaItemTitles = {
  registration: 'Регистрация',
  opening: 'Открытие',
  break: 'Перерыв',
  coffee: 'Coffee Break',
  closing: 'Закрытие',
  afterparty: 'Afterparty',
  talk: 'Доклад',
  other: 'Другое',
};

/**
 * Словарь иконок для для всех типов элементов программы.
 * Соответствует имени иконок в директории /assets/icons
 */
const agendaItemIcons = {
  registration: 'key',
  opening: 'cal-sm',
  talk: 'tv',
  break: 'clock',
  coffee: 'coffee',
  closing: 'key',
  afterparty: 'cal-sm',
  other: 'cal-sm',
};

export const app = new Vue({
  el: '#app',

  data: {
    meetup: null
  },

  mounted() {
    // Получение данные митапа
    this.getMeetup();
  },

  computed: {
    // Данные программы митапа, готовые к выводу
    agenda() {
      if (!this.meetup || !this.meetup.agenda || !this.meetup.agenda.length) {
        return;
      }

      return this.meetup.agenda.map((agendaItem) => ({
        ...agendaItem,
        icon: agendaItemIcons[agendaItem.type] || agendaItemIcons['other'],
        title: agendaItem.title || agendaItemTitles[agendaItem.type]
      }));
    },
    // Стили для обложки митапа
    meetupCoverStyle() {
      if (!this.meetup || !this.meetup.imageId) {
        return {};
      }

      return {
        '--bg-url': `url(${getMeetupCoverLink(this.meetup)})`
      };
    }
  },

  methods: {
    // Получение данных с API
    fetchMeetup() {
      return fetch(`${API_URL}/meetups/${MEETUP_ID}`).then((res) => res.json());
    },
    // Получение данных митапа, готовых для вывода на страницу
    async getMeetup() {
      let meetup = await this.fetchMeetup();

      this.meetup = {
        ...meetup,
        localDate: new Date(meetup.date).toLocaleString(navigator.language, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        dateOnlyString: getDateOnlyString(new Date(meetup.date))
      };
    }
  },
});
