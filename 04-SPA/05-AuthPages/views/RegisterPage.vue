<template>
  <form class="form" @submit.prevent="register">

    <div
      v-for="field in fields"
      :key="field.id"
      class="form-group"
    >
      <div
        v-if="field.type === 'checkbox'"
        class="form-group"
      >
        <label class="checkbox">
          <input
            type="checkbox"
            :name="field.name"
            v-model="field.value"
          /> {{ field.label }} <span></span>
        </label>
      </div>

      <div v-else>
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
    </div>

    <div class="form__buttons">
      <button type="submit" class="button button_primary">Зарегистрироваться</button>
    </div>

    <div class="form__append">Уже есть аккаунт?
      <router-link
        :to="{name: 'login'}"
        class="link"
      >Войдите</router-link>
    </div>

  </form>
</template>

<script>
import { register } from '../data';

export default {
  name: 'RegisterPage',

  data() {
    return  {
      fields: {
        email: {
          id: 1,
          label: 'Email',
          type: 'email',
          name: 'email',
          placeholder: '',
          value: null,
          validate: [
            {
              rule: 'required',
              message: 'Требуется ввести Email'
            }
          ]
        },
        name: {
          id: 2,
          label: 'Имя',
          type: 'text',
          autocomplete: 'off',
          name: 'name',
          placeholder: '',
          value: null,
          validate: [
            {
              rule: 'required',
              message: 'Требуется ввести полное имя'
            }
          ]
        },
        password: {
          id: 3,
          label: 'Пароль',
          type: 'password',
          autocomplete: 'off',
          name: 'password',
          placeholder: '',
          value: null,
          validate: [
            {
              rule: 'required',
              message: 'Требуется ввести пароль'
            }
          ]
        },
        passwordConfirm: {
          id: 4,
          label: 'Повтор пароля',
          type: 'password',
          autocomplete: 'off',
          name: 'passwordConfirm',
          placeholder: '',
          value: null,
          validate: [
            {
              rule: 'passwordConfirm',
              message: 'Пароли не совпадают',
              params: {
                nameConfirmField: 'password',
              }
            }
          ]
        },
        agree: {
          id: 5,
          label: 'Я согласен с условиями',
          type: 'checkbox',
          name: 'agree',
          value: null,
          validate: [
            {
              rule: 'required',
              message: 'Требуется согласиться с условиями'
            }
          ]
        }
      },
      invalidFields: []
    };
  },

  methods: {
    async register() {
      // получить массив неправильно заполненных полей
      this.invalidFields = this.getInvalidFields();

      // если есть поля, непрошедшие валидацию, то показать ошибку
      if (this.invalidFields.length) {
        this.showInvalidMessage();
      } else {
        // получить результат запроса
        let result = await register(this.fields.email.value, this.fields.name.value, this.fields.password.value);

        // при ошибке показать сообщение
        if (result.error) {
          alert(result.message);
        // иначе вывести bl пользователя
        } else if (result.id) {
          alert(result.id);
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
    },
    // проверка на совпадение полей
    checkPasswordConfirmField(field) {
      console.log(field);
      if (!field.validate) {
        return true;
      }

      const currentValidate = field.validate.find(validate => validate.rule === 'passwordConfirm');
      if (!currentValidate || !currentValidate.params || !currentValidate.params.nameConfirmField) {
        return true;
      }

      const confirmField = this.fields[currentValidate.params.nameConfirmField];
      if (confirmField && confirmField.value !== field.value) {
        return false;
      }

      return true;
    }
  }
};
</script>

<style scoped></style>
