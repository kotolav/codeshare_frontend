<template>
   <div class="main-page">
      <div class="panel">
         <h1 class="panel__title">CODESHARE</h1>
         <p class="text">
            С помощью этого сервиса Вы можете делиться своими решениям задач с
            сайта Codewars.
         </p>
         <p class="text">
            Сервис загрузит все Ваши решения, затем Вы сможете оставить только
            необходимые и дополнить решения комментариями.
         </p>
         <p class="text">
            В итоге Вы получаете ссылку, которой можно поделиться для показа
            Ваших решений.
         </p>
      </div>

      <div class="panel">
         <h2 class="panel__title">Начало работы</h2>

         <p class="text">
            Так как Codewars не предоставляет API для получения решений задач,
            то сервис загрузит решения авторизовавшись в Вашем аккаунте.
         </p>
         <p class="text">
            Для этого введите логин и пароль от аккаунта на Codewars
            <span class="text--marked">или</span>
            cookies полученные после авторизации.
         </p>
         <p class="text">
            Сервис не сохраняет Ваш логин, пароль, cookies. Эти данные находятся
            в памяти и используются только на время загрузки решений, а затем
            удаляются.
         </p>
         <br />
         <cookie-instruction />
         <task-credentials
            ref="credentialsPanel"
            :button-text="
               taskUpdating.creating ? 'Загружаем...' : 'Загрузить решения'
            "
            :button-enabled="!taskUpdating.creating"
            @send="makeTask"
         />
      </div>

      <div id="auth-section" class="panel">
         <h3 class="panel__title">Авторизация</h3>

         <p class="text">
            Хотите отредактировать или обновить ранее загруженные решения и у
            Вас есть ключ редактирования?
         </p>
         <p class="text">
            Тогда введите его в поле ниже, либо выберите из списка сохраненных
            ключей.
         </p>
         <p class="text">
            Вы можете попробовать сервис в демонстрационном режиме. Для этого в
            поле ключ введите
            <span
               class="clickable text--marked"
               @click="authPanel.setToken('demo')"
               >demo</span
            >.
         </p>
         <br />
         <auth-panel ref="authPanel" />
      </div>
   </div>
</template>

<script lang="ts">
import {
   defineComponent,
   ref,
   useMeta,
   useRouter,
} from '@nuxtjs/composition-api'
import { useTask } from '~/helpers/task'
import { useConfig } from '~/helpers/config'
import { CreateTaskData } from '~/api/task'

export default defineComponent({
   setup() {
      const { createTask, taskUpdating, changeToken } = useTask('')
      const { applyNewEditToken } = useConfig()
      const router = useRouter()
      const credentialsPanel = ref<any>(null)
      const authPanel = ref<any>(null)

      useMeta({
         title: 'CodeShare - сервис чтобы делиться кодом решений задач',
      })

      const makeTask = async (data: CreateTaskData) => {
         if (!taskUpdating.value.creating) {
            const response = await createTask(data)
            if (response?.token !== undefined) {
               const editToken = response?.token
               changeToken(editToken)
               applyNewEditToken(editToken)
               router.push({ name: 'edit' })
            } else {
               credentialsPanel.value.setInfoMessage(
                  'Ошибка при создании задания. Попробуйте позже'
               )
            }
         }
      }

      return {
         taskUpdating,
         makeTask,
         credentialsPanel,
         authPanel,
      }
   },

   head: {},
})
</script>

<style lang="scss" scoped>
.main-page {
   padding: 40px 0 0;
   @include xs-block() {
      padding-top: 10px;
   }
}
.panel {
   @include panel;
   padding-bottom: 2em;
   max-width: $panel_width;
   margin: 0 auto;

   & + & {
      margin-top: 30px;
   }

   &__title {
      text-align: center;
      font-size: 2em;
      margin-bottom: 0.8em;
      font-weight: bold;
      color: $info_text;
   }
}

.clickable {
   border-bottom: 1px dashed currentColor;
   cursor: pointer;
}

.text {
   & + & {
      margin-top: 1em;
   }

   &--accent {
      color: $green_accent;
   }

   &--marked {
      color: $info_text;
   }
}
</style>
