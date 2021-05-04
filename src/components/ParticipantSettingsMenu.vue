<template>
  <v-menu :nudge-width="200" offset-x>
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-bind="attrs" v-on="on">mdi-dots-horizontal</v-icon>
    </template>
    <v-card>
      <v-list>
        <v-list-item @click='startPreparation'>
          <v-list-item-content>
            Запустить
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click='resetPreparation'>
          <v-list-item-content>
            Сбросить
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click='setResponder'>
          <v-list-item-content>
            Отвечать!
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import meetingApi from "@/api/meeting.api"
import { mapState } from 'vuex'
import { RESET_PREPARATIONS_TO_EXAM, SET_RESPONDED_USER, START_PREPARATIONS_TO_EXAM } from '@/helpers/toast.messages'
export default {
  name: 'ParticipantSettingsMenu',
  props: {
    user: {
      type: Object,
      required: true,
      default: () => {
      }
    }
  },
  computed: {
    ...mapState("meeting", {
      meetingInfo: state => state.meetingInfo
    }),
  },
  methods: {
    async startPreparation() {
      try {
        await meetingApi.startPreparationToUser(this.meetingInfo.hashId, this.user.id )
        this.$toast.success(START_PREPARATIONS_TO_EXAM(this.user.firstName, this.user.lastName))
      } catch (e) {
        console.log({e})
      }
    },

    async resetPreparation() {
      try {
        await meetingApi.resetPreparationToUser(this.meetingInfo.hashId, this.user.id )
        this.$toast.success(RESET_PREPARATIONS_TO_EXAM(this.user.firstName, this.user.lastName))
      } catch (e) {
        console.log({e})
      }
    },

    async setResponder() {
      try {
        await meetingApi.setRespondedUserId(this.meetingInfo.hashId, this.user.id)
        this.$toast.info(SET_RESPONDED_USER(this.user.firstName, this.user.lastName))
      } catch (e) {
        console.log({e})
      }
    }
  }
}
</script>

<style scoped>

</style>
