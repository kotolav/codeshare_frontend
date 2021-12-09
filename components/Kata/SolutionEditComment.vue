<template>
   <div class="comment">
      <template v-if="canEdit">
         <textarea-autosize
            ref="textArea"
            v-model="textModel"
            class="comment__form"
            placeholder="Добавьте комментарий к решению"
            @click.native="onClick"
         ></textarea-autosize>
         <div v-if="isEditing" class="comment__footer">
            <button class="comment__button" @click="onSaveComment">
               Сохранить
            </button>
            <button class="comment__button" @click="onDeleteComment">
               Удалить
            </button>
         </div>
      </template>
      <template v-else>
         <p class="comment__title">Комментарий к решению</p>
         <div class="comment__form">
            <pre>{{ textModel }}</pre>
         </div>
      </template>
   </div>
</template>

<script lang="ts">
import {
   defineComponent,
   inject,
   nextTick,
   ref,
   useRoute,
} from '@nuxtjs/composition-api'
import { EditKata, EditSolution } from '~/types/types'
import { useEditKatas } from '~/helpers/editKatas'

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
      const solutionId = inject<EditSolution['id']>('solutionId', 0)
      const kataId = inject<EditKata['id']>('kataId', '')
      const canEdit = inject('canEdit', false)

      const textArea = ref<any | null>(null)
      const route = useRoute()
      const textModel = ref(props.comment)
      const { setComment, deleteComment } = useEditKatas(route.value.params.id)

      const onSaveComment = () => {
         setComment({ kataId, solutionId }, textModel.value)
      }

      const onClick = () => {
         if (!props.isEditing) {
            context.emit('onTextareaClick')
         }
      }

      const onDeleteComment = () => {
         textModel.value = ''
         deleteComment({ kataId, solutionId })
      }

      const setFocus = () => {
         if (textArea.value !== null) {
            nextTick(() => textArea.value.$el.focus())
         }
      }

      return {
         onSaveComment,
         onDeleteComment,
         setFocus,
         onClick,
         textArea,
         textModel,
         canEdit,
      }
   },
})
</script>

<style lang="scss" scoped>
.comment {
   &__form {
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

      pre {
         font-size: inherit;
         font-family: inherit;
      }

      &:focus {
         color: $comment_text;
         border-color: #767676;
      }
   }

   &__title {
      color: #efefef;
      font-size: 15px;
      margin: 1.5em 0 0.25em;
   }

   &__button {
      @include standardButton;
   }

   &__footer {
      margin-top: 3px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
   }
}
</style>
