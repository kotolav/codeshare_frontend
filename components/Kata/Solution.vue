<template>
   <div class="solution" :class="currentClass">
      <h5 v-if="variantNumber" class="solution__variant">
         {{ variantNumber }}-й вариант:
      </h5>
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
   inject,
   provide,
   ref,
   nextTick,
   defineComponent,
   useStore,
   useRoute,
} from '@nuxtjs/composition-api'
import hljs from 'highlight.js/lib/common'
import { EditKata, EditSolution } from '~/types/types'
import SolutionEditComment from '~/components/Kata/SolutionEditComment.vue'
import { EditKataRootState } from '~/store/editKata'

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
      const kataId = inject<EditKata['id']>('kataId')
      const store = useStore<EditKataRootState>()

      const editCommentComponent =
         ref<InstanceType<typeof SolutionEditComment>>()

      const currentClass = computed(
         () =>
            'solution--' + (props.solution.isShowing ? 'formatted' : 'hidden')
      )

      const formattedCode = computed(() => {
         // hljs.highlightAuto(props.solution.code).value
         // return props.solution.code
         return hljs.highlight(props.solution.code, {
            language: props.solution.language,
         }).value
      })

      const showComment = computed(
         () => props.solution.isEditingComment || props.solution.comment
      )

      const onAddComment = () => {
         store.dispatch('editKata/setCommentEditing', {
            token: route.value.params.id,
            kataId,
            solutionId: props.solution.id,
            isEditing: true,
         })
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
