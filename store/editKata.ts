import { GetterTree, ActionTree, MutationTree } from 'vuex'
import Vue from 'vue'
import { EditKata, EditSolution, Kata } from '~/types/types'
import {
   deleteSolutionComment,
   getAllKatas,
   hideKata,
   setSolutionComment,
   setSolutionVisibility,
} from '~/api/editKata'

export interface Paginate {
   currentPage: number
   itemsPerPage: number
   maxPage: number
}

export interface SearchParams {
   text: string
}

export interface EditKataList {
   katasList: EditKata[]
   paginator: Paginate
   searchParams: SearchParams
}

export const state = (): EditKataList => ({
   katasList: [],
   paginator: {
      currentPage: 1,
      itemsPerPage: 15,
      maxPage: 1,
   },
   searchParams: {
      text: '',
   },
})

export type EditKataRootState = ReturnType<typeof state>

interface SolutionSeekParams {
   token: string
   kataId: EditKata['id']
   solutionId: EditSolution['id']
}

export const mutations: MutationTree<EditKataRootState> = {
   setKatas(state, payload: EditKata[]) {
      state.katasList = payload
   },

   setVisibility(state, kata: SolutionSeekParams & { visibility: boolean }) {
      const solution = findKataSolutionById(state, kata.kataId, kata.solutionId)
      if (solution !== undefined) {
         solution.isShowing = kata.visibility
      }
   },

   setCommentEditing(state, kata: SolutionSeekParams & { isEditing: boolean }) {
      const solution = findKataSolutionById(state, kata.kataId, kata.solutionId)
      if (solution !== undefined) {
         Vue.set(solution, 'isEditingComment', kata.isEditing)
      }
   },

   setComment(state, kata: SolutionSeekParams & { comment: string }) {
      const solution = findKataSolutionById(state, kata.kataId, kata.solutionId)
      if (solution !== undefined) {
         Vue.set(solution, 'comment', kata.comment)
         Vue.set(solution, 'isEditingComment', true)
      }
   },

   deleteComment(state, kata: SolutionSeekParams) {
      const solution = findKataSolutionById(state, kata.kataId, kata.solutionId)
      if (solution !== undefined) {
         solution.comment = null
         Vue.set(solution, 'isEditingComment', null)
      }
   },

   hideKata(state, kata: { kataId: EditKata['id'] }) {
      const targetKata = findKataById(state, kata.kataId)
      if (targetKata !== undefined) {
         for (const solution of targetKata?.solutions) {
            solution.isShowing = false
         }
      }
   },

   setPage(state, page: number) {
      state.paginator.currentPage = page
   },

   setMaxPage(state, page: number) {
      state.paginator.maxPage = page
   },

   setSearchText(state, text: string) {
      state.searchParams.text = text
   },
}

export const actions: ActionTree<EditKataRootState, EditKataRootState> = {
   async loadKatas({ commit, state }, kataId: EditKata['id']) {
      try {
         let katas = await getAllKatas(kataId)
         katas = sortKatasByNewestSolution(katas)
         commit('setKatas', katas)
         commit(
            'setMaxPage',
            Math.ceil(katas.length / state.paginator.itemsPerPage)
         )
         return true
      } catch (error) {
         return error
      }
   },

   async toggleSolutionVisibility(
      { commit },
      payload: SolutionSeekParams & { visibility: boolean }
   ) {
      await setSolutionVisibility(
         payload.token,
         payload.kataId,
         payload.solutionId,
         payload.visibility
      )
      commit('setVisibility', payload)
   },

   async saveComment(
      { commit, dispatch },
      payload: SolutionSeekParams & { comment: string }
   ) {
      const { kataId, solutionId } = payload
      commit('setComment', payload)
      dispatch('setCommentEditing', { kataId, solutionId, isEditing: false })
      await setSolutionComment(
         payload.token,
         payload.kataId,
         payload.solutionId,
         payload.comment
      )
   },

   setCommentEditing(
      { commit },
      payload: SolutionSeekParams & { isEditing: boolean }
   ) {
      commit('setCommentEditing', payload)
   },

   async deleteComment({ commit }, payload: SolutionSeekParams) {
      commit('deleteComment', payload)
      await deleteSolutionComment(
         payload.token,
         payload.kataId,
         payload.solutionId
      )
   },

   async hideKata({ commit }, payload: SolutionSeekParams) {
      commit('hideKata', payload)
      await hideKata(payload.token, payload.kataId)
   },

   changePage({ commit }, page: number) {
      commit('setPage', page)
   },

   runSearch({ commit }, text: string) {
      commit('setSearchText', text)
   },
}

export const getters: GetterTree<EditKataRootState, EditKataRootState> = {
   allItems: (state: EditKataRootState) => state.katasList,
   searchItems: (state: EditKataRootState) => {
      let items = state.katasList
      const searchText = state.searchParams.text.toLowerCase()
      if (searchText.length > 0) {
         items = state.katasList.filter((kata) => {
            return (
               kata.name.toLowerCase().includes(searchText) ||
               kata.description.toLowerCase().includes(searchText)
            )
         })
      }
      return items
   },
   filteredItems: (state: EditKataRootState, getters) => {
      const startItem =
         state.paginator.currentPage * state.paginator.itemsPerPage
      const endItem = startItem + state.paginator.itemsPerPage
      return getters.searchItems.slice(startItem, endItem)
   },
   paginator: (state: EditKataRootState, getters) => {
      const maxPage = Math.ceil(
         getters.filteredPageCount / state.paginator.itemsPerPage
      )
      return { ...state.paginator, ...{ maxPage } }
   },
   filteredPageCount: (state: EditKataRootState, getters) =>
      getters.searchItems.length,
   solutionsLanguages: (state: EditKataRootState) => {
      const languages = state.katasList.map((kata) => {
         return kata.solutions.map((solution) => solution.language)
      })
      return [...new Set(languages.flat())]
   },
}

function sortKatasByNewestSolution(katas: EditKata[]): EditKata[] {
   const newestSolutionTime = (kata: EditKata): number => {
      return Math.max(...kata.solutions.map((s) => s.solvedAt))
   }
   return katas.sort(
      (a: EditKata, b: EditKata) =>
         newestSolutionTime(b) - newestSolutionTime(a)
   )
}

function findKataById(
   state: EditKataList,
   kataId: EditKata['id']
): EditKata | undefined {
   return state.katasList.find((k) => k.id === kataId)
}

function findKataSolutionById(
   state: EditKataList,
   kataId: Kata['id'],
   solutionId: EditSolution['id']
): EditSolution | undefined {
   const foundKata = findKataById(state, kataId)
   if (foundKata !== undefined) {
      return foundKata.solutions.find((s) => s.id === solutionId)
   }

   return undefined
}
