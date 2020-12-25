import { MeetupCover } from './MeetupCover.js';
import { MeetupDescription } from './MeetupDescription.js';
import { MeetupAgenda } from './MeetupAgenda.js';
import { MeetupInfo } from './MeetupInfo.js';
import { getMeetupCoverLink } from './data.js';

export const MeetupView = {
  name: 'MeetupView',

  template: `
    <div>
      <meetup-cover :link="coverLink" :title="meetup.title" />

      <div class="container">
        <div class="meetup">
          <div class="meetup__content">
            <template v-if="meetup.description">
              <h3>Описание</h3>
              <meetup-description :description="meetup.description" />
            </template>

            <template v-if="meetup.agenda && meetup.agenda.length">
              <h3>Программа</h3>
              <meetup-agenda :agenda="meetup.agenda" />
            </template>
          </div>

          <div class="meetup__aside">
            <meetup-info :organizer="meetup.organizer" :place="meetup.place" :date="date" />
          </div>
        </div>
      </div>
    </div>`,

  // components
  components: {
    MeetupCover,
    MeetupDescription,
    MeetupAgenda,
    MeetupInfo,
  },

  // props
  props: {
    meetup: {
      type: Object,
      required: true
    }
  },

  computed: {
    // ссылка на изображение
    coverLink() {
      if (!this.meetup || !this.meetup.imageId) {
        return '';
      }

      return getMeetupCoverLink(this.meetup);
    },
    date() {
      // дата проведения митапа в формате Date
      return new Date(this.meetup.date);
    }
  }
};
