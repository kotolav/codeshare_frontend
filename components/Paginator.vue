<template>
   <ul class="paginator">
      <li
         v-for="(page, i) in data.maxPage"
         :key="page"
         class="paginator__page"
         :class="{ 'paginator__page--active': i === data.currentPage }"
         @click="onClickPage(page)"
      >
         {{ page }}
      </li>
   </ul>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { Paginate } from '~/store/editKata'

export default defineComponent({
   props: {
      data: {
         type: Object as () => Paginate,
         required: true,
      },
   },
   emits: ['pageChange'],

   setup(props, context) {
      const onClickPage = (page: number) => {
         context.emit('pageChange', page)
      }

      return {
         onClickPage,
      }
   },
})
</script>

<style lang="scss" scoped>
.paginator {
   display: flex;
   &__page {
      display: block;
      padding: 5px;
      cursor: pointer;
      &--active {
         font-weight: bold;
         border: 1px solid #000;
      }
   }
}
</style>
