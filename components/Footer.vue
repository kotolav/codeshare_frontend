<template>
   <footer class="footer">
      <div class="footer__content">
         <p>
            <nuxt-link class="footer__link" :to="{ name: 'index' }"
               >CodeShare</nuxt-link
            >
            - делитесь своими решениями
         </p>
         <p>&copy; 2021</p>
      </div>
   </footer>
</template>

<style lang="scss" scoped>
.footer {
   margin-top: 50px;
   background-color: #2e2e2e;
   box-shadow: -5px 0 5px #000;
   &__link {
      text-decoration: none;
      color: $info_text;
   }
   &__content {
      font-family: $font_roboto;
      padding: 1em 3em;
      font-size: 16px;
      color: $default_text;
      margin: 0 auto;
      text-align: center;
      max-width: 700px;
   }
}
</style>
