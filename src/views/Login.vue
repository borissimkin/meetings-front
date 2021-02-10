<template>
  <div id="login">
    <b-overlay
      :class="{'login__container_not-auth': errorAuthorization}"
      :show="loading"
      class="login__container-wrapper"
      no-fade
      opacity="0.4"
      rounded="sm"
      spinner-variant="primary"
    >
      <div class="login__container login__container-wrapper">
        <div class="login__container-header">
          Авторизация
        </div>
        <div class="login__container-main">
          <b-form
            @submit.prevent="signIn"
          >
            <b-form-group>
              <b-form-input
                v-model="form.email"
                type="email"
                placeholder="Введите email"
                required
              />
            </b-form-group>
            <b-form-group>
              <b-form-input
                v-model="form.password"
                type="password"
                placeholder="Введите пароль"
                required
              />
            </b-form-group>
            <template v-if="errorAuthorization">
              <div class="error-text pb-2">
                {{ errorAuthorization }}
              </div>
            </template>
            <div
              class="login__container-main-footer"
            >
              <router-link
                class="pt-2"
                to="/register"
              >
                Зарегистрироваться
              </router-link>
              <b-button
                type="submit"
                variant="primary"
                class="login__container-main-footer-button"
              >
                Войти
              </b-button>
            </div>
          </b-form>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import redirectService from "@/services/redirect.service"
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
        redirectService.removeRedirectPath();
      } catch (error) {
        if (!error.response) {
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
    font-family: 'Roboto', sans-serif;
    color: #2e2f4e;
    border-bottom: 2px #eeeeee solid;
  }

  &-main {
    padding: 1.5rem;

    &-footer {
      display: flex;

      justify-content: space-between;
    }

  }

  &-telegram {
    padding: 1rem 1.5rem .5rem 1.5rem;

    &-widget {
      text-align: right;
    }

    &_error-auth {
      color: red;
      background: #f1f1f1;
      border-radius: 6px;
      margin-top: 1rem;
    }
  }

  &_not-auth {
    box-shadow: 0 0 12px 0 #ff6363;
    transition: box-shadow 0.5s ease-in-out;
  }
}



</style>