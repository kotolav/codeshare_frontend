import { computed, ssrRef } from '@nuxtjs/composition-api'
import { EditKata, Solver } from '~/types/types'
import { getData } from '~/api/publicKatas'
import { getUsedLanguages, getUsedTags } from '~/helpers/kataUtils'

const katas = ssrRef<EditKata[]>([])
const solver = ssrRef<Solver>({ nick: '' })
const dataIsLoading = ssrRef(false)

export function useKatas(publicToken: string) {
   async function loadKatas() {
      dataIsLoading.value = true
      const response = await getData(publicToken)
      katas.value = response.katas
      solver.value = response.solver
      dataIsLoading.value = false

      return response
   }

   const usedLanguages = computed(() => {
      return getUsedLanguages(katas.value)
   })

   const usedTags = computed(() => {
      return getUsedTags(katas.value)
   })

   return {
      katas,
      solver: computed(() => solver.value),
      loadKatas,
      dataIsLoading,
      usedLanguages,
      usedTags,
   }
}
