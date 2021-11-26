<template>
   <ul class="footer">
      <li class="footer__item">
         Решено:
         <time :datetime="isoDateTime" :title="dateTime" class="footer__time">{{
            solution.solvedAt | dateDiffHuman
         }}</time>
      </li>
      <li v-if="canEdit" class="footer__item">
         <a class="footer__link" @click.prevent="addComment"
            >{{
               solution.comment ? 'Редактировать' : 'Добавить'
            }}
            комментарий</a
         >
      </li>
      <li v-if="canEdit" class="footer__item">
         <a
            class="footer__link"
            :class="{ 'footer__link--inactive': visibilityIsModifying }"
            @click.prevent="toggleSolutionVisibility"
            >{{ showHideLabel }}</a
         >
      </li>
   </ul>
</template>

<script lang="ts">
import {
   computed,
   defineComponent,
   inject,
   ref,
   useRoute,
   useStore,
} from '@nuxtjs/composition-api'
import dayjs from 'dayjs'
import { EditKata, EditSolution } from '~/types/types'
import { EditKataRootState } from '~/store/editKata'

export default defineComponent({
   props: {
      solution: {
         type: Object as () => EditSolution,
         required: true,
      },
   },

   setup(props, context) {
      const canEdit = inject<Boolean>('canEdit', false)
      const kataId = inject<EditKata['id']>('kataId')
      const store = useStore<EditKataRootState>()
      const route = useRoute()
      const visibilityIsModifying = ref(false)

      const isoDateTime = computed(() =>
         dayjs.unix(props.solution.solvedAt).toISOString()
      )
      const dateTime = computed(() =>
         dayjs.unix(props.solution.solvedAt).format('DD-MM-YYYY в HH:mm:ss')
      )

      const showHideLabel = computed(() => {
         return props.solution.isShowing
            ? 'Скрывать это решение'
            : 'Показывать решение'
      })

      const toggleSolutionVisibility = async () => {
         if (!visibilityIsModifying.value) {
            visibilityIsModifying.value = true
            await store.dispatch('editKata/toggleSolutionVisibility', {
               token: route.value.params.id,
               kataId,
               solutionId: props.solution.id,
               visibility: !props.solution.isShowing,
            })
            visibilityIsModifying.value = false
         }
      }

      const addComment = () => {
         context.emit('addCommentClick')
      }

      return {
         canEdit,
         isoDateTime,
         dateTime,
         showHideLabel,
         toggleSolutionVisibility,
         addComment,
         visibilityIsModifying,
      }
   },
})
</script>

<style lang="scss" scoped>
.footer {
   display: flex;
   flex-wrap: wrap;
   font-size: 15px;
   font-family: 'Roboto', sans-serif;

   &__item {
      color: $gray_text;
      &:not(:last-child):after {
         display: inline-block;
         content: '•';
         margin: 0 8px;
         vertical-align: middle;
         font-size: 14px;
         color: rgba(255, 255, 255, 0.3);
      }
   }
   &__time {
      color: $default_text;
   }

   &__link {
      color: $link_color;
      text-decoration: none;
      transition: color 0.3s ease-in-out;
      cursor: pointer;
      user-select: none;
      vertical-align: middle;

      &:hover {
         color: $link_hover_color;
      }

      &--inactive {
         color: $gray_text;
         &:hover {
            color: inherit;
         }
      }
   }
}
</style>
