<template>
    <v-footer color="indigo" app>
        <span class="white--text">&copy; 2017</span>
    </v-footer>
</template>
      <script>
      import Authentication from '@/components/pages/Authentication'
      export default {
        data () {
          return {
            search: '',
            status: '',     
          }
        },
        methods: {
          submitSignout () {
            Authentication.signout(this, '/login')
          }
        }
      }
      </script>
      

      