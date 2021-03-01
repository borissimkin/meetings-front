<template>
  <v-card class='pa-1 mt-2 mb-2'  flat>
    <div class='menu'>
      <v-icon>mdi-dots-horizontal</v-icon>
    </div>
    <div class='content px-1'>
      <div class='font-weight-medium'>
        {{name}}
      </div>
      <div>
        <v-icon color='black' small>mdi-video-off</v-icon>
        <v-icon color='black' small>mdi-microphone-off</v-icon>
        <v-icon color='orange'>mdi-hand-right</v-icon>
      </div>
    </div>
<!--    <div class='px-1 text-caption font-weight-light'>-->
<!--      {{new Date().toISOString()}}-->
<!--    </div>-->
  </v-card>
</template>

<script>
import { getFullName } from '@/helpers/username.process'

export default {
  name: 'MeetingParticipantsListItem',
  props: {
    user: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    name() {
      return getFullName(this.user.firstName, this.user.lastName)
    }
  }
}
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: flex-end;
}
.content {
  display: flex;
  justify-content: space-between;
}
</style>