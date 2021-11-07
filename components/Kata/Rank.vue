<template>
   <span class="rank" :class="'rank--' + rank">{{ rankText }}</span>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { KataRank } from '~/types/types'

export default defineComponent({
   props: {
      rank: {
         type: [Number, String] as PropType<KataRank>,
         required: true,
      },
   },

   setup(props) {
      const rankText = computed(() => {
         if (typeof props.rank === 'number') {
            return `${props.rank} kyu`
         } else {
            return 'beta'
         }
      })

      return {
         rankText,
      }
   },
})
</script>

<style lang="scss" scoped>
.rank {
   display: inline-block;
   white-space: nowrap;
   border: 2px solid transparent;
   border-radius: 5px;
   padding: 0.18em 0.33em;
   font-size: 12px;
   font-weight: 700;
   background-color: $kata_rank_bg;

   @each $type, $color in $kata_rank {
      @each $type_val in $type {
         &--#{$type_val} {
            border-color: $color;
            color: $color;
         }
      }
   }
}
</style>
