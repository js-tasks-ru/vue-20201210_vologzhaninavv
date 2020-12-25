import { MeetupView } from './MeetupView.js';
import { MEETUP_ID, fetchMeetup } from './data.js';

export const MeetupPage = {
  name: 'MeetupPage',

  template: `<div v-if="meetup"><meetup-view :meetup="meetup" /></div>`,

  data: {
    meetup: null
  },

  components: {
    MeetupView,
  },

  mounted() {
    // Получение данных митапа
    this.getMeetup();
  },

  methods: {
    // Получение данных митапа
    async getMeetup() {
      this.meetup = await fetchMeetup(MEETUP_ID);
    }
  },
};
