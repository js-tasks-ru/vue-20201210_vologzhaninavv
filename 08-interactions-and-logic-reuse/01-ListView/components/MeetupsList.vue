<template>
  <list-view :items="meetupsWithCoverAndBadge" v-slot="{ item }">
    <list-view-card
      tag="router-link"
      :to="{ name: 'meetup', params: { meetupId: item.id } }"
      :key="item.id"
      :title="item.title"
      :cover="item.cover"
      :badge="item.badge"
      :badge-success="item.badgeSuccess"
    >
      <meetup-info
        :date="item.date"
        :place="item.place"
        :organizer="item.organizer"
      />
    </list-view-card>
  </list-view>
</template>

<script>
import ListView from './ListView';
import ListViewCard from './ListViewCard';
import MeetupInfo from './MeetupInfo';
import { getImageUrlByImageId } from '../data';

export default {
  name: 'MeetupsList',

  props: {
    meetups: {
      type: Array,
      required: true,
    },
  },

  components: { ListView, ListViewCard, MeetupInfo },

  computed: {
    meetupsWithCoverAndBadge() {
      return this.meetups.map((meetup) => {
        const newMeetup = { ...meetup };
        if (meetup.attending) {
          newMeetup.badge = 'Участвую';
          newMeetup.badgeSuccess = true;
        } else if (meetup.organizing) {
          newMeetup.badge = 'Организую';
        }
        newMeetup.cover =
          meetup.imageId && getImageUrlByImageId(meetup.imageId);
        newMeetup.date = new Date(meetup.date);
        return newMeetup;
      });
    },
  },
};
</script>

<style></style>
