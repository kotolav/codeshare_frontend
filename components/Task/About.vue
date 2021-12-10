<template>
   <div class="about-solver">
      <textarea-autosize
         v-model="aboutModel"
         class="about-solver__textarea"
         placeholder="Добавьте информацию о себе"
         @input.native="showButtons = true"
         @click.native="showButtons = true"
      ></textarea-autosize>
      <div v-show="showButtons" class="about-solver__footer">
         <button class="about-solver__button" @click="save">Сохранить</button>
         <button class="about-solver__button" @click="erase">Удалить</button>
      </div>
   </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'

export default defineComponent({
   props: {
      about: {
         type: String,
         required: false,
         default: '',
      },
   },
   emits: ['save'],

   setup(props, context) {
      const aboutModel = ref(props.about)
      const showButtons = ref(false)

      function save() {
         context.emit('save', aboutModel.value)
         showButtons.value = false
      }

      function erase() {
         context.emit('save', '')
         showButtons.value = false
      }

      watch(
         () => props.about,
         () => {
            aboutModel.value = props.about
         },
         { deep: true }
      )

      return {
         aboutModel,
         showButtons,
         save,
         erase,
      }
   },
})
</script>

<style lang="scss" scoped>
.about-solver {
   &__textarea {
      display: block;
      box-sizing: border-box;
      font-family: $font_roboto;
      border-radius: 0.3em;
      width: 100%;
      min-height: 3em;
      background-color: rgba(0, 0, 0, 0.4);
      border-color: #303030;
      padding: 0.6em 0.75em;
      font-size: 14px;
      color: $gray_text;
      resize: none;
      outline: none;
      transition: 0.3s ease-in-out;
   }

   &__footer {
      margin-top: 3px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
   }

   &__button {
      @include standardButton;
   }
}
</style>
