import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { createRouter as registerRouter } from '../router'
import {
  merchant_language_codes,
  merchant_layout_options
} from '../../admin-cli.config.js'

async function registerAntdUI() {
  const Antd = await import('ant-design-vue')
  await import('ant-design-vue/dist/antd.less')
  Vue.use(Antd.default || Antd)
  return Promise.resolve()
}

async function registerMerchantI18n(ctx) {
  let antLocale = {}
  function getLocale() {
    const pathname = location.pathname
    let pathArr = pathname.split('/')
    let lang = pathArr[1]
    const languageList = merchant_language_codes.map((i) => i.value)
    const language = (
      navigator.language || navigator.browserLanguage
    ).toLowerCase()
    lang = lang || language
    if (lang && languageList.includes(lang)) {
      return lang
    }
    return 'en'
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

  // 站点多语言与ant多语言文件名称映射
  const antLocaleMapping = {
    en: 'en_GB',
    ja: 'ja_JP',
    ko: 'ko_KR',
    th: 'th_TH',
    'zh-CN': 'zh_CN',
    'zh-TW': 'zh_TW'
  }

  function loadLocaleMessages() {
    const messages = {}
    merchant_language_codes.forEach(({ value: lang }) => {
      const key1 = global_locales.keys().find((v) => v.match(lang))
      const key2 = module_locales.keys().find((v) => v.match(lang))
      messages[lang] = {
        ...((key1 && global_locales(key1).default) || {}),
        ...((key2 && module_locales(key2).default) || {})
      }
    })
    return messages
  }

  const locale = getLocale()

  let antLang = antLocaleMapping[locale]
  const antList = require.context(
    'ant-design-vue/lib/locale-provider',
    true,
    /\.js/
  )
  const antKey = antList.keys().find((v) => v.match(antLang))
  if (antKey) {
    antLocale = antList(antKey)
    antLocale = antLocale.default || antLocale
  }

  const i18n = new VueI18n({
    locale: locale, // set locale
    messages: loadLocaleMessages() // set locale messages
  })

  ctx.i18n = i18n
  ctx.antLocale = antLocale || {}
}

async function registerLayout() {
  const KlkLayoutModule = await import('@klook/merchant-layout')
  const KlkLayout = KlkLayoutModule.default || KlkLayoutModule
  Vue.use(KlkLayout, {
    languages: merchant_language_codes,
    layout: merchant_layout_options
  })
}

async function registerLogin(ctx) {
  const { router } = ctx

  let useLogin = await import('@klook/merchant-login')
  useLogin = useLogin.default || useLogin
  useLogin(router, {
    languages: merchant_language_codes
  })
}

export async function registerMerchant(ctx) {
  await registerMerchantI18n(ctx)
  await registerLayout(ctx)
  await registerRouter(ctx)
  await registerLogin(ctx)
  await registerAntdUI(ctx)
  return ctx
}
