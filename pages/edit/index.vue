<template>
   <div class="edit-page">
      <template
         v-if="['processing', 'added'].includes(task.status) || !taskReady"
      >
         <div class="edit-page__info info-panel">
            <h2 class="info-panel__title">Обработка...</h2>
            <p>
               Происходит загрузка решений с сайта Codewars. По завершению
               процесса страница автоматически обновится.
            </p>
         </div>
      </template>
      <template v-else-if="task.status === 'fail'">
         <div class="edit-page__info info-panel">
            <h2 class="info-panel__title">Ошибка</h2>
            <p>
               Произошла ошибка при получении задач. Убедитесь в правильности
               введенных данных и повторите попытку.
            </p>

            <cookie-instruction />
            <task-credentials
               ref="credentialsPanel"
               :button-text="
                  taskUpdating.parsing ? 'Загружаем...' : 'Загрузить решения'
               "
               :button-enabled="!taskUpdating.parsing"
               @send="
                  getNewSolutions({
                     ...$event,
                     ...{ shiftStatuses: false },
                  })
               "
            />
         </div>
      </template>
      <template v-else>
         <div class="edit-page__info info-panel">
            <h1 class="info-panel__title">Редактирование решений</h1>
            <p class="info-panel__paragraph">
               Здесь показаны Ваши решения задач с сайта Codewars. Можно
               добавить к ним комментарии или скрыть ненужные решения.
            </p>
            <p class="info-panel__paragraph">
               Если для задачи скрыты все её решения, то на итоговой странице
               просмотра задача не отобразится.
            </p>
            <p class="info-panel__paragraph">
               <span class="info-panel__marked"
                  >Сохраните ключ редактирования:</span
               >
               <code>{{ editToken }}</code>
               Только по нему возможен доступ на эту страницу.
            </p>
            <hr class="info-panel__hr" />
            <p class="info-panel__paragraph">
               Этой ссылкой можно делиться. Она содержит отобранные задачи:
            </p>
            <p class="edit-page__share-link">{{ publicLink }}</p>

            <div class="edit-page__action-links">
               <span
                  class="edit-page__action"
                  @click="copyToClipboard(publicLink)"
                  >Копировать ссылку</span
               >
               <a :href="publicLink" target="_blank" class="edit-page__action"
                  >Открыть в новом окне</a
               >
            </div>
            <p class="info-panel__paragraph info-panel__paragraph--spaced">
               При необходимости Вы можете
               <span class="edit-page__action" @click="generateNewPublicLink"
                  >сгенерировать</span
               >
               новую публичную ссылку.
               <span class="info-panel__marked"
                  >Внимание! Старая публичная ссылка перестанет работать.</span
               >
            </p>
            <hr class="info-panel__hr" />
            <p class="info-panel__paragraph">
               Вы можете добавить информацию о себе, она будет отображена на
               итоговой странице
            </p>
            <task-about :about="task.solver.about" @save="setSolverAbout" />
            <hr class="info-panel__hr" />
            <p class="info-panel__paragraph"></p>
            <p>Загрузить новые решенные задачи</p>
            <cookie-instruction />
            <task-credentials
               ref="credentialsPanel"
               :button-text="
                  taskUpdating.parsing ? 'Обновление...' : 'Обновить решения'
               "
               :button-enabled="!taskUpdating.parsing"
               @send="getNewSolutions"
            />
         </div>

         <filter-panel
            :search-params="searchParams"
            :tags="usedTags"
            :languages="usedLanguages"
            @applyFilters="searchKata"
         />
         <div ref="topPaginator" class="edit-page__paginate">
            <paginator :data="paginatorData" @pageChange="onPageChange" />
         </div>

         <div v-if="currentPageItems.length" class="katas-list">
            <kata-card
               v-for="data in currentPageItems"
               :key="data.id"
               :data="data"
               class="katas-list__item"
            />
         </div>
         <div
            v-else-if="katasLength.all === 0"
            class="edit-page__info info-panel info-panel--center"
         >
            <p>
               Нет решений для отображения. Попробуйте запросить загрузку
               решений снова или зайти позже.
            </p>
            <p>
               <span class="edit-page__reset-filter" @click="refreshPage"
                  >Обновить страницу</span
               >
            </p>
         </div>
         <div v-else class="edit-page__info info-panel info-panel--center">
            <p>По выбранным фильтрам нет решений для отображения.</p>
            <p>
               <span class="edit-page__reset-filter" @click="resetSearchParams"
                  >Сбросить фильтры</span
               >
            </p>
         </div>

         <div class="edit-page__paginate">
            <paginator
               :data="paginatorData"
               @pageChange="onPageChange($event, true)"
            />
         </div>
      </template>
      <Footer />
   </div>
</template>

<script lang="ts">
import {
   computed,
   defineComponent,
   onUnmounted,
   provide,
   ref,
   useContext,
   useMeta,
   useRouter,
} from '@nuxtjs/composition-api'
import { Context } from '@nuxt/types'
import { useEditKatas } from '~/helpers/editKatas'
import { usePaginator } from '~/helpers/paginator'
import { SearchConfig, useFilterKatas } from '~/helpers/filteredKatas'
import { useTask } from '~/helpers/task'
import { ReparseTaskData } from '~/api/task'

export default defineComponent({
   setup() {
      provide('canEdit', true)
      const router = useRouter()

      const { $cookies } = useContext()
      const editToken: string = $cookies.get('editToken')

      const {
         getStatus,
         taskUpdating,
         task,
         setSolverAbout,
         recreatePublicToken,
         clearTimers,
         reparseTask,
         waitTaskProcessed,
      } = useTask(editToken)
      const { katas, loadKatas, usedLanguages, usedTags } =
         useEditKatas(editToken)
      const {
         filteredKatas,
         searchParams,
         setSearchParams,
         resetSearchParams,
      } = useFilterKatas(katas)

      const { currentPageItems, changePage, paginatorData } =
         usePaginator(filteredKatas)

      const credentialsPanel = ref()
      const taskReady = ref(true)

      useMeta({
         title:
            'Страница редактирования задач Codewars пользователя ' +
            (task.value?.solver?.nick ?? ''),
      })

      onUnmounted(() => {
         clearTimers()
      })

      async function waitForTaskDone() {
         taskReady.value = false
         await waitTaskProcessed()
         await loadKatas()
         taskReady.value = true
      }

      if (['added', 'processing'].includes(task.value.status)) {
         waitForTaskDone()
      }

      const onPageChange = (page: number, scrollToTop = false) => {
         changePage(page)
         if (scrollToTop && process.client) {
            let top = 0
            if (topPaginator.value !== null) {
               top = topPaginator.value.offsetTop - 10
            }
            window.scrollTo({ top, behavior: 'smooth' })
         }
      }

      const topPaginator = ref<HTMLElement | null>(null)

      const publicLink = computed(() => {
         return (
            process.env.baseUrl +
            router.resolve({
               name: 'solutions-id',
               params: {
                  id: task.value.publicToken,
               },
            }).href
         )
      })

      const katasLength = computed(() => ({
         all: katas.value.length,
         filtered: filteredKatas.value.length,
      }))

      function copyToClipboard(text: string) {
         const textarea = document.createElement('textarea')
         textarea.id = 'temp_element'
         textarea.style.height = '0px'
         document.body.appendChild(textarea)
         textarea.value = text
         const selector: HTMLTextAreaElement | null =
            document.querySelector('#temp_element')
         if (selector !== null) {
            selector.select()
         }
         document.execCommand('copy')
         // Remove the textarea
         document.body.removeChild(textarea)
      }

      const getNewSolutions = async (data: ReparseTaskData) => {
         if (editToken.trim().toLowerCase() === 'demo') {
            credentialsPanel.value.setInfoMessage(
               'В демонстрационном режиме обновление задач отключено'
            )
            return
         }
         if (!taskUpdating.value.parsing) {
            taskReady.value = false
            await reparseTask(data)
            await loadKatas()
            taskReady.value = true
         }
      }

      const generateNewPublicLink = async () => {
         if (
            !taskUpdating.value.generating &&
            confirm('Действительно сгенерировать новую публичную ссылку?')
         ) {
            await recreatePublicToken()
            await getStatus()
         }
      }

      const searchKata = (config: SearchConfig, override = false) => {
         setSearchParams(config, override)
      }

      const refreshPage = () => {
         router.go(0)
      }

      return {
         currentPageItems,
         taskReady,
         publicLink,
         taskUpdating,
         editToken,
         katasLength,
         credentialsPanel,
         copyToClipboard,
         refreshPage,
         getNewSolutions,
         generateNewPublicLink,
         task,
         paginatorData,
         topPaginator,
         searchParams,
         setSolverAbout,
         onPageChange,
         searchKata,
         resetSearchParams,
         usedTags,
         usedLanguages,
      }
   },
   async asyncData(ctx: Context) {
      const { $cookies, error } = ctx

      const editToken = $cookies.get('editToken')
      let res
      if (editToken) {
         const { getStatus } = useTask(editToken)
         const { loadKatas } = useEditKatas(editToken)
         res = await Promise.allSettled([getStatus(), loadKatas()])
      }

      if (
         !editToken ||
         (res?.[0].status === 'fulfilled' &&
            [2, 3].includes(res?.[0]?.value?.response?.data?.error_code))
      ) {
         error({ statusCode: 401 })
      }
   },
   head: {},
})
</script>
<style lang="scss" scoped>
.edit-page {
   padding: 40px 0 0;
   @include xs-block() {
      padding-top: 0;
   }

   &__paginate {
      display: block;
      margin: 20px auto;
      max-width: 650px;
   }

   &__info {
      @include panel;
      max-width: $panel_width;
      margin: 0 auto 30px;
   }

   &__share-link {
      font-size: 14px;
      border-radius: 6px;
      background-color: $dark_bg;
      padding: 0.5em 1em;
      word-break: break-all;
      margin-top: 0.5em;
   }

   &__action-links {
      text-align: right;
   }

   &__action {
      color: inherit;
      border-bottom: 1px dashed currentColor;
      text-decoration: none;
      cursor: pointer;
      font-size: 15px;

      &:active {
         color: $info_text;
      }

      & + & {
         margin-left: 1em;
      }
   }

   &__reset-filter {
      border-bottom: 1px dashed #fff;
      cursor: pointer;
   }
}

.info-panel {
   &--center {
      text-align: center;
   }

   &__title {
      text-align: center;
      font-size: 2em;
      margin-bottom: 0.8em;
      font-weight: bold;
      color: $info_text;
   }

   &__hr {
      @include hr;
   }

   &__paragraph {
      & + & {
         margin-top: 1em;
      }

      &--spaced {
         margin-top: 1em;
      }

      &--center {
         text-align: center;
      }

      &--right {
         text-align: right;
      }

      code {
         display: block;
         background-color: $dark_bg;
         color: $green_accent;
         padding: 0.5em 1em;
         border-radius: 4px;
         word-break: break-all;
      }
   }

   &__marked {
      font-weight: bold;
      color: $green_accent;
   }
}

.katas-list {
   &__item {
      margin: 20px auto;
      max-width: $panel_width;
   }
}
</style>
