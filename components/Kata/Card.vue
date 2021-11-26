<template>
   <article class="kata">
      <kata-header :name="data.name" :rank="data.rank" :tags="data.tags" />
      <div class="kata__content">
         <kata-describe
            :description="data.description"
            :used-languages="solutionLanguages"
         />
         <kata-actions
            :is-visible-solutions="isVisibleSolutions"
            :kata-id="data.id"
         />
         <hr class="kata__hr" />
         <kata-solutions-list :solutions="data.solutions" />
      </div>
      <kata-footer></kata-footer>
   </article>
</template>

<script lang="ts">
import { computed, defineComponent, provide } from '@nuxtjs/composition-api'
import { EditKata } from '~/types/types'

export default defineComponent({
   props: {
      data: {
         type: Object as () => EditKata,
         required: true,
      },
   },

   setup(props) {
      provide('kataId', props.data.id)

      const visibleSolutions = computed(() => {
         return props.data.solutions.filter((solution) => solution.isShowing)
      })

      const solutionLanguages = computed<string[]>(() => [
         ...new Set(props.data.solutions.map((s) => s.language)),
      ])

      const isVisibleSolutions = computed(
         () => visibleSolutions.value.length > 0
      )

      return {
         visibleSolutions,
         solutionLanguages,
         isVisibleSolutions,
      }
   },
})
</script>

<style scoped lang="scss">
.kata {
   padding: 20px;
   border-radius: 5px;
   background-color: #262729;
   color: $default_text;
   font-family: 'Lato', sans-serif;
   line-height: 1.5;
   box-shadow: 0 1px 12px 3px rgba(0, 0, 0, 0.92);
   border: 1px solid #222;

   &__content {
      margin-top: 15px;
   }

   &__hr {
      border: none;
      height: 1px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.13);
      margin: 20px 0;
   }
}
</style>
