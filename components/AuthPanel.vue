<template>
   <div class="credentials">
      <div class="credentials__row">
         <label for="editToken" class="credentials__label"
            >Ключ редактирования</label
         >
         <input
            id="editToken"
            ref="tokenInput"
            v-model="tokenModel"
            placeholder="Ключ"
            class="credentials__input"
            type="text"
         />
      </div>
      <div
         class="credentials__row credentials__row--flex credentials__row--right"
      >
         <p class="credentials__error">{{ info }}</p>
         <button
            class="credentials__button"
            :disabled="taskUpdating.status"
            @click="authAttempt"
         >
            {{ buttonText }}
         </button>
      </div>
      <div v-if="availableTokens.length > 0" class="credentials__row">
         <p>Список доступных ключей:</p>
         <ul class="credentials__list">
            <li
               v-for="token in availableTokens"
               :key="token"
               class="credentials__list-item"
            >
               <span
                  class="credentials__linkable credentials__item"
                  @click="setToken(token)"
                  >{{ token }}</span
               ><span class="credentials__splitter">|</span
               ><span
                  class="credentials__remove"
                  title="Удалить ключ"
                  @click="removeEditToken(token)"
               ></span>
            </li>
         </ul>
      </div>
      <div v-else>Сохраненных ключей пока нет.</div>
   </div>
</template>

<script lang="ts">
import {
   defineComponent,
   onMounted,
   ref,
   useRouter,
} from '@nuxtjs/composition-api'
import { useConfig } from '~/helpers/config'
import { useTask } from '~/helpers/task'

export default defineComponent({
   props: {
      buttonText: {
         type: String,
         required: false,
         default: 'Войти',
      },
      buttonEnabled: {
         type: Boolean,
         required: false,
         default: true,
      },
   },
   emits: ['send'],

   setup() {
      const tokenModel = ref('')
      const tokenInput = ref<HTMLInputElement | null>(null)
      const info = ref('')
      const availableTokens = ref<string[]>([])
      const router = useRouter()
      const { editTokens, applyNewEditToken, removeEditToken } = useConfig()
      const { getStatus, changeToken, taskUpdating } = useTask('')

      onMounted(() => {
         availableTokens.value = editTokens.value
      })

      function setToken(token: string) {
         tokenModel.value = token
      }

      async function authAttempt() {
         if (tokenInput.value && tokenModel.value.trim() === '') {
            tokenInput.value.focus()
            info.value = 'Поле ключа обязательно для заполнения'
            return
         }

         info.value = 'Входим...'

         changeToken(tokenModel.value)
         const response = await getStatus()

         if (response?.status !== undefined) {
            applyNewEditToken(tokenModel.value)
            router.push({ name: 'edit' })
         } else {
            if ([2, 3].includes(response?.response?.data?.error_code)) {
               info.value = 'Ошибка: ключ не существует'
            } else {
               info.value =
                  'Неизвестная ошибка. Попробуйте повторить запрос позднее'
            }
            applyNewEditToken('')
         }
      }

      return {
         taskUpdating,
         authAttempt,
         tokenModel,
         tokenInput,
         info,
         availableTokens,
         removeEditToken,
         setToken,
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

   &__button {
      @include standardButton;
      padding: 0.5em 1.5em;
      font-size: 1.1em;

      @include xs-block() {
         width: 100%;
      }
   }

   &__list {
      margin-top: 1px;
   }

   &__list-item {
      & + & {
         margin-top: 0.5em;
      }
   }

   &__splitter {
      display: inline-block;
      margin: 0 0.5em;
   }

   &__remove {
      display: inline-block;
      vertical-align: middle;
      background: url(~/assets/img/delete.png) no-repeat center center;
      background-size: 16px;
      width: 16px;
      height: 16px;
      cursor: pointer;
   }

   &__linkable {
      cursor: pointer;
      border-bottom: 1px dashed currentColor;
   }

   &__item {
      font-family: monospace, monospace, sans-serif;
      word-break: break-all;
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
