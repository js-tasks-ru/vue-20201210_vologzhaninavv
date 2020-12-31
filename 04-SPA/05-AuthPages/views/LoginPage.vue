<template>
  <form class="form" @submit.prevent="login">
    <div
      v-for="field in fields"
      :key="field.id"
      class="form-group"
    >
      <label class="form-label">{{ field.label }}</label>
      <div class="input-group">
        <input
          :type="field.type"
          :name="field.name"
          :placeholder="field.placeholder"
          :autocomplete="field.autocomplete || 'off'"
          v-model="field.value"
          class="form-control" />
      </div>
    </div>

    <div class="form__buttons">
      <button type="submit" class="button button_primary button_block">Войти</button>
    </div>

    <div class="form__append">Нет аккаунта?
      <router-link
        :to="{name: 'register'}"
        class="link"
      >Зарегистрируйтесь</router-link>
    </div>
  </form>
</template>

<script>
import { login } from '../data';

export default {
  name: 'LoginPage',

  data() {
    return {
      fields: {
        email: {
          id: 1,
          label: 'Email',
          type: 'email',
          name: 'email',
          placeholder: 'demo@email',
          value: null,
          validate: [
            {
              rule: 'required',
              message: 'Требуется ввести Email'
            }
          ]
        },
        password: {
          id: 2,
          label: 'Пароль',
          type: 'password',
          autocomplete: 'off',
          name: 'password',
          placeholder: 'password',
          value: null,
          validate: [
            {
              rule: 'required',
              message: 'Требуется ввести пароль'
            }
          ]
        }
      },
      invalidFields: []
    };
  },

  methods: {
    async login() {
      // получить массив неправильно заполненных полей
      this.invalidFields = this.getInvalidFields();

      // если есть поля, непрошедшие валидацию, то показать ошибку
      if (this.invalidFields.length) {
        this.showInvalidMessage();
      } else {
        // получить результат запроса
        let result = await login(this.fields.email.value, this.fields.password.value);

        // при ошибке показать сообщение
        if (result.error) {
          alert(result.message);
        // иначе вывести полное имя
        } else if (result.fullname) {
          alert(result.fullname);
        }
      }
    },
    // получить невалидные поля
    getInvalidFields() {
      let invalidFields = [];

      // проход по всем полям формы
      for (let [key, field] of Object.entries(this.fields)) {
        // если не указаны правила валидации для поля, то пропустим его
        if (!field.validate || !field.validate.length) {
          continue;
        }

        // проход по всем правилам валидации
        field.validate.forEach((validate) => {
          let nameValidate = validate.rule;
          nameValidate = nameValidate[0].toUpperCase() + nameValidate.substring(1);

          // если не нашелся обработчик такого правила, то идем дальше
          if (!this[`check${nameValidate}Field`]) {
            return;
          }

          // проверка поля по указанному правилу
          if (!this[`check${nameValidate}Field`](field)) {
            invalidFields.push({
              name: field.name,
              message: validate.message || `Неправильно заполнено поле ${field.label}`
            });
          }
        });
      }

      return invalidFields;
    },
    // показать сообщение об ошибке заполнения формы, если есть
    showInvalidMessage() {
      if (!this.invalidFields.length) {
        return;
      }

      alert(this.invalidFields.shift().message);
    },
    // проверка на обязательно заполненное поле
    checkRequiredField(field) {
      return !!field.value;
    }
  }
};
</script>

<style scoped></style>
