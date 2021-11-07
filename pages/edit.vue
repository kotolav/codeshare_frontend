<template>
   <div>
      <h1>Страница редактирования</h1>
      <kata-card :data="data" />
   </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
   setup() {
      const data = {
         title: 'Duplicate Encoder',
         rank: 5,
         tags: ['Алгоритмы', 'Строки', 'Массивы', 'Простые', 'Пазлы'],
         description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, aliquam, similique! Aliquam amet dolore esse molestiae, rem soluta unde vero.',
      }

      return {
         data,
      }
   },
})
</script>
<style lang="scss"></style>
