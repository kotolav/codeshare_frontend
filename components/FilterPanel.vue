<template>
   <div class="panel">
      <div class="panel__row">
         <label for="search-input">Поиск</label>
         <input id="search-input" type="text" class="panel__search" />
      </div>
      <div class="panel__row">
         Сортировать
         <ul class="sort">
            <li class="sort__item">по дате</li>
            <li class="sort__item">по сложности</li>
            <li class="sort__item">по длине кода</li>
         </ul>
      </div>
   </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { KataRank } from '~/types/types'

export default defineComponent({
   props: {
      // rank: {
      //    type: [Number, String] as PropType<KataRank>,
      //    required: true,
      // },
   },

   setup(props) {},
})
</script>

<style lang="scss" scoped>
.panel {
   max-width: 700px;
   margin: 0 auto;
   background-color: #262729;
   padding: 20px;
   border-radius: 6px;
   color: $default_text;

   &__row {
   }

   &__search {
      display: block;
      width: 100%;
      font-size: 20px;
      padding: 0.2em 0.2em;
   }
}

.sort {
   display: inline-flex;
   margin-left: 1em;
   &__item {
      cursor: pointer;
      &:not(:last-child) {
         margin-right: 1.5em;
      }
   }
}
</style>
