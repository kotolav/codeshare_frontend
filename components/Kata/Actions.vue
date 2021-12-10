<template>
   <ul class="list">
      <li class="list__item">
         <a
            :href="codewarsLink"
            target="_blank"
            rel="noopener noreferrer"
            class="list__link list__link--new-window"
            >Открыть задачу на Codewars</a
         >
      </li>
      <li v-if="showEditKataActions" class="list__item">
         <a
            class="list__link"
            :class="{ 'list__link--inactive': solutionIsToggling }"
            @click.prevent="hideKata"
            >Скрыть эту задачу</a
         >
      </li>
   </ul>
</template>

<script lang="ts">
import {
   computed,
   defineComponent,
   inject,
   useRoute,
} from '@nuxtjs/composition-api'
import { useEditKatas } from '~/helpers/editKatas'

export default defineComponent({
   props: {
      kataId: {
         type: String,
         required: true,
      },
      isVisibleSolutions: {
         type: Boolean,
         required: false,
         default: false,
      },
   },

   setup(props) {
      const route = useRoute()
      const { solutionIsToggling, hideKata: useHideKata } = useEditKatas(
         route.value.params.id
      )
      const codewarsLink = computed(
         () => `https://www.codewars.com/kata/${props.kataId}`
      )
      const canEdit = inject<Boolean>('canEdit', false)

      const showEditKataActions = computed(
         () => canEdit && props.isVisibleSolutions
      )

      const hideKata = async () => {
         if (!solutionIsToggling.value) {
            await useHideKata({ kataId: props.kataId })
         }
      }

      return {
         codewarsLink,
         hideKata,
         solutionIsToggling,
         showEditKataActions,
      }
   },
})
</script>

<style lang="scss" scoped>
.list {
   display: flex;
   flex-wrap: wrap;
   font-size: 15px;
   font-family: $font_roboto;
   margin-top: 10px;

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

      &--new-window {
         &:after {
            @include externalLink;
         }
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
