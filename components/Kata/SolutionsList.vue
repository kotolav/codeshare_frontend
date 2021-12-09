<template>
   <div class="solution-list">
      <div
         v-for="(solutionsList, language) in langSolutions"
         :key="language"
         class="language"
      >
         <h3 class="language__title">{{ language | languageFormat }}</h3>
         <kata-solution
            v-for="(solution, i) in solutionsList"
            :key="solution.id"
            :solution="solution"
            :variant-number="solutionsList.length > 1 ? i + 1 : null"
            class="solution-list__item"
         />
      </div>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import groupBy from 'lodash/groupBy'
import { EditSolution } from '~/types/types'

export default defineComponent({
   props: {
      solutions: {
         type: Array as PropType<EditSolution[]>,
         required: true,
      },
   },

   setup(props) {
      const langSolutions = computed(() =>
         groupBy(props.solutions, (s: EditSolution) => s.language)
      )

      return {
         langSolutions,
      }
   },
})
</script>

<style lang="scss" scoped>
.solution-list {
   &__item:not(:last-child) {
      margin-bottom: 16px;
   }
}

.language {
   &:not(:last-child) {
      margin-bottom: 1.5em;
   }

   &__title {
      color: $default_text;
      font-size: 15px;
      margin: 1.5em 0 0.25em;

      &:first-child {
         margin-top: 0;
      }
   }
}
</style>
