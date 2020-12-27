import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export function scrollBehavior(to, from, savedPosition) {
  // сохранить позицию, если переход по стрелкам навигации
  if (savedPosition) {
    return savedPosition;
  } else {
    // сохранить позицию, если в маршрутах установлен saveScrollPosition
    const toSaveScrollPosition = to.matched.some(route => route.meta && route.meta.saveScrollPosition);
    const fromSaveScrollPosition = from.matched.some(route => route.meta && route.meta.saveScrollPosition);

    if (toSaveScrollPosition && fromSaveScrollPosition) {
     return false;
    }

    // перейти по хэшу
    if (to.hash) {
     return {
       selector: to.hash
     };
    }

    // по умолчанию вернуться наверх
    return {
      x: 0,
      y: 0
    };
  }
}

export const router = new VueRouter({
  mode: 'history',

  base: '/04-SPA/02-ScrollBehavior',

  scrollBehavior,

  routes: [
    {
      path: '/',
      name: 'index',
      // alias: 'meeetups'
      // redirect: '/meetups',
      component: () => import('../views/MeetupsPage'),
    },
    {
      path: '/meetups',
      name: 'meetups',
      component: () => import('../views/MeetupsPage'),
    },
    {
      path: '/meetups/:meetupId(\\d+)',
      name: 'meetup',
      redirect: (to) => ({ name: 'meetup-description', params: to.params }),
      meta: {
        showReturnToMeetups: true,
        saveScrollPosition: true,
      },
      component: () => import('../views/MeetupPage'),
      children: [
        {
          path: '',
          alias: 'description',
          name: 'meetup-description',
          props: true,
          component: () => import('../views/MeetupDescriptionPage'),
        },
        {
          path: 'agenda',
          name: 'meetup-agenda',
          props: true,
          component: () => import('../views/MeetupAgendaPage'),
        },
      ],
    },
  ],
});
