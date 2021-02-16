const { getSolutionPath } = require('taskbook-test-utils');
const MeetupsList = require(getSolutionPath('components/MeetupsList')).default;
const ListView = require(getSolutionPath('components/ListView')).default;
import { RouterLinkStub, mount, shallowMount } from '@vue/test-utils';
import { meetups } from './__fixtures__/meetups';
import ListViewCard from '../components/ListViewCard';
import MeetupInfo from '../components/MeetupInfo';

describe('interactions-and-logic-reuse/ListView', () => {
  describe('ListView', () => {
    it('Компонент ListView должен иметь входной параметр items', () => {
      const wrapper = shallowMount(ListView, {
        propsData: { items: [] },
      });
      expect(wrapper.vm.$options.props.items).toBeTruthy();
    });

    it('Компонент ListView рендерить данные список items', () => {
      const items = ['A', 'B', 'C'];
      const wrapper = shallowMount(ListView, {
        propsData: { items },
        scopedSlots: {
          default(props) {
            return this.$createElement(
              'div',
              {
                attrs: {
                  'data-test-div': '',
                },
              },
              Object.values(props),
            );
          },
        },
      });

      const divs = wrapper.findAll('[data-test-div]').wrappers;
      expect(divs).toHaveLength(items.length);
      const divTexts = divs.map((div) => div.text());
      expect(divTexts.every((text, i) => text.includes(items[i]))).toBe(true);
    });
  });

  describe('MeetupsList с ListView', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(MeetupsList, {
        propsData: { meetups },
        stubs: {
          RouterLink: RouterLinkStub,
        },
      });
    });

    it('Компонент MeetupsList должен использовать компонент ListView', async () => {
      const listView = wrapper.findComponent(ListView);
      expect(listView.exists()).toBe(true);
    });

    it('Компонент MeetupsList должен выводить список митапов через компоненты ListView и ListViewCard', async () => {
      const listView = wrapper.findComponent(ListView);
      const cards = listView.findAllComponents(ListViewCard).wrappers;
      expect(cards).toHaveLength(meetups.length);

      const cardTitles = cards.map((card) => card.props('title'));
      const meetupsTitles = meetups.map((meetup) => meetup.title);
      expect(cardTitles).toEqual(meetupsTitles);
    });

    it('Компонент MeetupsList должен выводить информацию о митапах через компонент MeetupInfo', async () => {
      const listView = wrapper.findComponent(ListView);
      const cards = listView.findAllComponents(ListViewCard).wrappers;
      const meetupsInfo = cards.map((card) => card.findComponent(MeetupInfo));

      const meetupsInfoPlaces = meetupsInfo.map((info) => info.props('place'));
      const meetupsPlaces = meetups.map((meetup) => meetup.place);
      expect(meetupsInfoPlaces).toEqual(meetupsPlaces);

      const meetupsInfoDates = meetupsInfo.map((info) => info.props('date'));
      expect(meetupsInfoDates.every((date) => date instanceof Date)).toBe(true);
    });
  });
});
