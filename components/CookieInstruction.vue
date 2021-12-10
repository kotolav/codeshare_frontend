<template>
   <div class="instruction">
      <div v-if="!isShowing" class="instruction__spoiler" @click="toggle(true)">
         <span class="instruction__clickable"
            >Инструкция получения Cookies</span
         >
      </div>
      <div v-else class="instruction__content">
         <span
            class="instruction__switch instruction__clickable"
            @click="toggle(false)"
            >Скрыть</span
         >
         <p>На примере браузера Chrome:</p>
         <ol>
            <li>Авторизуйтесь на сайте Codewars</li>
            <li>Перейдите в консоль разработчика нажав F12</li>
            <li>Откройте вкладку Network</li>
            <li>Нажмите F5</li>
            <li>
               Кликните на любом запросе, который отправляется на сайт
               codewars.com
            </li>
            <li>В открывшейся панели выберите Headers</li>
            <li>В разделе Request Headers найдите значение параметра cookie</li>
            <li>
               Скопируйте всю строку целиком, кроме "cookie:" и вставьте в поле
               ниже
            </li>
         </ol>
      </div>
   </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
   setup() {
      const isShowing = ref(false)
      const toggle = (state: boolean) => (isShowing.value = state)

      return {
         isShowing,
         toggle,
      }
   },
})
</script>

<style lang="scss">
.instruction {
   padding: 0.7em;
   background-color: #171719;
   border-radius: 6px;

   &__spoiler {
      text-align: center;
      padding: 0 0.6em;
   }

   &__clickable {
      cursor: pointer;
      border-bottom: 1px dashed currentColor;
   }

   &__content {
      position: relative;
   }

   &__switch {
      position: absolute;
      top: 0;
      right: 10px;
   }
}
</style>
