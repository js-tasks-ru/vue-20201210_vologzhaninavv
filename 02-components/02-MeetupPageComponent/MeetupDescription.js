export const MeetupDescription = {
  template: `<p v-if="description" class="meetup-description">{{ description }}</p>`,

  // Пропсы
  props: {
    description: {
      type: String,
      required: false
    }
  }
};
