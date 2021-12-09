import { computed, ref, set, ssrRef } from '@nuxtjs/composition-api'
import { EditKata } from '~/types/types'
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
   getUsedLanguages,
   getUsedTags,
} from '~/helpers/kataUtils'

const katas = ssrRef<EditKata[]>([])
const token = ssrRef('')
const katasAreLoading = ssrRef(false)

export function useEditKatas(rawEditToken: string) {
   if (rawEditToken) {
      token.value = rawEditToken
   }
   const editToken = token.value

   async function loadKatas() {
      katasAreLoading.value = true
      try {
         katas.value = await getAllKatas(editToken)
      } catch (error) {
         katas.value = []
      } finally {
         katasAreLoading.value = false
      }
   }

   const solutionIsToggling = ref(false)
   const solutionIsCommenting = ref(false)

   async function hideKata(ids: FindKata) {
      const kata = getKataById(katas.value, ids)
      if (kata === undefined) return
      try {
         solutionIsToggling.value = true
         await hideKataApi(editToken, ids.kataId)
         for (const solution of kata?.solutions) {
            solution.isShowing = false
         }
      } catch (error) {
      } finally {
         solutionIsToggling.value = false
      }
   }

   async function toggleSolution(ids: FindSolution, show: boolean) {
      const solution = getSolutionById(katas.value, ids)
      if (solution === undefined) return

      solutionIsToggling.value = true
      const originalState = solution.isShowing
      try {
         solution.isShowing = show
         const response = await setSolutionVisibility(
            editToken,
            ids.kataId,
            ids.solutionId,
            show
         )
      } catch (error) {
         // если ошибка от api, вернуть состояние назад
         solution.isShowing = originalState
      } finally {
         solutionIsToggling.value = false
      }
   }

   async function setComment(ids: FindSolution, comment: string) {
      const solution = getSolutionById(katas.value, ids)
      if (solution === undefined) return
      const originalState = {
         comment: solution?.comment,
         isEditing: solution?.isEditingComment,
      }
      try {
         solutionIsCommenting.value = true
         set(solution, 'comment', comment)
         setCommentEditState(ids, false)
         const response = await setSolutionComment(
            editToken,
            ids.kataId,
            ids.solutionId,
            comment
         )
      } catch (error) {
         set(solution, 'comment', originalState.comment)
         setCommentEditState(ids, !!originalState.isEditing)
      } finally {
         solutionIsCommenting.value = false
      }
   }

   async function deleteComment(ids: FindSolution) {
      const solution = getSolutionById(katas.value, ids)
      if (solution === undefined) return

      const originalState = {
         comment: solution?.comment,
         isEditing: solution?.isEditingComment,
      }
      try {
         solutionIsCommenting.value = true
         set(solution, 'comment', null)
         setCommentEditState(ids, false)
         const response = await deleteSolutionComment(
            editToken,
            ids.kataId,
            ids.solutionId
         )
      } catch (error) {
         set(solution, 'comment', originalState.comment)
         setCommentEditState(ids, !!originalState.isEditing)
      } finally {
         solutionIsCommenting.value = false
      }
   }

   function setCommentEditState(ids: FindSolution, isEditing: boolean) {
      const solution = getSolutionById(katas.value, ids)
      if (solution === undefined) return
      set(solution, 'isEditingComment', isEditing)
   }

   const usedLanguages = computed(() => {
      return getUsedLanguages(katas.value)
   })

   const usedTags = computed(() => {
      return getUsedTags(katas.value)
   })

   return {
      katas,
      katasAreLoading,
      loadKatas,
      hideKata,
      toggleSolution,
      setComment,
      deleteComment,
      setCommentEditState,
      solutionIsToggling,
      usedLanguages,
      usedTags,
   }
}
