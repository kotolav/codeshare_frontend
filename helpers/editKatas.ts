import { ref } from '@nuxtjs/composition-api'
import { EditKata, EditSolution } from '~/types/types'
import {
   deleteSolutionComment,
   getAllKatas,
   hideKata as hideKataApi,
   setSolutionComment,
   setSolutionVisibility,
} from '~/api/editKata'
import {
   FindKata,
   FindSolution,
   getKataById,
   getSolutionById,
} from '~/helpers/kataUtils'

const katas = ref<EditKata[]>([])
const katasAreLoading = ref(false)

export function useEditKatas(editToken: string) {
   async function loadKatas() {
      katasAreLoading.value = true
      katas.value = await getAllKatas(editToken)
      katasAreLoading.value = false
   }

   const solutionToggling = ref(false)
   const solutionCommenting = ref(false)

   async function hideKata(ids: FindKata) {
      const kata = getKataById(katas.value, ids)
      if (kata === undefined) return
      try {
         await hideKataApi(editToken, ids.kataId)
         for (const solution of kata?.solutions) {
            solution.isShowing = false
         }
      } catch (error) {}
   }

   async function toggleSolution(ids: FindSolution, show: boolean) {
      const solution = getSolutionById(katas.value, ids)
      if (solution === undefined) return

      solutionToggling.value = true
      try {
         const response = await setSolutionVisibility(
            editToken,
            ids.kataId,
            ids.solutionId,
            show
         )
         solution.isShowing = show
      } catch (error) {}
      solutionToggling.value = false
   }

   async function setComment(ids: FindSolution, comment: string | null) {
      const solution = getSolutionById(katas.value, ids)
      if (solution === undefined) return
      try {
         solutionCommenting.value = true
         let response
         if (comment === null) {
            response = await deleteSolutionComment(
               editToken,
               ids.kataId,
               ids.solutionId
            )
         } else {
            response = await setSolutionComment(
               editToken,
               ids.kataId,
               ids.solutionId,
               comment
            )
         }
         solution.comment = comment
         solutionCommenting.value = false
         return true
      } catch (error) {
         return false
      }
   }

   return {
      katas,
      katasAreLoading,
      loadKatas,
      toggleSolution,
      setComment,
      solutionToggling,
   }
}
