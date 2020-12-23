import { MeetupAgendaItem } from './MeetupAgendaItem.js';

export const MeetupAgenda = {
  name: 'MeetupAgenda',

  template: `
    <div v-if="agenda && agenda.length" class="meetup-agenda">
      <meetup-agenda-item v-for="agendaItem in agenda" :key="agendaItem.id" :agendaItem="agendaItem" />
    </div>`,

  // components
  components: {
    MeetupAgendaItem,
  },

  // props
  props: {
    agenda: {
      type: Array,
      required: true
    }
  }
};
