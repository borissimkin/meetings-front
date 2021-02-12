<template>
  <div id="login">
    <div class="login__container">
      <div class="login__container-header">
        Авторизация
      </div>
      <v-divider />
      <div class="login__container-main">
        <v-form
          @submit.prevent="signIn"
        >
          <v-text-field
            v-model="form.email"
            placeholder="Email"
            type="email"
            required
          />
          <v-text-field
            v-model="form.password"
            type="password"
            placeholder="Пароль"
            required
          />
          <template v-if="errorAuthorization">
            <div class="error-text pb-2">
              {{ errorAuthorization }}
            </div>
          </template>
          <v-row>
            <v-col>
              <router-link
                class="pt-2"
                to="/register"
              >
                Зарегистрироваться
              </router-link>
            </v-col>
            <v-col>
              <v-btn
                type="submit"
              >
                Войти
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </div>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </div>
</template>

<script>
import redirectService from "@/services/redirect.service"
import store from "@/store";
import socket from "@/socket";
export default {
  name: "Login",
  data() {
    return {
      errorAuthorization: '',
      loading: false,
      form: {
        password: '',
        email: ''
      },
    }
  },
  methods: {
    async signIn() {
      this.errorAuthorization = '';
      this.loading = true;
      try {
        await this.$store.dispatch("auth/signIn", this.form);
        await this.$router.push(redirectService.getRedirectPath() || '/');
        socket.emit('authenticate', { token: store.state.auth.token })
        redirectService.removeRedirectPath();
      } catch (error) {
        if (!error.response) {
          console.error(error)
          return
        }
        if (error.response.status === 403) {
          this.errorAuthorization = "Неверный email или пароль"
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 20px;
}

.error-text {
  color: #ec0101
}

.login__container {
  background: #fff;
  box-shadow: 0 1px 4px 0 #b7b7b7;
  border-radius: 6px;
  padding: .5rem;

  &-wrapper {
    width: 300px;
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

  &_not-auth {
    box-shadow: 0 0 12px 0 #ff6363;
    transition: box-shadow 0.5s ease-in-out;
  }
}



</style>