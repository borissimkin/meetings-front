<template>
  <div id="login">
    <div class="login__container">
      <div class="login__container-header">
        Регистрация
      </div>
      <v-divider/>
      <div class="login__container-main">
        <v-form
            v-model="valid"
            @submit.prevent="alert('wdad')"
        >
          <v-text-field
              v-model="firstname"
              :counter="10"
              :rules="nameRules"
              label="Имя"
              required
          ></v-text-field>

          <v-text-field
              v-model="lastname"
              :counter="10"
              :rules="nameRules"
              label="Фамилия"
              required
          ></v-text-field>

          <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
          ></v-text-field>
          <v-text-field v-model="password"
                        :rules="passwordRules"
                        label="Введите пароль" type="password">

          </v-text-field>
          <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules" label="Повторите пароль" type="password">

          </v-text-field>
        </v-form>
        <v-row class="justify-end pt-2">
          <v-btn
              :disabled="!valid"
              type="submit"
          >
            Создать
          </v-btn>
        </v-row>
        <v-row>
          <router-link
              class="pt-2"
              to="/login"
          >
            Уже есть аккаунт?
          </router-link>
        </v-row>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  //todo: когда(если) будет свободное время, обязательно перепиши
  // todo: чтобы не певторялся код с логином
  name: "RegistrationForm",
  data() {
    return {
      valid: false,
      firstname: '',
      lastname: '',
      nameRules: [
        v => !!v || 'Имя обязательно',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail обязателен',
        v => /.+@.+/.test(v) || 'E-mail неверный',
      ],
      passwordRules: [
        v => !!v || "Пароль обязателен",
      ],
      confirmPasswordRules: [
        v => !!v || "Пароль обязателен",
        v => v === this.password || "Пароли должны совпадать",
      ],
      password: "",
      confirmPassword: ""

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
}

.login__container {
  background: #fff;
  box-shadow: 0 1px 4px 0 #b7b7b7;
  border-radius: 6px;
  padding: .5rem;
  min-width: 315px;

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
}


</style>