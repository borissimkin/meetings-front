<template>
  <div id='page'>
    <v-container>
      <v-card>
        <ModalCreateRoom>
        </ModalCreateRoom>
        <v-list two-line>
          <v-subheader>Комнаты</v-subheader>
          <v-list-item-group>
            <v-list-item v-for='room in $store.state.home.rooms'
                         :key='room.id' :to='`/room/${room.hashId}`'>
              <v-list-item-content>

                {{ room.name }}
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import ModalCreateRoom from '@/components/ModalCreateRoom'

export default {
  name: 'Home',
  components: { ModalCreateRoom },

  mounted() {
    this.$store.dispatch('home/fetchRooms')
  },
}
</script>

<style scoped></style>
