<template>
   <div class="comment">
      <textarea-autosize
         ref="textArea"
         v-model="textModel"
         class="comment__form"
         placeholder="Добавьте комментарий к решению"
         @click.native="onClick"
      ></textarea-autosize>
      <div v-if="isEditing" class="comment__footer">
         <button class="comment__button" @click="saveComment">Сохранить</button>
         <button class="comment__button" @click="deleteComment">Удалить</button>
      </div>
   </div>
</template>

<script lang="ts">
import {
   ref,
   inject,
   defineComponent,
   nextTick,
   useStore,
   useRoute,
} from '@nuxtjs/composition-api'
import { EditKataRootState } from '~/store/editKata'
import { EditKata, EditSolution } from '~/types/types'

export default defineComponent({
   props: {
      comment: {
         type: String,
         required: false,
         default: '',
      },
      isEditing: {
         type: Boolean,
         required: false,
         default: false,
      },
   },

   setup(props, context) {
      const solutionId = inject<EditSolution['id']>('solutionId')
      const kataId = inject<EditKata['id']>('kataId')
      const textArea = ref<any | null>(null)
      const store = useStore<EditKataRootState>()
      const route = useRoute()
      const textModel = ref(props.comment)

      const saveComment = () => {
         store.dispatch('editKata/saveComment', {
            token: route.value.params.id,
            kataId,
            solutionId,
            comment: textModel.value,
         })
      }

      const onClick = () => {
         if (!props.isEditing) {
            context.emit('onTextareaClick')
         }
      }

      const deleteComment = () => {
         textModel.value = ''
         store.dispatch('editKata/deleteComment', {
            token: route.value.params.id,
            kataId,
            solutionId,
         })
      }

      const setFocus = () => {
         if (textArea.value !== null) {
            nextTick(() => textArea.value.$el.focus())
         }
      }

      return {
         saveComment,
         deleteComment,
         setFocus,
         onClick,
         textArea,
         textModel,
      }
   },
})
</script>

<style lang="scss" scoped>
.comment {
   &__form {
      display: block;
      box-sizing: border-box;
      font-family: 'Roboto', sans-serif;
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

      &:focus {
         color: $comment_text;
         border-color: #767676;
      }
   }

   &__button {
      background-color: rgba(0, 0, 0, 0.4);
      border: 1px solid #303030;
      color: $gray_text;
      font-size: 14px;
      border-radius: 0.4em;
      padding: 0.5em 1em;
      cursor: pointer;
      transition: background-color, color 0.2s ease-in-out;

      &:not(:last-child) {
         margin-right: 5px;
      }

      &:hover {
         //background-color: rgba(0, 0, 0, 0.2);
         color: $default_text;
      }

      &:active {
         transform: translateY(1px);
         transition-duration: 0.1s;
         background-color: rgba(0, 0, 0, 0.6);
      }
   }

   &__footer {
      margin-top: 3px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
   }
}
</style>
