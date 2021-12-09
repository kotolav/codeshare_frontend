import {
   computed,
   Ref,
   ref,
   useRoute,
   useRouter,
} from '@nuxtjs/composition-api'

export interface Paginate {
   currentPage: number
   itemsPerPage: number
   maxPage: number
}

const itemsPerPage = ref(10)

export function usePaginator<T>(targetList: Ref<T[]>) {
   const route = useRoute()
   const router = useRouter()

   const currentPage = computed(() => {
      const queryPage = route.value.query?.page
      let page = 1
      if (typeof queryPage === 'string') {
         const parsedPage = parseInt(queryPage)
         if (Number.isInteger(parsedPage)) {
            page = parsedPage
         }
      }

      return page
   })

   const maxPage = computed(() =>
      Math.ceil(targetList.value.length / itemsPerPage.value)
   )

   /**
    * Paginator state
    */
   const paginatorData = computed<Paginate>(() => {
      return {
         currentPage: currentPage.value,
         itemsPerPage: itemsPerPage.value,
         maxPage: maxPage.value,
      }
   })

   const itemsRange = computed(() => {
      const indexPage = currentPage.value - 1
      const itemsOnPage = itemsPerPage.value
      return {
         startItem: itemsOnPage * indexPage,
         endItem: itemsOnPage * indexPage + itemsOnPage,
      }
   })

   /**
    * Set items amount showing on a page
    * @param itemsCount
    */
   const setItemsPerPage = (itemsCount: number) => {
      itemsPerPage.value = itemsCount
   }

   /**
    * Change current page
    * @param page
    */
   function changePage(page: number) {
      router.push({
         query: { ...route.value.query, page: page.toString() },
      })
   }

   /**
    * List of items correspond to current page
    */
   const currentPageItems = computed<T[]>(() => {
      const range = itemsRange.value
      return targetList.value.slice(range.startItem, range.endItem)
   })

   return {
      paginatorData,
      changePage,
      setItemsPerPage,
      currentPageItems,
   }
}
