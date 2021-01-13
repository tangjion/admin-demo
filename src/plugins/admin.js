import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { admin_language_codes, layout_options } from '../../admin-cli.config.js'
import { createRouter as registerRouter } from '../router'

async function registerElementUI(ctx) {
  const { i18n } = ctx
  const ElementUI = await import('element-ui')
  await import('element-ui/lib/theme-chalk/index.css')
  Vue.use(ElementUI.default || ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
  })
}

function registerAdminI18n(ctx) {
  // i18n
  function getLanguage() {
    const chooseLanguage = window.localStorage.getItem('language')
    if (chooseLanguage) return chooseLanguage
    // if has not choose language
    const language = (
      navigator.language || navigator.browserLanguage
    ).toLowerCase()
    return language || 'en'
  }

  // default admin UI languages, modify as needed
  const global_locales = require.context(
    '../locales',
    true,
    /[a-zA-Z0-9-_,\s]+\.js$/i
  )
  const module_locales = require.context(
    '../modules',
    true,
    /\/locales\/[a-zA-Z0-9-_,\s]+\.js$/i
  )

  function loadlocalemessages() {
    const messages = {}
    admin_language_codes.forEach(({ F_LANG: lang }) => {
      messages[lang] = {
        ...global_locales(global_locales.keys().find((v) => v.match(lang)))
          .default,
        ...module_locales(module_locales.keys().find((v) => v.match(lang)))
          .default,
        ...require(`element-ui/lib/locale/lang/${lang}`).default
      }
    })
    return messages
  }

  // Create VueI18n instance with options
  const i18n = new VueI18n({
    locale: getLanguage(), // set locale
    messages: loadlocalemessages() // set locale messages
  })

  i18n.admin_language_codes = admin_language_codes
  ctx.i18n = i18n
}

async function registerLayout(ctx) {
  const KlkLayout = await import('@klook/admin-layout')
  Vue.use(KlkLayout.default || KlkLayout, { options: layout_options })
}

async function registerLogin(ctx) {
  const { router } = ctx
  let useLogin = await import('@klook/admin-login')
  useLogin = useLogin.default || useLogin
  useLogin(router)
}

async function registerPermission(ctx) {
  const { router } = ctx
  let { usePermission } = await import('@klook/admin-permission')
  usePermission(router, {
    noPermissionPath: '/404'
  })
}

export async function registerAdmin(ctx) {
  await registerAdminI18n(ctx)
  await registerLayout(ctx)
  await registerRouter(ctx)
  await registerLogin(ctx)
  await registerPermission(ctx)
  await registerElementUI(ctx)
  return ctx
}
