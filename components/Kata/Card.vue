<template>
   <article class="kata">
      <kata-header :title="data.title" :rank="data.rank" :tags="data.tags" />
      <div class="kata__content">
         <kata-describe :description="data.description" />
         <hr class="kata__hr" />
         <kata-solutions-list />
      </div>
      <kata-footer></kata-footer>
   </article>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { Kata } from '~/types/types'

export default defineComponent({
   props: {
      data: {
         type: Object as () => Kata,
         required: true,
      },
   },
})
</script>

<style scoped lang="scss">
.kata {
   padding: 20px;
   margin: 20px;
   border-radius: 5px;
   background-color: #262729;
   color: $default_text;
   font-family: 'DM Sans', sans-serif;
   line-height: 1.5;

   &__content {
      margin-top: 15px;
      margin-bottom: 15px;
   }

   &__hr {
      border: none;
      height: 1px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.13);
      margin: 20px 0;
   }
}
</style>
