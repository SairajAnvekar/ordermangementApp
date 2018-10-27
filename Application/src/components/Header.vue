
<template>
  <header class="l-header-container">
      <v-navigation-drawer fixed v-model="drawer" app>
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <router-link to="/">
              <v-list-tile-title>Dashboard</v-list-tile-title>
            </router-link>
          </v-list-tile-content>
        </v-list-tile> 

        <v-list-tile @click="">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <router-link to="/user">
            <v-list-tile-title>Users</v-list-tile-title>
          </router-link>
        </v-list-tile-content>        
      </v-list-tile> 

      
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <router-link to="/">
            <v-list-tile-title>Product</v-list-tile-title>
            </router-link>
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
    }
  },
  props: {
      source: String
    }
}
</script>


