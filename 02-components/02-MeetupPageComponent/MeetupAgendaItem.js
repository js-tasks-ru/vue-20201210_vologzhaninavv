import { agendaItemTitles, agendaItemIcons } from './data.js'

export const MeetupAgendaItem = {
  name: 'MeetupAgendaItem',

  template: `<div v-if="agendaItem" class="meetup-agenda__item">
      <div class="meetup-agenda__item-col">
        <img class="icon" alt="icon" :src="icon" />
      </div>
      <div class="meetup-agenda__item-col">{{ agendaItem.startsAt }} - {{ agendaItem.endsAt }}</div>
      <div class="meetup-agenda__item-col">
        <h5 class="meetup-agenda__title">{{ title }}</h5>
        <p v-if="agendaItem.type === 'talk'">
          <template v-if="agendaItem.speaker">
            <span v-if="agendaItem.speaker">{{ agendaItem.speaker }}</span>
            <span class="meetup-agenda__dot"></span>
          </template>
          <span v-if="agendaItem.language" class="meetup-agenda__lang">{{ agendaItem.language }}</span>
        </p>
        <p v-if="agendaItem.description">{{ agendaItem.description }}</p>
      </div>
    </div>`,

  props: {
    agendaItem: {
      type: Object,
      required: true
    }
  },

  computed: {
    // заголовок для вывода на страницу
    title() {
      return this.agendaItem.title || agendaItemTitles[this.agendaItem.type];
    },
    // путь к иконке
    icon() {
      const iconName = agendaItemIcons[this.agendaItem.type] || agendaItemIcons['other'];
      return `/assets/icons/icon-${iconName}.svg`;
    }
  }
};
