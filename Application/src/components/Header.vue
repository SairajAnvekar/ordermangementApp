
<template>
  <header class="l-header-container">
      <v-navigation-drawer fixed v-model="drawer" app>
       <v-list>
          <v-list-tile @click="goToLink(`/`)">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>         
                <v-list-tile-title>Home</v-list-tile-title>         
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="goToLink(`/user`)">
            <v-list-tile-action>
              <v-icon>weekend</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>            
                <v-list-tile-title>User</v-list-tile-title>             
            </v-list-tile-content>
          </v-list-tile>  

          <v-list-tile @click="goToLink(`/product`)">
            <v-list-tile-action>
              <v-icon>weekend</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>            
                <v-list-tile-title>Product</v-list-tile-title>             
            </v-list-tile-content>
          </v-list-tile>  

             <v-list-tile @click="goToLink(`/order`)">
            <v-list-tile-action>
              <v-icon>weekend</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>            
                <v-list-tile-title>Order</v-list-tile-title>             
            </v-list-tile-content>
          </v-list-tile>  


        </v-list>
    </v-navigation-drawer> 
    <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Application</v-toolbar-title>
        <v-flex xs2 offset-md7 md2>
          <v-btn  color="blue" @click.native="submitSignout()">Sign out</v-btn>
        </v-flex>
      </v-toolbar>
  </header>
</template>
<!--v-layout row wrap>
    <v-flex xs12 offset-md1 md1>
      <v-btn block color="red lighten-1 white--text" @click.native="submitSignout()">Sign out</v-btn>
    </v-flex>
  </v-layout -->

<script>
import Authentication from '@/components/pages/Authentication'
import router from '@/router'
export default {
  data () {
    return {
      search: '',
      status: '',     
      drawer: null
    }
  },
  methods: {
    submitSignout () {
      Authentication.signout(this, '/login')
    },
    
      goToLink(url){
        router.push(url)
      },
  },
  props: {
      source: String
    }
}
</script>


