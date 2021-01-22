<template>
  <div class="form-section form-section_inner">
    <button type="button" class="remove-button" @click="remove">
      <img src="../assets/icons/icon-trash.svg" alt="trash" />
    </button>

    <div class="form-group">
      <select class="form-control" title="Тип" v-model="localAgendaItem.type">
        <option v-for="type in types" :value="type.value">{{ type.text }}</option>
      </select>
    </div>

    <div class="form__row">
      <div class="form__col">
        <div class="form-group">
          <label class="form-label">Начало</label>
          <input class="form-control" type="time" placeholder="00:00" :value="localAgendaItem.startsAt" @input="changeTime($event.target.value, 'startsAt', 'endsAt')" />
        </div>
      </div>
      <div class="form__col">
        <div class="form-group">
          <label class="form-label">Окончание</label>
          <input class="form-control" type="time" placeholder="00:00" :value="localAgendaItem.endsAt" @input="localAgendaItem.endsAt = $event.target.value" />
        </div>
      </div>
    </div>

    <div
      v-for="field in fields"
      :key="field.id"
      class="form-group"
    >
      <label class="form-label">{{ field.label }}</label>
      <div class="input-group">
        <select
          v-if="field.type === 'select'"
          :name="field.name"
          :value="localAgendaItem[field.value]"
          @change="localAgendaItem[field.value] = $event.target.value"
          class="form-control">
          <option v-for="option in field.options" :value="option.value">{{ option.text }}</option>
        </select>

        <textarea
          v-else-if="field.type === 'textarea'"
          :name="field.name"
          :value="localAgendaItem[field.value]"
          @input="localAgendaItem[field.value] = $event.target.value"
          class="form-control">
        </textarea>

        <input
          v-else
          :type="field.type"
          :name="field.name"
          :value="localAgendaItem[field.value]"
          @input="localAgendaItem[field.value] = $event.target.value"
          class="form-control" />
      </div>
    </div>
  </div>
</template>

<script>
const getAgendaItemTypes = () => [
  { value: 'registration', text: 'Регистрация' },
  { value: 'opening', text: 'Открытие' },
  { value: 'break', text: 'Перерыв' },
  { value: 'coffee', text: 'Coffee Break' },
  { value: 'closing', text: 'Закрытие' },
  { value: 'afterparty', text: 'Afterparty' },
  { value: 'talk', text: 'Доклад' },
  { value: 'other', text: 'Другое' },
];

const getTalkLanguages = () => [
  { value: null, text: 'Не указано' },
  { value: 'RU', text: 'RU' },
  { value: 'EN', text: 'EN' },
];

/**
 *
 * @param {String} time - текущее время в формате HH:MM
 * @param {Number} deltaMinutes - время сдвига в минутах
 * @returns {String} сдвинутое на deltaMinutes время в формате HH:MM
 */
function shiftTime(time, deltaMinutes) {
  if (!/([0-1]\d|2[0-3]):[0-5]\d/.test(time)) {
    throw new Error('Time must be in HH:MM format');
  }

  const timeInMinutes = getTimeInMinutes(time);
  let newTimeInMinutes = (timeInMinutes + deltaMinutes) % (24 * 60);
  // если получилось отрицательное значение,
  // значит возьмем кол-во минут в пред.сутках
  if (newTimeInMinutes < 0) {
    newTimeInMinutes =  24 * 60 + newTimeInMinutes;
  }

  const hours = (newTimeInMinutes / 60).toFixed(0).padStart(2, '0');
  const minutes = Math.abs((newTimeInMinutes % 60)).toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 *
 * @param {String} time - текущее время в формате HH:MM
 * @returns {String} переданное в time время в минутах
 */
function getTimeInMinutes(time) {
  const [h, m] = time.split(':').map((x) => parseInt(x, 10));
  const timeInMinutes = h * 60 + m;

  return timeInMinutes;
}

export default {
  name: 'MeetupAgendaItemForm',

  props: {
    agendaItem: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      localAgendaItem: {...this.agendaItem}
    };
  },

  computed: {
    fields() {
      if (this.localAgendaItem.type === 'talk') {
        return {
          title: {
            id: 1,
            label: 'Тема',
            type: 'text',
            name: 'title',
            value: 'title'
          },
          speaker: {
            id: 2,
            label: 'Докладчик',
            type: 'text',
            name: 'speaker',
            value: 'speaker'
          },
          description: {
            id: 3,
            label: 'Описание',
            type: 'textarea',
            name: 'description',
            value: 'description'
          },
          language: {
            id: 4,
            label: 'Язык',
            type: 'select',
            name: 'language',
            value: 'language',
            options: getTalkLanguages()
          }
        };
      }

      if (this.localAgendaItem.type === 'other') {
        return {
          title: {
            id: 1,
            label: 'Заголовок',
            type: 'text',
            name: 'title',
            value: 'title'
          },
          description: {
            id: 3,
            label: 'Описание',
            type: 'textarea',
            name: 'description',
            value: 'description'
          }
        };
      }

      return {
        title: {
          id: 1,
          label: 'Нестандартный текст (необязательно)',
          type: 'text',
          name: 'title',
          value: 'title'
        }
      };
    },
    types() {
      return getAgendaItemTypes();
    }
  },

  watch: {
    localAgendaItem: {
      deep: true,
      handler(newValue) {
        this.$emit('update:agendaItem', newValue);
      }
    }
  },

  methods: {
    remove() {
      this.$emit('remove', this.localAgendaItem.id);
    },
    changeTime(newValue, field, fieldToChange) {
      const minutesStart = getTimeInMinutes(this.localAgendaItem.startsAt);
      const minutesEnd = getTimeInMinutes(this.localAgendaItem.endsAt);
      const delta = minutesEnd - minutesStart;

      this.localAgendaItem[field] = newValue;
      this.localAgendaItem[fieldToChange] = shiftTime(this.localAgendaItem[field], delta);
    }
  }
};
</script>

<style></style>
