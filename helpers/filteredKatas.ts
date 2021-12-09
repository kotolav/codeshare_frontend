import { computed, Ref, useRoute, useRouter } from '@nuxtjs/composition-api'
import { EditKata } from '~/types/types'

export enum SortVariant {
   Date = 'date',
   Rank = 'rank',
   CodeLength = 'length',
}

export interface SearchConfig {
   search: string
   sort: SortVariant
   direction: 'asc' | 'desc'
   language: string[]
   tags: string[]
}

export function useFilterKatas(katas: Ref<EditKata[]>) {
   const route = useRoute()
   const router = useRouter()

   const setSearchParams = (
      config: Partial<SearchConfig>,
      override = false
   ) => {
      const defaultSearchConfig: Partial<SearchConfig> = {
         sort: undefined,
         direction: undefined,
         language: undefined,
         tags: undefined,
         search: undefined,
      }
      const finalSearchConfig = override
         ? { ...defaultSearchConfig, ...config }
         : config
      router.push({
         query: {
            ...route.value.query,
            ...finalSearchConfig,
            page: undefined,
         },
      })
   }

   const searchParams = computed(() => {
      function isStringOrArray(val: unknown): val is string & string[] {
         return typeof val === 'string' || Array.isArray(val)
      }
      const search =
         typeof route.value.query.search === 'string'
            ? route.value.query.search
            : ''
      const sort = Object.values(SortVariant).includes(
         route.value.query.sort as SortVariant
      )
         ? (route.value.query.sort as SortVariant)
         : SortVariant.Date

      let direction: SearchConfig['direction'] = 'desc'
      if (
         typeof route.value.query.direction === 'string' &&
         route.value.query.direction === 'asc'
      ) {
         direction = 'asc'
      }

      const language = isStringOrArray(route.value.query.language)
         ? route.value.query.language
         : ''
      const tags = isStringOrArray(route.value.query.tags)
         ? route.value.query.tags
         : ''

      return {
         search,
         sort,
         direction,
         language,
         tags,
      }
   })

   function resetSearchParams() {
      setSearchParams({}, true)
   }

   /**
    * Filter katas array for given text contained in kata name or description
    * @param katas
    * @param search
    */
   function filterByText(katas: EditKata[], search: string): EditKata[] {
      const text = search.toLowerCase()
      if (text.length > 0) {
         return katas.filter((kata) => {
            return (
               kata.name.toLowerCase().includes(text) ||
               kata.description.toLowerCase().includes(text)
            )
         })
      }

      return katas
   }

   /**
    * Filter katas array for given solution language
    * @param katas
    * @param language
    */
   function filterByLanguage(
      katas: EditKata[],
      language: string | string[]
   ): EditKata[] {
      let search =
         typeof language === 'string'
            ? language !== ''
               ? [language]
               : []
            : language
      search = search.map((l) => l.toLowerCase())

      if (search.length > 0) {
         return katas.filter(
            (kata) =>
               kata.solutions.filter((s) =>
                  search.includes(s.language.toLowerCase())
               ).length > 0
         )
      }

      return katas
   }

   function filterByTags(
      katas: EditKata[],
      tags: string | string[]
   ): EditKata[] {
      tags = typeof tags === 'string' ? (tags !== '' ? [tags] : []) : tags
      if (tags && tags.length > 0) {
         tags = tags.map((t) => t.toLowerCase())
         return katas.filter(
            (kata) =>
               kata.tags.filter((t) => tags.includes(t.toLowerCase())).length
         )
      }
      return katas
   }

   function sortKatas(
      katas: EditKata[],
      sortType: SortVariant,
      direction: SearchConfig['direction']
   ): EditKata[] {
      // asc - min | desc - max
      const extremum = direction === 'asc' ? Math.min : Math.max
      const getDate = (kata: EditKata) =>
         extremum(...kata.solutions.map((s) => s.solvedAt))

      const getRank = (kata: EditKata) =>
         typeof kata.rank === 'number' ? kata.rank : 8

      const getCodeLen = (kata: EditKata) =>
         extremum(...kata.solutions.map((s) => s.codeLength))

      let comparer: (kata: EditKata) => number
      switch (sortType) {
         case SortVariant.Date:
            comparer = getDate
            break
         case SortVariant.CodeLength:
            comparer = getCodeLen
            break
         case SortVariant.Rank:
            comparer = getRank
            break
         default:
            comparer = getDate
      }

      const compareFunc =
         direction === 'asc'
            ? (a: EditKata, b: EditKata) => comparer(a) - comparer(b)
            : (a: EditKata, b: EditKata) => comparer(b) - comparer(a)
      return katas.sort(compareFunc)
   }

   const filteredKatas = computed(() => {
      let filtered = katas.value
      const config = searchParams.value

      filtered = filterByText(filtered, config.search)
      filtered = filterByLanguage(filtered, config.language)
      filtered = filterByTags(filtered, config.tags)
      filtered = sortKatas(filtered, config.sort, config.direction)

      return filtered
   })

   return {
      searchParams,
      setSearchParams,
      resetSearchParams,
      filteredKatas,
   }
}
