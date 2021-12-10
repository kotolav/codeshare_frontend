<template>
   <div class="solution" :class="currentClass">
      <h4 v-if="variantNumber" class="solution__variant">
         {{ variantNumber }}-й вариант:
      </h4>
      <pre><code class="hljs" v-html="formattedCode"></code></pre>
      <kata-solution-footer
         :solution="solution"
         class="solution__footer"
         @addCommentClick="onAddComment"
      />
      <kata-solution-edit-comment
         v-if="showComment"
         ref="editCommentComponent"
         :comment="solution.comment"
         :is-editing="solution.isEditingComment"
         @onTextareaClick="onAddComment"
      />
   </div>
</template>

<script lang="ts">
import {
   computed,
   defineComponent,
   inject,
   nextTick,
   provide,
   ref,
   useRoute,
} from '@nuxtjs/composition-api'
import hljs from 'highlight.js/lib/common'
import { EditKata, EditSolution } from '~/types/types'
import SolutionEditComment from '~/components/Kata/SolutionEditComment.vue'
import { useEditKatas } from '~/helpers/editKatas'

export default defineComponent({
   props: {
      solution: {
         type: Object as () => EditSolution,
         required: true,
      },
      variantNumber: {
         type: Number,
         required: false,
         default: null,
      },
   },

   setup(props) {
      provide('solutionId', props.solution.id)
      const route = useRoute()
      const kataId = inject<EditKata['id']>('kataId', '')
      const canEdit = inject('canEdit', false)
      const { setCommentEditState } = useEditKatas(route.value.params.id)

      const editCommentComponent =
         ref<InstanceType<typeof SolutionEditComment>>()

      const currentClass = computed(
         () =>
            'solution--' +
            (props.solution.isShowing || !canEdit ? 'formatted' : 'hidden')
      )

      const formattedCode = computed(() => {
         let code: string
         try {
            code = hljs.highlight(props.solution.code, {
               language: props.solution.language,
            }).value
         } catch (error) {
            code = hljs.highlightAuto(props.solution.code).value
         }
         return code
      })

      const showComment = computed(
         () => props.solution.isEditingComment || props.solution.comment
      )

      const onAddComment = () => {
         const solutionId = props.solution.id
         setCommentEditState({ kataId, solutionId }, true)
         nextTick(() =>
            nextTick(() => {
               editCommentComponent?.value?.setFocus()
            })
         )
      }

      return {
         editCommentComponent,
         currentClass,
         formattedCode,
         showComment,
         onAddComment,
      }
   },
})
</script>

<style lang="scss" scoped>
pre {
   overflow: hidden;
}

code {
   @include code;
   background-color: $code_background_color !important;
}
</style>

<style lang="scss">
.solution {
   &--formatted {
      @import '~highlight.js/scss/monokai-sublime';
   }

   &--hidden {
   }

   &__footer {
      margin-top: 3px;
   }

   &__variant {
      color: $gray_text;
      font-size: 15px;
   }
}

code {
}
</style>
