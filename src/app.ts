/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApp as createClientApp, h, Suspense } from 'vue'

import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { createI18n } from './i18n'
import { createRouter2 } from './router'

import { authMiddleware } from './middleware/authMiddleware'
import { addQueryGroupNameMiddleware } from './middleware/addQueryGroupName'
import { checkUserGroupRoleMiddleware } from './middleware/checkUserGroupRole'
import SolarspeedApp from './SolarspeedApp.vue'
import './styles'

import { initDarkmode } from '/@src/stores/darkmode'
// import { createApi } from '/@src/composable/useApi'

import VueApexCharts from 'vue3-apexcharts'

export type SolarspeedAppContext = Awaited<ReturnType<typeof createApp>>

import { registerGlobalComponents, registerRouterNavigationGuards } from './app-custom'

export async function createApp() {
  const head = createHead()
  const i18n = createI18n()
  const router = createRouter2()
  const pinia = createPinia()
  // const api = createApi()

  const app = createClientApp({
    // This is the global app setup function
    setup() {
      /**
       * Initialize the darkmode watcher
       *
       * @see /@src/stores/darkmode
       */
      initDarkmode()

      /**
       * Here we are creating a render function for our main app with
       * the main SolarspeedApp component, wrapped in a Suspense component
       * to handle async loading of the app.
       * Template equivalent would be:
       *
       * <template>
       *   <Susupense>
       *     <SolarspeedApp />
       *   </Susupense>
       * </template>
       */
      return () => {
        /**
         * The Suspense component is needed to use async in child components setup
         * @see https://v3.vuejs.org/guide/migration/suspense.html
         */
        return h(Suspense, null, {
          default: () => h(SolarspeedApp),
        })
      }
    },
  })

  router.beforeEach(async (to, from, next) => {
    // if (to.meta.requiresAuth && !session.isLoggedIn) {
    //   // this route requires auth, check if logged in
    //   // if not, redirect to login page.
    //   const notif = useNotyf()
    //   notif.error(
    //     'Sorry, you should loggin to access this section (anything will work)'
    //   )

    //   return {
    //     // Will follow the redirection set in /@src/pages/auth/index.vue
    //     name: 'login',
    //     // save the location we were at to come back later
    //     query: { redirect: to.fullPath },
    //   }
    // }

    if (to.meta.requiresAuth) {
      try {
        for (const middleWare of [
          authMiddleware,
          addQueryGroupNameMiddleware,
          checkUserGroupRoleMiddleware,
        ]) {
          const { nextOption }: any = await middleWare(to, from)
          if (nextOption.name || nextOption.path) return next(nextOption)
        }
      } catch (err) {
        next(err.nextOption.name)
      }
    }
    next()

    // next()
  })

  const solarspeed = {
    app,
    // api,
    router,
    i18n,
    head,
    pinia,
    // components
    VueApexCharts,
  }

  await registerGlobalComponents(solarspeed)
  app.use(solarspeed.pinia)
  app.use(solarspeed.head)
  app.use(solarspeed.i18n)

  // registerRouterNavigationGuards(solarspeed)
  app.use(solarspeed.router)
  app.use(solarspeed.VueApexCharts)

  return solarspeed
}
