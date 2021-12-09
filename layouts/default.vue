<template>
   <div class="page">
      <Nuxt />
   </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
   setup() {},
})
</script>

<style lang="scss" scoped>
.page {
   background-color: #4158d0;
   background-image: linear-gradient(
      43deg,
      #4158d0 0%,
      #c850c0 46%,
      #ffcc70 100%
   );
   background-attachment: fixed;
   min-height: 100vh;
}
</style>
