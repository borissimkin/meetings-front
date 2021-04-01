<template>
  <div id="login">
    <div
      class="login__container"
      :class="{ 'login__container_not-auth': errorRegistration }"
    >
      <div class="login__container-header">Регистрация</div>
      <v-divider />
      <div class="login__container-main">
        <v-form v-model="valid" @submit.prevent="signUp">
          <v-text-field
            v-model="form.firstName"
            :counter="10"
            :rules="nameRules"
            label="Имя"
            required
          />

          <v-text-field
            v-model="form.lastName"
            :counter="10"
            :rules="nameRules"
            label="Фамилия"
            required
          />

          <v-text-field
            v-model="form.email"
            :rules="emailRules"
            label="E-mail"
            required
          />
          <v-text-field
            v-model="form.password"
            :rules="passwordRules"
            label="Введите пароль"
            type="password"
          />

          <v-text-field
            v-model="form.confirmPassword"
            :rules="confirmPasswordRules"
            label="Повторите пароль"
            type="password"
          />
          <template v-if="errorRegistration">
            <div class="error-text pb-2">
              {{ errorRegistration }}
            </div>
          </template>
          <v-row class="justify-end pt-2">
            <v-btn :disabled="!valid" type="submit"> Создать </v-btn>
          </v-row>
        </v-form>

        <v-row>
          <router-link class="pt-2" to="/login">
            Уже есть аккаунт?
          </router-link>
        </v-row>
      </div>
    </div>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </div>
</template>

<script>
import AuthApi from '@/api/auth.api'
import { REGISTRATION_SUCCESS } from '@/helpers/toast.messages'
export default {
  //todo: когда(если) будет свободное время, обязательно перепиши
  // todo: чтобы не повторялся код с логином
  name: 'RegistrationForm',
  data() {
    return {
      valid: false,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      nameRules: [(v) => !!v || 'Имя обязательно'],
      emailRules: [
        (v) => !!v || 'E-mail обязателен',
        (v) => /.+@.+/.test(v) || 'E-mail неверный',
      ],
      passwordRules: [(v) => !!v || 'Пароль обязателен'],
      confirmPasswordRules: [
        (v) => !!v || 'Пароль обязателен',
        (v) => v === this.form.password || 'Пароли должны совпадать',
      ],

      errorRegistration: '',
      loading: false,
    }
  },
  methods: {
    async signUp() {
      this.errorRegistration = ''
      this.loading = true
      try {
        await AuthApi.signUp(this.form)
        this.$toast.success(REGISTRATION_SUCCESS)
        await this.$router.push('/login')
      } catch (error) {
        if (!error.response) {
          console.error(error)
          return
        }
        if (error.response.status === 403) {
          this.errorRegistration = error.response.data
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.error-text {
  color: #ec0101;
}

#login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login__container {
  background: #fff;
  box-shadow: 0 1px 4px 0 #b7b7b7;
  border-radius: 6px;
  padding: 0.5rem;
  min-width: 315px;

  &-wrapper {
    width: 300px;
  }

  &_not-auth {
    box-shadow: 0 0 12px 0 #ff6363;
    transition: box-shadow 0.5s ease-in-out;
  }

  @media screen and (min-width: 375px) {
    &-wrapper {
      width: 350px;
    }
  }

  &-header {
    font-size: 1.2rem;
    font-weight: 500;
    padding: 1rem;
    text-align: left;
    color: #2e2f4e;
  }

  &-main {
    padding: 1.5rem;

    &-footer {
      display: flex;

      justify-content: space-between;
    }
  }
}
</style>
