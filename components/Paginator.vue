<template>
   <ul v-if="data.maxPage > 1" class="paginator">
      <li
         class="paginator__page paginator__page--first"
         @click="onClickPage(1)"
      ></li>
      <li
         class="paginator__page paginator__page--left"
         @click="clickPrevPage"
      ></li>

      <li
         v-for="page in pages"
         :key="page"
         class="paginator__page"
         :class="{ 'paginator__page--active': page === data.currentPage }"
         @click="onClickPage(page)"
      >
         {{ page }}
      </li>

      <li
         class="paginator__page paginator__page--right"
         @click="clickNextPage"
      ></li>
      <li
         class="paginator__page paginator__page--last"
         @click="onClickPage(data.maxPage)"
      ></li>
   </ul>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { Paginate } from '~/helpers/paginator'

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

      const clickPrevPage = () => {
         onClickPage(Math.max(props.data.currentPage - 1, 1))
      }

      const clickNextPage = () => {
         onClickPage(Math.min(props.data.currentPage + 1, props.data.maxPage))
      }

      const pages = computed(() => {
         const paginatorPageLimit = 7
         const { maxPage, currentPage } = props.data
         const maxShowPage = Math.min(maxPage, paginatorPageLimit)

         let leftEdge = currentPage - Math.floor((maxShowPage - 1) / 2)
         let rightEdge = currentPage + Math.ceil((maxShowPage - 1) / 2)

         if (leftEdge <= 1) {
            leftEdge = 1
            rightEdge = maxShowPage
         } else if (rightEdge >= maxPage) {
            leftEdge = maxPage - maxShowPage + 1
            rightEdge = maxPage
         }
         return [...Array(maxShowPage).keys()].map((i) => i + leftEdge)
      })

      return {
         onClickPage,
         clickPrevPage,
         clickNextPage,
         pages,
      }
   },
})
</script>

<style lang="scss" scoped>
.paginator {
   $accent: #fff;

   display: flex;
   justify-content: center;
   font-family: $font_roboto;
   padding: 10px;
   border-radius: 1.5em;
   background-color: #262729;
   box-shadow: 0 3px 10px #000;
   &__page {
      display: block;
      text-align: center;
      vertical-align: middle;
      line-height: 2em;
      cursor: pointer;
      width: 2em;
      height: 2em;
      font-weight: 700;
      border: 1px solid transparent;
      transition: 0.3s ease-in-out;
      color: $accent;
      margin: 0 0.25em;
      user-select: none;

      &--left,
      &--right,
      &--first,
      &--last {
         background-image: url(~/assets/svg/left-page.svg);
         background-size: cover;
         background-position: center center;
         background-repeat: no-repeat;
         width: 1.6em;
      }

      &--first,
      &--last {
         background-image: url(~/assets/svg/last-page.svg);
      }

      &--right,
      &--first {
         transform: rotate(180deg);
      }

      &--active {
         background-color: $accent;
         color: #222;
         border-radius: 50%;
         @include xs-block() {
            border-radius: 8px;
         }
      }
   }
}
</style>
