<template>
   <ul class="tags">
      <li v-for="tag in tags" :key="tag" class="tags__item">{{ tag }}</li>
   </ul>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
   props: {
      tags: {
         type: Array as () => string[],
         required: false,
         default: () => [],
      },
   },
})
</script>

<style lang="scss" scoped>
.tags {
   line-height: 1.2;
   &__item {
      display: inline-block;
      font-size: 10px;
      border-radius: 0.4em;
      padding: 0.4em 0.6em;
      text-transform: uppercase;
      background-color: $tag_bg_color;
      line-height: 1;
      vertical-align: bottom;
      //box-shadow: 0 0 4px #545454;

      &:not(:last-child) {
         margin-right: 0.5em;
      }
   }
}
</style>
