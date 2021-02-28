<template>
  <div class="message ma-2 pa-2">
    <div class="message__header">
      <span class="message-author">
        {{ name }}
      </span>
      <span class="message-created">
        {{ processedDate }}
      </span>
    </div>
    <div class="message-text">
      {{ text }}
    </div>
  </div>
</template>

<script>
import { getFullName } from '@/helpers/username.process'
import * as dayjs from 'dayjs'

export default {
  name: 'Message',
  props: {
    text: {
      required: true,
      type: String,
      default: '',
    },
    user: {
      required: true,
      type: Object,
      default: () => {},
    },
    date: {
      required: true,
      type: [String, Date],
      default: new Date(),
    },
  },
  computed: {
    name() {
      return getFullName(this.user.firstName, this.user.lastName)
    },

    processedDate() {
      return dayjs(new Date(this.date)).format('HH:mm')
    },
  },
}
</script>

<style lang="scss" scoped>
.message {
  text-align: left;
  border-radius: 0.1rem;
  bottom: 0;
  min-width: 250px;
  background-color: white;

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &-text {
    word-wrap: break-word;
    font-size: 0.8rem;
  }

  &-author {
    font-weight: 800;
    font-size: 0.9rem;
    padding-right: 0.5rem;
  }

  &-created {
    font-size: 0.75rem;
  }
}

.author-text {
}
</style>
