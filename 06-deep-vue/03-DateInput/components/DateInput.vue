<template>
  <AppInput
    v-bind="$attrs"
    v-on="listeners"
    @input.native="inputNative"
    :type="type"
    :value="valueInput"
  >
    <!-- Так можно передать все слоты в дочерний компонент -->
    <template v-for="slot of Object.keys($slots)" v-slot:[slot]>
      <slot :name="slot" />
    </template>
  </AppInput>
</template>

<script>
import AppInput from './AppInput';

export default {
  name: 'DateInput',

  components: { AppInput },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    type: {
      type: String,
      default: 'date',
      validator(value) {
        return ['date', 'time', 'datetime', 'datetime-local'].indexOf(value) >= 0;
      }
    },
    valueAsNumber: {
      type: Number
    },
    valueAsDate: {
      type: Date
    },
    value: {
      type: String
    },
  },

  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: ($event) => {
          this.$emit('input', $event);
        },
      };
    },
    date() {
      if (!(this.valueAsDate || this.valueAsNumber)) {
        return null;
      }

      // если указан входной параметр this.valueAsNumber, то вернем дату из него
      if (this.valueAsNumber) {
        return this.getDate(this.valueAsNumber);
      }

      // если указан входной параметр this.valueAsDate, то вернем дату из него
      if (this.valueAsDate) {
        return this.valueAsDate;
      }
    },
    valueInput() {
      if (!this.date) {
        return this.value;
      }

      if (this.type === 'time') {
        return this.getTimeFormat(this.date);
      }

      if (this.type === 'datetime' || this.type === 'datetime-local') {
        return this.getDateLocalFormat(this.date);
      }

      if (this.type === 'date') {
        return this.getDateFormat(this.date);
      }

      return this.getDateFormat(this.date);
    }
  },

  methods: {
    getDateFormat(date) {
      const YYYY = date.getUTCFullYear();
      const MM = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const DD = date.getUTCDate().toString().padStart(2, '0');

      return `${YYYY}-${MM}-${DD}`;
    },
    getTimeFormat(date, withSecond = false) {
      const hh = date.getUTCHours().toString().padStart(2, '0');
      const mm = date.getUTCMinutes().toString().padStart(2, '0');
      const ss = date.getUTCSeconds().toString().padStart(2, '0');

      if (withSecond || (this.$attrs.step && this.$attrs.step % 60 !== 0)) {
        return `${hh}:${mm}:${ss}`;
      }

      return `${hh}:${mm}`;
    },
    getDateLocalFormat(date) {
      const dateFormatted = this.getDateFormat(date);
      const timeFormatted = this.getTimeFormat(date);

      return `${dateFormatted}T${timeFormatted}`;
    },
    getDate(value) {
      return new Date(value);
    },
    inputNative($event) {
      let newValueAsNumber = $event.target.valueAsNumber;
      let newValueAsDate = new Date(newValueAsNumber);

      this.$emit('update:valueAsNumber', newValueAsNumber);
      this.$emit('update:valueAsDate', newValueAsDate);
    }
  }
};
</script>

<style scoped></style>
