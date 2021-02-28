<template>
  <div class='video-placeholder'>
    <v-avatar v-if='initials' color='teal' size='72'>
      <span class='white--text headline'>
      {{ initials }}
      </span>
    </v-avatar>
  </div>
</template>

<script>
import { getInitials } from '@/helpers/username.process'
import _ from 'lodash'

export default {
  name: 'VideoStreamPlaceholder',
  props: {
    user: {
      type: Object,
      required: true,
      default: () => {
      },
    },
  },
  computed: {
    initials() {
      if (!_.isEmpty(this.user)) {
        return getInitials(this.user.firstName, this.user.lastName)
      }
      return ''
    },
  },
}
</script>

<style scoped>

.video-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2e2f4e;
  width: 100%;
  height: 100%

}

</style>