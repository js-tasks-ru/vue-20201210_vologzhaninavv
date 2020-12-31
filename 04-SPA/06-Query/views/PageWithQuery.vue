<template>
  <div class="container">
    <meetups-view
      :view.sync="query.view"
      :date.sync="query.date"
      :participation.sync="query.participation"
      :search.sync="query.search"
    />
  </div>
</template>

<script>
import MeetupsView from '../components/MeetupsView';
import VueRouter from 'vue-router';
const { isNavigationFailure, NavigationFailureType } = VueRouter;

export default {
  name: 'PageWithQuery',

  components: { MeetupsView },

  data() {
    return {
      queryDefault: {
        view: 'list',
        date: 'all',
        participation: 'all',
        search: ''
      },
      query: this.queryDefault,
      replaceRoute: ['view']
    };
  },

  watch: {
    '$route': {
      immediate: true,
      handler(newValue, oldValue) {
        this.location = newValue;
      }
    },
    location: {
      handler(newRoute, oldRoute) {
        // если зашли с одинаковыми параметрами,
        // то не обновляем историю
        if (JSON.stringify(newRoute.query) === JSON.stringify(oldRoute.query)) {
          return;
        }

        // в новый путь добавляем только значения отличные от по умолчанию
        let location = Object.assign({}, newRoute);
        location.query = {};

        for (let key in this.query) {
          if (this.queryDefault[key] !== newRoute.query[key]) {
            location.query[key] = newRoute.query[key];
          }
        }

        // вариант добавления в историю
        // если все измененные параметры находятся в массиве replaceRoute,
        // то заменям в истории, а не добавляем
        // при изменении только view заменяем в истории,
        // т.к. это просто смена вида на странице, а не изменение фильтра
        let replace = this.getRouteChangeFunction(newRoute, oldRoute);
        let routeChangeFunction = replace ? 'replace' : 'push';

        this.$router[routeChangeFunction](location)
          .catch(failure => {
           if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
             // отображение ошибки
             console.log(failure);
           }
         });
      }
    }
  },

  computed: {
    location: {
      // геттер:
      get() {
        let query = {
          view: this.query.view,
          date: this.query.date,
          participation: this.query.participation,
          search: this.query.search
        };

        return { path: '/', query: query };
      },
      // сеттер:
      set(newValue) {
        let query = Object.assign({}, this.query);
        query.view = newValue.query.view;
        query.date = newValue.query.date;
        query.participation = newValue.query.participation;
        query.search = newValue.query.search;

        this.query = query;
      }
    }
  },

  methods: {
    getRouteChangeFunction(newRoute, oldRoute) {
      // сохраним все измененные параметры
      let changesQuery = [];
      for (let key in newRoute.query) {
        if (newRoute.query[key] !== oldRoute.query[key]) {
          changesQuery.push(key);
        }
      }

      // если все измененные параметры находятся в массиве replaceRoute,
      // то заменям в истории, а не добавляем
      let replace = changesQuery.every(item => {
        return this.replaceRoute.includes(item);
      });

      return replace;
    }
  }
};
</script>

<style scoped></style>
