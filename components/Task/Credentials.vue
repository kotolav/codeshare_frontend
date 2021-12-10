<template>
   <div class="credentials">
      <div class="credentials__row credentials__row--flex">
         <div class="credentials__cell">
            <label for="login" class="credentials__label">Логин</label>
            <input
               id="login"
               v-model="login"
               placeholder="Логин на Codewars"
               class="credentials__input"
               type="text"
            />
         </div>
         <div class="credentials__cell">
            <label for="password" class="credentials__label">Пароль</label>
            <input
               id="password"
               v-model="password"
               placeholder="Пароль на Codewars"
               class="credentials__input"
               type="password"
            />
         </div>
      </div>
      <div class="credentials__row">
         <label for="cookies" class="credentials__label">Cookies</label>
         <textarea-autosize
            id="cookies"
            v-model="cookies"
            class="credentials__textarea"
         ></textarea-autosize>
      </div>
      <div
         class="credentials__row credentials__row--flex credentials__row--right"
      >
         <p class="credentials__error">{{ error }}</p>
         <button
            class="credentials__button"
            :disabled="!buttonEnabled"
            @click="send"
         >
            {{ buttonText }}
         </button>
      </div>
   </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
   props: {
      buttonText: {
         type: String,
         required: false,
         default: 'Отправить',
      },
      buttonEnabled: {
         type: Boolean,
         required: false,
         default: true,
      },
   },
   emits: ['send'],

   setup(_, context) {
      const login = ref('')
      const password = ref('')
      const cookies = ref('')
      const error = ref('')

      const send = () => {
         const loginPassFilled = !!(login.value.trim() && password.value.trim())
         const cookiesFilled = !!cookies.value.trim()

         if (loginPassFilled || cookiesFilled) {
            error.value = ''
            let sendData = {}
            if (loginPassFilled) {
               sendData = {
                  login: login.value,
                  password: password.value,
               }
            } else {
               sendData = { cookies: cookies.value }
            }
            context.emit('send', sendData)
         } else {
            error.value = 'Нужно заполнить поля логин и пароль или cookies'
         }
      }

      const setCredentials = (data: {
         login?: string
         password?: string
         cookies?: string
      }) => {
         if (data.login) login.value = data.login
         if (data.password) password.value = data.password
         if (data.cookies) cookies.value = data.cookies
      }

      const setInfoMessage = (message: string) => {
         error.value = message
      }

      return {
         login,
         password,
         cookies,
         error,
         send,
         setCredentials,
         setInfoMessage,
      }
   },
})
</script>

<style lang="scss" scoped>
.credentials {
   &__label {
      display: inline-block;
      margin-bottom: 0.15em;
   }
   &__center {
      text-align: center;
   }
   &__row {
      margin-top: 5px;

      &--flex {
         display: flex;
         justify-content: space-between;
         flex-wrap: wrap;
      }

      &--right {
         align-items: center;
         justify-content: flex-end;
      }
   }
   &__cell {
      width: calc(50% - 5px);

      @include xs-block() {
         width: 100%;
         & + & {
            margin-top: 10px;
         }
      }
   }

   &__input {
      display: block;
      width: 100%;
      font-size: 18px;
      color: #fff;
      background-color: #171719;
      transition: 0.3s ease-in-out;
      border-radius: 5px;
      border: 1px solid #424345;
      padding: 0.5em 0.8em;
   }

   &__textarea {
      display: block;
      box-sizing: border-box;
      font-family: 'Roboto', sans-serif;
      border-radius: 0.3em;
      width: 100%;
      min-height: 3em;
      background-color: rgba(0, 0, 0, 0.4);
      border-color: #303030;
      padding: 0.6em 0.75em;
      font-size: 14px;
      color: #a7a7a7;
      resize: none;
      outline: none;
      transition: 0.3s ease-in-out;
   }

   &__button {
      @include standardButton;
      padding: 0.5em 1.5em;
      font-size: 1.1em;

      @include xs-block() {
         width: 100%;
      }
   }

   &__error {
      flex: 1 1 auto;
      text-align: right;
      color: $info_text;
      margin-right: 2em;
      margin-bottom: 0.2em;

      @include xs-block() {
         text-align: left;
         margin-right: 0;
      }
   }
}
</style>
