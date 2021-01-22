<template>
  <form class="form meetup-form" @submit.prevent="submit">
    <div class="meetup-form__content">
      <fieldset class="form-section">
        <div class="form-group">
          <label class="form-label">Название</label>
          <input class="form-control" v-model="localMeetup.title" />
        </div>
        <div class="form-group">
          <label class="form-label">Дата</label>
          <input class="form-control" type="date" v-model="meetupDateFormat" />
        </div>
        <div class="form-group">
          <label class="form-label">Место</label>
          <input class="form-control" v-model="localMeetup.place" />
        </div>
        <div class="form-group">
          <label class="form-label">Описание</label>
          <textarea class="form-control" rows="3" v-model="localMeetup.description"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Изображение</label>
          <image-uploader v-model="localMeetup.imageId" />
        </div>
      </fieldset>

      <h3 class="form__section-title">Программа</h3>
      <meetup-agenda-item-form
        v-for="(agendaItem, index) in localMeetup.agenda"
        :key="agendaItem.id"
        :agendaItem.sync="localMeetup.agenda[index]"
        @remove="removeAgendaItem(agendaItem.id)"
        class="mb-3"
      />

      <div class="form-section_append">
        <button type="button" data-test="addAgendaItem" @click="addAgendaItem">
          + Добавить этап программы
        </button>
      </div>
    </div>

    <div class="meetup-form__aside">
      <div class="meetup-form__aside_stick">
        <button
          class="button button_secondary button_block"
          type="button"
          data-test="cancel"
          @click="cancel"
        >
          Отмена
        </button>
        <button
          class="button button_primary button_block"
          type="submit"
          data-test="submit"
        >
          {{ submitText }}
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import MeetupAgendaItemForm from './MeetupAgendaItemForm.vue';
import ImageUploader from './ImageUploader';

function buildAgendaItem() {
  return {
    id: Math.random(),
    startsAt: '00:00',
    endsAt: '00:00',
    type: 'other',
    title: null,
    description: null,
    speaker: null,
    language: null,
  };
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export default {
  name: 'MeetupForm',

  props: {
    meetup: {
      type: Object,
      required: true
    },
    submitText: {
      type: String,
      default: 'Submit'
    }
  },

  data() {
    return {
      localMeetup: deepClone(this.meetup)
    };
  },

  computed: {
    meetupDateFormat: {
      get() {
        return this.getDateFormat(this.localMeetup.date);
      },
      set(date) {
        this.localMeetup.date = date;
      }
    }
  },

  components: {
    ImageUploader,
    MeetupAgendaItemForm,
  },

  methods: {
    cancel() {
      this.$emit('cancel');
    },
    submit() {
      this.$emit('submit', deepClone(this.localMeetup));
    },
    addAgendaItem() {
      let newAgendaItem = buildAgendaItem();

      if (this.localMeetup.agenda.length > 0) {
        newAgendaItem.startsAt = this.localMeetup.agenda[this.localMeetup.agenda.length - 1].endsAt;
      }

      this.localMeetup.agenda = [...this.localMeetup.agenda, newAgendaItem];
    },
    removeAgendaItem(id) {
      const index = this.localMeetup.agenda.findIndex(agendaItem => agendaItem.id === id);
      this.localMeetup.agenda.splice(index, 1);
    },
    getDateFormat(value) {
      const date = new Date(value) || new Date();
      const YYYY =  date.getUTCFullYear();
      const MM = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const DD = date.getUTCDate().toString().padStart(2, '0');

      return `${YYYY}-${MM}-${DD}`;
    }
  }
};
</script>

<style scoped>
.meetup-form__aside {
  margin: 48px 0;
}

.meetup-form__aside_stick > .button {
  margin: 0 0 12px 0;
}

@media all and (min-width: 992px) {
  .meetup-form {
    display: flex;
    flex-direction: row;
  }

  .meetup-form__content {
    flex: 1 0 calc(100% - 320px);
  }

  .meetup-form__aside {
    flex: 1 0 320px;
    max-width: 320px;
    width: 100%;
    padding-left: 137px;
    margin: 0;
  }

  .meetup-form__aside_stick {
    position: sticky;
    top: 32px;
  }
}
</style>
