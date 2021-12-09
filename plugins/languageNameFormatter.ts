import Vue from 'vue'
import { languageFormat } from '~/helpers/utils/langFormat'

Vue.filter('languageFormat', (languageName: string) => {
   return languageFormat(languageName)
})
