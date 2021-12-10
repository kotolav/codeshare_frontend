<template>
   <div class="panel" :class="{ 'panel--shrink': !filterPanelIsShowing }">
      <template v-if="filterPanelIsShowing">
         <span class="panel__action" @click="togglePanelVisibility"
            >Свернуть</span
         >
         <div class="panel__row">
            <label for="search-input">Поиск</label>
            <input
               id="search-input"
               v-model="searchText"
               type="text"
               class="panel__search"
               placeholder="По названию и описанию"
               @keydown.enter="sendSearch"
            />
         </div>
         <div class="panel__row panel__row--flex">
            <div class="panel__cell">
               <label for="language-input">Язык</label>
               <vue-multiselect
                  id="language-input"
                  v-model="selectedLanguages"
                  placeholder="Выбрать язык"
                  class="multiselect-custom"
                  :custom-label="languageFormat"
                  :options="languages"
                  :select-label="'Выбрать'"
                  :selected-label="'Выбрано'"
                  :deselect-label="'Снять выбор'"
                  :searchable="false"
                  :internal-search="false"
                  :multiple="true"
               />
            </div>
            <div class="panel__cell">
               <label for="tag-input">Теги</label>
               <vue-multiselect
                  id="tag-input"
                  v-model="selectedTags"
                  placeholder="Выбрать теги"
                  class="multiselect-custom"
                  :options="tags"
                  :select-label="'Выбрать'"
                  :selected-label="'Выбрано'"
                  :deselect-label="'Снять выбор'"
                  :searchable="false"
                  :internal-search="false"
                  :multiple="true"
               />
            </div>
         </div>
         <div class="panel__row">
            <span class="panel__sort-title">Сортировать</span>
            <ul class="sort">
               <li
                  v-for="(text, name) in sortVariants"
                  :key="name"
                  class="sort__item"
                  :class="{
                     'sort__item--active': searchParams.sort === name,
                     'sort__item--asc':
                        searchParams.sort === name &&
                        searchParams.direction === 'asc',
                     'sort__item--desc':
                        searchParams.sort === name &&
                        searchParams.direction === 'desc',
                  }"
                  @click="sortBy(name)"
               >
                  <span>{{ text }}</span>
               </li>
            </ul>
         </div>
         <div class="panel__row panel__row--reset">
            <span class="panel__reset" @click="resetFilter"
               >Сбросить фильтры</span
            >
         </div>
         <div class="panel__row">
            <button class="panel__button" @click="sendSearch">Найти</button>
         </div>
      </template>
      <template v-else>
         <div class="panel__head" @click="togglePanelVisibility">
            <p class="panel__head-title">Панель фильтров</p>
            <span class="panel__action panel__action--shrink">Развернуть</span>
         </div>
      </template>
   </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from '@nuxtjs/composition-api'
import { SearchConfig, SortVariant } from '~/helpers/filteredKatas'
import { languageFormat } from '~/helpers/utils/langFormat'
import { useConfig } from '~/helpers/config'

export default defineComponent({
   props: {
      searchParams: {
         type: Object as PropType<SearchConfig>,
         required: true,
      },
      languages: {
         type: Array as PropType<string[]>,
         required: true,
      },
      tags: {
         type: Array as PropType<string[]>,
         required: true,
      },
   },
   emits: ['sortBy', 'applyFilters'],

   setup(props, context) {
      const sortVariants = {
         [SortVariant.Date]: 'по дате',
         [SortVariant.Rank]: 'по сложности',
         [SortVariant.CodeLength]: 'по длине кода',
      }

      const selectedLanguages = ref(props.searchParams.language)
      const selectedTags = ref(props.searchParams.tags)
      const searchText = ref(props.searchParams.search)
      const sortVariant = ref(props.searchParams.sort)
      const sortDirection = ref(props.searchParams.direction)

      const { setFilterPanelVisibility, filterPanelIsShowing } = useConfig()

      const togglePanelVisibility = () =>
         setFilterPanelVisibility(!filterPanelIsShowing.value)

      const sortBy = (sortType: SortVariant) => {
         sortVariant.value = sortType
         if (props.searchParams.sort !== sortType) {
            sortDirection.value = 'desc'
         } else {
            sortDirection.value =
               props.searchParams.direction === 'asc' ? 'desc' : 'asc'
         }

         sendSearch()
      }

      const sendSearch = () => {
         context.emit(
            'applyFilters',
            {
               search: searchText.value,
               sort: sortVariant.value,
               direction: sortDirection.value,
               tags: selectedTags.value,
               language: selectedLanguages.value,
            },
            true
         )
      }

      const resetFilter = () => {
         context.emit('applyFilters', {}, true)
      }

      watch(
         () => props.searchParams,
         () => {
            searchText.value = props.searchParams.search
            selectedTags.value = props.searchParams.tags
            selectedLanguages.value = props.searchParams.language
            sortVariant.value = props.searchParams.sort
            sortDirection.value = props.searchParams.direction
         },
         {
            immediate: true,
         }
      )

      return {
         filterPanelIsShowing,
         togglePanelVisibility,
         sortVariants,
         SortVariant,
         sortBy,
         sendSearch,
         selectedLanguages,
         selectedTags,
         sortDirection,
         searchText,
         resetFilter,
         languageFormat,
      }
   },
})
</script>

<style lang="scss" scoped>
.panel {
   @include panel;
   font-family: $font_roboto;
   max-width: $panel_width;
   margin: 0 auto;
   position: relative;

   &--shrink {
      text-align: center;
      padding: 10px 15px;
   }

   &__head {
      cursor: pointer;
   }

   &__head-title {
      font-weight: bold;
   }

   &__action {
      position: absolute;
      right: 15px;
      top: 10px;
      cursor: pointer;
      border-bottom: 1px dashed currentColor;

      &--shrink {
         @include xs-block() {
            display: inline-block;
            position: static;
         }
      }
   }

   &__row {
      & + & {
         margin-top: 10px;
      }

      &--reset {
         text-align: right;
         @include xs-block() {
            text-align: center;
         }
      }

      &--right {
         text-align: right;
      }

      &--flex {
         display: flex;
         flex-wrap: wrap;
         justify-content: space-between;
      }
   }

   &__cell {
      width: calc(50% - 5px);
      @include xs-block() {
         width: 100%;
      }
   }

   &__reset {
      cursor: pointer;
      border-bottom: 1px dashed #fff;
   }

   &__search {
      display: block;
      width: 100%;
      font-size: 18px;
      color: #fff;
      background-color: $dark_bg;
      transition: 0.3s ease-in-out;
      border-radius: 5px;
      border: 1px solid #424345;
      padding: 0.5em 0.8em;
   }

   &__sort-title {
      margin-right: 1em;
   }

   &__button {
      display: block;
      width: 100%;
      padding: 10px 0;
      background-color: $dark_bg;
      cursor: pointer;
      color: #fff;
      font-size: 1.1em;
      border: 1px solid #000;
      border-radius: 5px;

      &:active {
         position: relative;
         top: 1px;
      }
   }
}

.sort {
   display: inline-flex;
   flex-wrap: wrap;

   &__item {
      cursor: pointer;
      transition: 0.2s ease-in-out;
      user-select: none;
      margin-top: 0.5em;

      &--active {
         span {
            border-bottom: 1px solid #fff;
         }
      }

      &:before {
         content: '';
         height: 0.75em;
         width: 1em;
      }

      &--asc {
         &:before {
            background: transparent url(~/assets/img/asc.png) no-repeat left
               center;
            padding-left: 1em;
            background-size: 11px 16px;
         }
      }

      &--desc {
         &:before {
            background: transparent url(~/assets/img/desc.png) no-repeat left
               center;
            padding-left: 1em;
            background-size: 11px 16px;
         }
      }

      &:not(:last-child) {
         margin-right: 1.5em;
      }
   }
}

.multiselect-custom::v-deep.multiselect {
   .multiselect__tags {
      border: 1px solid #424345;
      background: $dark_bg;
   }
}
</style>
