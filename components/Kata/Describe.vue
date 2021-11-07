<template>
   <div class="description">{{ description }}</div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
   props: {
      description: {
         type: String,
         required: true,
      },
   },
})
</script>

<style lang="scss">
.description {
   font-size: 16px;
   color: $default_text;
}
</style>
