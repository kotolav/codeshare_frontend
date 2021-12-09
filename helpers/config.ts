import { computed, ref, useContext, watch } from '@nuxtjs/composition-api'

const filterPanelShowing = ref(true)
const editTokens = ref<string[]>(initEditTokens())

function initEditTokens() {
   if (process.client) {
      const tokens = JSON.parse(localStorage.getItem('editTokens') ?? '[]')
      return Array.isArray(tokens) ? tokens : []
   } else {
      return []
   }
}
export function useConfig() {
   const { $cookies } = useContext()

   watch(
      () => editTokens.value,
      (newTokenArray) => {
         localStorage.setItem('editTokens', JSON.stringify(newTokenArray))
      },
      { deep: true }
   )

   filterPanelShowing.value = $cookies.get('filterPanel') ?? true

   function setFilterPanelVisibility(show: boolean) {
      $cookies.set('filterPanel', show, { path: '/' })
      filterPanelShowing.value = show
   }

   const filterPanelIsShowing = computed(() => filterPanelShowing.value)

   function appendEditToken(token: string) {
      if (!editTokens.value.includes(token)) {
         editTokens.value.push(token)
      }
   }

   function removeEditToken(token: string) {
      const tokenIndex = editTokens.value.indexOf(token)
      if (tokenIndex > -1) {
         editTokens.value.splice(tokenIndex, 1)
      }
   }

   function applyNewEditToken(token: string) {
      $cookies.set('editToken', token, {
         maxAge: 60 * 60 * 24 * 365,
         path: '/',
      })
      if (token !== '') {
         appendEditToken(token)
      }
   }

   return {
      setFilterPanelVisibility,
      filterPanelIsShowing,
      editTokens,
      applyNewEditToken,
      appendEditToken,
      removeEditToken,
   }
}
