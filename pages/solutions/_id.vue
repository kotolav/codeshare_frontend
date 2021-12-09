<template>
   <div class="edit-page">
      <div class="edit-page__info info-panel solver-info">
         <div class="solver-info__header">
            <p class="solver-info__title">
               Посмотреть профиль на сайте Codewars: <br />
            </p>
            <a
               :href="`https://www.codewars.com/users/${solver.nick}`"
               rel="noopener noreferrer"
               target="_blank"
               class="solver-info__badge"
            >
               <img
                  width="400"
                  height="40"
                  :src="`https://www.codewars.com/users/${solver.nick}/badges/large`"
                  :alt="`${solver.nick} profile on codewars`"
            /></a>
         </div>
         <div v-if="solver.about" class="solver-info__about">
            <hr class="solver-info__hr" />
            <h3 class="solver-info__sub-title">Дополнительная информация</h3>
            <pre>{{ solver.about }}</pre>
         </div>
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
   </div>
</template>

<script lang="ts">
import {
   defineComponent,
   provide,
   ref,
   useMeta,
   useRoute,
} from '@nuxtjs/composition-api'
import { Context } from '@nuxt/types'
import { usePaginator } from '~/helpers/paginator'
import { SearchConfig, useFilterKatas } from '~/helpers/filteredKatas'
import { useKatas } from '~/helpers/publicKatas'

export default defineComponent({
   validate(ctx: Context): Promise<boolean> | boolean {
      const id = ctx.route.params?.id
      return typeof id === 'string' && /^[0-9a-f]+$/.test(id)
   },

   setup() {
      provide('canEdit', false)
      const route = useRoute()

      const { katas, solver, usedLanguages, usedTags } = useKatas(
         route.value.params.id
      )
      useMeta({
         title:
            'Решенные задачи с на Codewars пользователя ' + solver.value.nick,
      })

      const {
         filteredKatas,
         searchParams,
         setSearchParams,
         resetSearchParams,
      } = useFilterKatas(katas)

      const { currentPageItems, changePage, paginatorData } =
         usePaginator(filteredKatas)

      const topPaginator = ref<HTMLElement | null>(null)

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

      const searchKata = (config: SearchConfig, override = false) => {
         setSearchParams(config, override)
      }

      return {
         currentPageItems,
         solver,
         topPaginator,
         paginatorData,
         searchParams,
         onPageChange,
         searchKata,
         resetSearchParams,
         usedTags,
         usedLanguages,
      }
   },
   async asyncData(ctx: Context) {
      const { loadKatas } = useKatas(ctx.params.id)
      const result = await loadKatas()
      if ([1, 2, 3, 4].includes(result?.response?.data?.error_code)) {
         ctx.error({
            statusCode: 404,
            message: result?.response?.data?.error,
         })
      } else if (result?.katas === undefined) {
         ctx.error({
            statusCode: 500,
            message: 'Ошибка загрузки',
         })
      }
      return true
   },

   head: {},
})
</script>
<style lang="scss" scoped>
.edit-page {
   padding: 40px 0;
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

   &__reset-filter {
      border-bottom: 1px dashed #fff;
      cursor: pointer;
   }
}

.solver-info {
   &__header {
      text-align: center;
   }

   &__title {
      font-size: 1.4em;
      font-weight: 600;
      margin-bottom: 0.5em;

      @include xs-block() {
         font-size: 1em;
      }
   }

   &__sub-title {
      font-size: 1em;
      margin-bottom: 0.5em;
      font-weight: 600;
   }

   &__about {
      margin: 0.5em auto 0;
      width: 90%;

      pre {
         white-space: pre-wrap;
         line-height: 1.2;
         font-family: $font_roboto;
         font-size: 14px;
      }
   }

   &__hr {
      @include hr;
   }
}

.info-panel {
   &--center {
      text-align: center;
   }

   &__paragraph {
      & + & {
         margin-top: 1em;
      }

      &--center {
         text-align: center;
      }

      &--right {
         text-align: right;
      }
   }
}

.katas-list {
   &__item {
      margin: 20px auto;
      max-width: $panel_width;
   }
}
</style>
