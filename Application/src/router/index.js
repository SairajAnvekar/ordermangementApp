import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import * as Auth from '@/components/pages/Authentication'
// Pages
import Authentication from '@/components/pages/Authentication/Authentication'
import Home from '@/components/pages/Home'
import User from '@/components/pages/Users'
import Product from '@/components/pages/Product'
import Order from '@/components/pages/Order'
import OrderReport from '@/components/pages/OrderReport'
import PaymentReport from '@/components/pages/PaymentReport'
// Global components

import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Register components
Vue.component('app-header', Header)
Vue.component('app-footer', Footer)

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: Home,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/login',
      name: 'Authentication',
      component: Authentication
    },
    {
      path: '/user',
      name: 'user',
      components: {
        default: User,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/product',
      name: 'product',
      components: {
        default: Product,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/order',
      name: 'order',
      components: {
        default: Order,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/orderReport',
      name: 'orderReport',
      components: {
        default: OrderReport,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/paymentReport',
      name: 'paymentReport',
      components: {
        default: PaymentReport,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    }

  ]
})



export default router

router.beforeEach((to, from, next) => {
  console.log(Auth.default.user)
  if (to.meta.requiredAuth) {
    if (Auth.default.user.authenticated) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})

