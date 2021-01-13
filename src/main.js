import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import App from './App'
import registerPlugins from './plugins'
import VueI18n from 'vue-i18n'
import { isMerchant } from './env'

Vue.use(VueI18n)

Vue.config.productionTip = false

const context = {
  isMerchant
}

async function createApplication() {
  registerPlugins(context).then(createApp)
}

function createApp() {
  const { i18n, router, isMerchant, antLocale = {} } = context
  const app = new Vue({
    el: '#app',
    router,
    i18n,
    mounted() {
      console.log(Object.entries(process.env).join('\n'))
    },
    render: function(h) {
      if (isMerchant) {
        return (
          <a-config-provider locale={antLocale}>
            <App />
          </a-config-provider>
        )
      }
      return <App />
    }
  })
  return app
}

createApplication()
