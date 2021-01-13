import Vue from 'vue'
import VueRouter from 'vue-router'

import demoRoutes from '@/modules/demo/routes/index.js'

import { getRoutes } from '@klook/admin-cli-service'
import { merchant_language_codes } from '../../admin-cli.config.js'

Vue.use(VueRouter)

let router

async function getLayout() {
  let layout = await import('@klook/merchant-layout')
  layout = layout.default || layout
  return layout
}

function getLocale() {
  const pathname = location.pathname
  let pathArr = pathname.split('/')
  const lang = pathArr[1]
  const languageList = merchant_language_codes.map((i) => i.value)

  if (lang && languageList.includes(lang)) {
    return lang
  }
  return ''
}

function getBase() {
  let base = process.env.VUE_APP_BASE_URL
  let multiLang = getLocale()
  return multiLang || base
}

export async function createRouter(_ctx) {
  if (router) return router

  let routes = getRoutes({
    default: {
      routes: [
        {
          path: '/',
          redirect: { name: 'default' },
          hidden: true
        }
      ]
    },
    demoRoutes
    // add your routes
  })

  const KlkLayout = await getLayout()

  routes = routes.map((route) => ({
    ...route,
    // bypasss 404 etc..
    ...(route.component ? {} : { component: KlkLayout }),
    // top route refresh page due to  MSPA restriction
    beforeEnter(to, from, next) {
      if (from.fullPath === '/') {
        route.beforeEnter ? route.beforeEnter(to, from, next) : next()
      } else {
        window.location.href = `${process.env.VUE_APP_BASE_URL}${to.fullPath}`
      }
    }
  }))

  const _router = new VueRouter({
    mode: 'history',
    base: getBase(),
    routes
  })

  router = _router

  _ctx.router = router

  return router
}

export default router
