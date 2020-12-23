export const MeetupCover = {
  template: `<div :style="meetupCoverStyle" class="meetup-cover">
        <h1 class="meetup-cover__title">{{ title }}</h1>
    </div>`,

  // props
  props: {
    link: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    }
  },

  computed: {
    // Стили для обложки митапа
    meetupCoverStyle() {
      if (!this.link) {
        return {};
      }

      return {
        '--bg-url': `url(${this.link})`
      };
    }
  }
};
