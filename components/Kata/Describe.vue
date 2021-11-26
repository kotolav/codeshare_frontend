<template>
   <div class="description markdown" v-html="markDownDescription"></div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { marked } from 'marked'

export default defineComponent({
   props: {
      description: {
         type: String,
         required: true,
      },
      usedLanguages: {
         type: Array as PropType<string[]>,
         required: false,
         default: () => [],
      },
   },

   setup(props) {
      const renderer = new marked.Renderer()
      renderer.code = function (code, language, isEscaped) {
         if (!language || props.usedLanguages.includes(language)) {
            return marked.Renderer.prototype.code.call(
               this,
               code,
               language,
               isEscaped
            )
         }
         return ''
      }

      const markDownDescription = computed(() => {
         return marked.parse(props.description, {
            renderer,
         })
      })

      return {
         markDownDescription,
      }
   },
})
</script>

<style lang="scss">
.markdown {
   a {
      color: silver;
      &:hover {
         color: #6795de;
      }
   }

   p {
      margin-top: 1.25em;
      margin-bottom: 1.25em;
   }

   code {
      border: 1px solid rgba(255, 255, 255, 0.13);
      padding: 0 4px;
      border-radius: 3px;
      font-family: monospace, monospace, sans-serif;
      color: #f1f3f5;
      background-color: $code_background_color;
   }

   hr {
      margin: 0.5em 0;
      height: 1px;
   }

   pre {
      display: block;
      overflow: auto;
      padding: 1em;
      border-radius: 0.3em;
      margin-top: 1.7em;
      margin-bottom: 1.7em;
      font-size: 14px;
      line-height: 1.7;
      background-color: $code_background_color;

      code {
         @include code;
         border: none;
         padding: 0;
         border-radius: 5px;
         background-color: transparent;
         color: #f1f3f5;
      }
   }

   img {
      margin-top: 2em;
      margin-bottom: 2em;
   }

   h1 {
      font-size: 22px;
   }

   h2 {
      font-size: 20px;
   }

   h3 {
      font-size: 18px;
   }

   h4 {
      font-size: 16px;
   }

   h1,
   h2,
   h3,
   h4,
   h5,
   h6 {
      font-weight: 600;
      & + * {
         margin-top: 0;
      }
   }

   blockquote {
      border-left-color: rgba(255, 255, 255, 0.13);
      border-left-width: 0.25rem;
      border-left-style: solid;
      font-style: italic;
      font-weight: 500;
      margin-bottom: 1.6em;
      margin-top: 1.6em;
      padding-left: 1em;
   }

   ul {
      li {
         list-style: disc;
         margin-left: 1.3em;
         margin-top: 0.5em;
         margin-bottom: 0.5em;
      }
   }
}
</style>

<style lang="scss" scoped>
.description {
   font-size: 16px;
   line-height: 1.6;
   word-break: break-word;
   color: $default_text;
}
</style>
