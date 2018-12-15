
<template>
  <header class="l-header-container">
      <v-navigation-drawer fixed v-model="drawer" app  max-width="200px">
       <v-list>
          <v-list-tile @click="goToLink(`/`)">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>         
                <v-list-tile-title>Home</v-list-tile-title>         
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile  v-if="role =='admin'"  :class="$route.path==`/user`?'highlight':''" @click="goToLink(`/user`)">
            <v-list-tile-action>
              <v-icon>weekend</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>            
                <v-list-tile-title>User</v-list-tile-title>             
            </v-list-tile-content>
          </v-list-tile>  

          <v-list-tile :class="$route.path==`/product`?'highlight':''" @click="goToLink(`/product`)">
            <v-list-tile-action>
              <v-icon>weekend</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>            
                <v-list-tile-title>Product</v-list-tile-title>             
            </v-list-tile-content>
          </v-list-tile>  

             <v-list-tile  :class="$route.path==`/order`?'highlight':''" @click="goToLink(`/order`)">
            <v-list-tile-action>
              <v-icon>weekend</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>            
                <v-list-tile-title>Order</v-list-tile-title>             
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile  v-if="role =='admin'"   :class="$route.path==`/orderReport`?'highlight':''" @click="goToLink(`/orderReport`)">
            <v-list-tile-action>
              <v-icon>weekend</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Reports</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          
          <v-list-tile  v-if="role =='admin'"  :class="$route.path==`/paymentReport`?'highlight':''" @click="goToLink(`/paymentReport`)">
            <v-list-tile-action>
              <v-icon>weekend</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Payment Reports</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>


        </v-list>
    </v-navigation-drawer> 
    <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Application</v-toolbar-title>
           <v-spacer></v-spacer>
          <v-toolbar-items>
            
          
          <v-menu bottom offset-y>  
               <v-btn flat  slot="activator"><v-icon>account_circle</v-icon> <v-spacer></v-spacer> {{user}} </v-btn>
            <v-list>         
              <v-list-tile @click="submitSignout()">
                <v-list-tile-title>
                  <v-icon>input</v-icon> Log out</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>        
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
      role: this.$cookie.get('role'),
      user: this.$cookie.get('username'),	  
      drawer: null
    }
  },
  mounted() {
    if(!this.$cookie.get('username')){
     this.submitSignout();
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
<style>
.highlight{
  background:#3f51b5
}
</style>


