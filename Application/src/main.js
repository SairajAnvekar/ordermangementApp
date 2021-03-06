// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueCookie from 'vue-cookie'
import Vuetify from 'vuetify'
import Authentication from '@/components/pages/Authentication'
import colors from 'vuetify/es5/util/colors'
import('../node_modules/vuetify/dist/vuetify.min.css')
import ('../node_modules/material-design-icons/iconfont/material-icons.css')

Vue.use(VueCookie)
Vue.use(Vuetify,{
  theme: {
    primary: colors.indigo, // #E53935
    secondary: colors.red.lighten4, // #FFCDD2
    accent: colors.indigo.base // #3F51B5
  }
})

Vue.config.productionTip = false
Authentication.checkAuthentication()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
