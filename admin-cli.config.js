/**
 * config file for admin-cli projects
 *
 */

const admin_language_codes = [
  {
    F_LANG: 'en',
    TEXT: 'English'
  },
  {
    F_LANG: 'zh-CN',
    TEXT: '简体中文'
  },
  {
    F_LANG: 'zh-TW',
    TEXT: '繁體中文'
  }
]

const merchant_language_codes = [
  {
    name: 'English',
    value: 'en',
    data: 'en_US', // 用作前后端交互数据
    eventName: 'EN'
  },
  {
    name: '简体中文',
    value: 'zh-CN',
    data: 'zh_CN',
    eventName: 'ZH-CN'
  },
  {
    name: '繁體中文',
    value: 'zh-TW',
    data: 'zh_TW',
    eventName: 'ZH-TW'
  },
  {
    name: '日本語',
    value: 'ja',
    data: 'ja_JP',
    eventName: 'JA'
  },
  {
    name: '한국어',
    value: 'ko',
    data: 'ko_KR',
    eventName: 'KO'
  },
  {
    name: 'ไทย',
    value: 'th',
    data: 'th_TH',
    eventName: 'TH'
  }
]

// https://knpm.klook.io/-/web/detail/@klook/admin-layout
const layout_options = {
  navbarStyle: 'left', // 导航风格，可选值为：'left', 'top'
  isSubSidebarOpen: true // 二级导航是否打开
}

const merchant_layout_options = {
  navbarStyle: 'left', // 导航风格，可选值为：'left', 'top'
  isSubSidebarOpen: true // 二级导航是否打开
}
export {
  admin_language_codes,
  layout_options,
  merchant_layout_options,
  merchant_language_codes
}
