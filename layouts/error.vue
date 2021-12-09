<template>
   <div class="wrapper">
      <div class="wrapper__content">
         <div class="wrapper__text">
            <div class="panel">
               <h1 class="panel__title">
                  {{ error.statusCode }} - {{ pageTitle }}
               </h1>
               <div v-if="error.statusCode === 401" class="panel__message">
                  <nuxt-link
                     class="panel__link"
                     :to="{ name: 'index', hash: '#auth-section' }"
                     >Перейти к авторизации</nuxt-link
                  >
               </div>
               <div v-else-if="error.statusCode === 500" class="panel__message">
                  <span class="panel__link" @click="refreshPage"
                     >Обновить страницу</span
                  >
               </div>
               <div v-else class="panel__message">
                  <nuxt-link class="panel__link" :to="{ name: 'index' }"
                     >Перейти на главную</nuxt-link
                  >
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script lang="ts">
import {
   computed,
   defineComponent,
   useMeta,
   useRouter,
} from '@nuxtjs/composition-api'
import { NuxtError } from '@nuxt/types'

export default defineComponent({
   layout: 'error',
   props: {
      error: {
         type: Object as () => NuxtError,
         default: null,
      },
   },

   setup(props) {
      const router = useRouter()
      useMeta({
         title: 'Ошибка',
      })

      const pageTitle = computed(() => {
         if (props.error.statusCode === 401) {
            return 'Необходима авторизация'
         } else if (props.error.statusCode === 404) {
            return 'Страница не найдена'
         }
         return props.error.message ?? 'Ошибка'
      })

      const refreshPage = () => {
         router.go(0)
      }

      return { pageTitle, refreshPage }
   },
   head: {},
})
</script>

<style lang="scss">
.wrapper {
   width: 100%;
   height: 100%;
   min-height: 100vh;
   display: flex;
   justify-content: center;
   align-items: center;

   &__content {
      width: 100%;
      max-width: 700px;
   }
}

.panel {
   @include panel;

   &__title {
      text-align: center;
      font-weight: bold;
      font-size: 2em;
      margin-bottom: 1em;
   }

   &__message {
      text-align: center;
   }

   &__link {
      text-decoration: none;
      color: $info_text;
      font-size: 1.4em;
   }
}
</style>
