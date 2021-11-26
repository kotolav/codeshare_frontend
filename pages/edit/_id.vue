<template>
   <div class="edit-page">
      <h1>Страница редактирования</h1>
      <filter-panel />
      <input v-model="searchText" type="text" @keydown.enter="searchKata" />
      <paginator :data="paginatorData" @pageChange="onPageChange" />
      <div class="katas-list">
         <kata-card
            v-for="data in actualItems"
            :key="data.id"
            :data="data"
            class="katas-list__item"
         />
      </div>
      <paginator :data="paginatorData" @pageChange="onPageChange" />
   </div>
</template>

<script lang="ts">
import {
   computed,
   defineComponent,
   provide,
   ref,
   useRoute,
   useRouter,
   useStore,
   watch,
} from '@nuxtjs/composition-api'
import { Context } from '@nuxt/types'
import { EditKata } from '~/types/types'
import { EditKataRootState } from '~/store/editKata'
import { useEditKatas } from '~/helpers/editKatas'

export default defineComponent({
   validate(ctx: Context): Promise<boolean> | boolean {
      const id = ctx.route.params?.id
      return typeof id === 'string' && /^[0-9a-f]+$/.test(id)
   },

   setup() {
      provide('canEdit', true)
      const store = useStore<EditKataRootState>()
      const route = useRoute()
      const router = useRouter()
      const searchText = ref('')

      const paginatorData = computed(() => store.getters['editKata/paginator'])
      const usedLanguages = computed(
         () => store.getters['editKata/solutionsLanguages']
      )

      const onPageChange = (page: Number) => {
         router.push({ query: { ...route.value.query, page: page.toString() } })
      }

      const searchKata = () => {
         router.push({
            query: { ...route.value.query, search: searchText.value },
         })
      }

      watch(
         () => route.value.query?.search,
         () => {
            const querySearchPhrase = route.value.query?.search
            const searchPhrase =
               typeof querySearchPhrase === 'string' ? querySearchPhrase : ''
            onPageChange(1)
            searchText.value = searchPhrase
            store.dispatch('editKata/runSearch', searchPhrase)
         }
      )

      watch(
         () => route.value.query?.page,
         () => {
            const routePage =
               typeof route.value.query?.page === 'string'
                  ? parseInt(route.value.query?.page)
                  : undefined
            const page =
               ((Number.isInteger(routePage) ? routePage : 1) as number) - 1
            store.dispatch('editKata/changePage', page)
         }
      )

      const editKatas = useEditKatas(route.value.params.id)
      ;(async () => {
         await editKatas.loadKatas()
         console.log(editKatas.katas)
      })()

      const actualItems = computed<EditKata[]>(
         () => store.getters['editKata/filteredItems']
      )

      return {
         actualItems,
         paginatorData,
         usedLanguages,
         onPageChange,
         searchText,
         searchKata,
      }
   },
   async asyncData(ctx: Context) {
      return await ctx.store.dispatch('editKata/loadKatas', ctx.params.id)
   },
})
</script>
<style lang="scss">
.edit-page {
   padding: 20px 0;
   background-color: #4158d0;
   background-image: linear-gradient(
      43deg,
      #4158d0 0%,
      #c850c0 46%,
      #ffcc70 100%
   );
   background-attachment: fixed;
}

.katas-list {
   &__item {
      margin: 20px auto;
      max-width: 700px;
   }
}
</style>
