import { useStorage } from '@vueuse/core'
import { createI18n as createClientI18n } from 'vue-i18n'
/**
 * messages are generated using vite-plugin-i18n
 * each .json files located in the ./src/locales are registered in messages
 * @see https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
 */
// import messages from '@intlify/vite-plugin-vue-i18n/messages'
import { en } from './locales/en/index'
import { zh } from './locales/zh-CN/index'
// import store from '/@src/stores/index'

const messages = {
  en,
  zh,
}

// const { userPref } = store.state

export function createI18n() {
  // const systemLangs = ['en', 'zh']
  // const userLang = userPref.lang || navigator.language
  // const lang = systemLangs.includes(userLang) ? userLang : systemLangs[1]

  // store.commit('SET_USER_PREF', { lang })
  // localStorage.setItem('locale', lang)

  const defaultLocale = useStorage('locale', navigator?.language || 'en')
  const i18n = createClientI18n({
    locale: defaultLocale.value,
    messages,
  })

  return i18n
}
