<template>
   <div>
      <ul>
         <li><nuxt-link to="/">Главная</nuxt-link></li>
         <li>
            <nuxt-link
               :to="{
                  name: 'edit-id',
                  params: {
                     id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
                  },
               }"
               >Редактирование</nuxt-link
            >
         </li>
      </ul>
   </div>
</template>
