/**
 * This is your client vue app entrypoint
 * Its loaded because it is referenced in the vite
 * entrypoint file (index.html located at the root of this project)
 *
 * External css/js files will be loaded as dependencies.
 * You may want to check the vite configuration.
 * Some plugins will register virtual components or lazyload other for us.
 *
 * @see /index.html
 * @see /vite.config.ts
 * @see /app.ts
 * @see /app-custom.ts
 */
import { createApp } from './app'
import * as NProgress from 'nprogress'
import VueSocketIO from 'vue-socket.io'

/**
 * We create our app and mount it when it is ready
 *
 * @see /@src/app.ts for more detailed informations
 */
createApp().then(async (solarspeed) => {
  /**
   * Handle NProgress display on page changes
   */
  solarspeed.router.beforeEach(() => {
    NProgress.start()
  })
  solarspeed.router.afterEach(() => {
    NProgress.done()
  })

  // wait for the app to be ready
  await solarspeed.router.isReady()
  const vueSocket = new VueSocketIO({
    debug: true,
    connection: 'http://webback.thettdoc.com:8080/',
    // connection: 'http://localhost:3000',
    // connection: SocketIO('ws://webback.thettdoc.com:8080/'),
  })

  // finaly mount the app to the DOM
  solarspeed.app.use(vueSocket).mount('#app')
})
