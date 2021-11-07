<template>
   <header class="header">
      <div class="header__content">
         <kata-rank :rank="rank" />
         <h4 class="title">{{ title }}</h4>
      </div>
      <div class="header__tags">
         <kata-tags-list :tags="tags" />
      </div>
   </header>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { KataRank } from '~/types/types'

export default defineComponent({
   props: {
      title: {
         type: String,
         required: true,
      },
      rank: {
         type: [Number, String] as PropType<KataRank>,
         required: true,
      },
      tags: {
         type: Array as PropType<string[]>,
         required: true,
      },
   },
})
</script>

<style lang="scss">
.header {
   &__content {
      display: flex;
      align-items: center;
   }

   &__tags {
      margin-top: 5px;
   }
}
.title {
   display: inline-block;
   font-size: 18px;
   color: $default_text;
   margin-left: 0.75em;
}
</style>
