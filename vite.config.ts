import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import path from 'path'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import ViteFonts from 'vite-plugin-fonts'
import ViteRadar from 'vite-plugin-radar'
import PurgeIcons from 'vite-plugin-purge-icons'
import { imagetools } from 'vite-imagetools'
import ImageMin from 'vite-plugin-imagemin'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import { VitePWA } from 'vite-plugin-pwa'
// import SolarSpeedDocumentation from './vite-plugin-solarspeed-doc/index'
// import envCompatible from 'vite-plugin-env-compatible'

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  return {
    root: process.cwd(),
    mode: env.MODE,
    publicDir: 'public',
    logLevel: 'info',
    resolve: {
      alias: [
        // {
        //   find: '/~/',
        //   replacement: `/src/assets/`,
        // },
        {
          find: '/@src/',
          replacement: `/src/`,
        },
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: false,

      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          secure: false,
          changeOrigin: true,
        },
        '/signupapi': {
          target: 'http://webback.thettdoc.com:3002',
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/signupapi/, ''),
        },
        '/socket.io': {
          target: 'ws://webback.thettdoc.com:8080/socket.io',
          secure: false,
          ws: true,
        },
      },
    },

    build: {
      sourcemap: process.env.SOURCE_MAP === 'true',
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        external: [/\/demo\/.*/],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ` 
            @import './src/scss/abstracts/_variables.scss';
            @import './src/scss/abstracts/_mixins.scss';
            @import './src/scss/pages/lists/_list-view-1.scss'; 
            @import './src/scss/pages/generic/_forms.scss'; 
            @import './src/scss/pages/generic/_utility.scss';
            @import './src/scss/pages/generic/_onboarding.scss';
            @import './src/scss/pages/generic/_widgets-lists.scss';
            @import './src/scss/layout/_navbar.scss';
            @import './src/scss/layout/_layout.scss';
            @import './src/scss/layout/_navbar-extension.scss';
            @import './src/scss/layout/_responsive.scss';
            @import './src/scss/layout/_sidebar-mobile.scss';
            @import './src/scss/layout/_sidebar-panel.scss';
            @import './src/scss/layout/_right-panel.scss';
            @import './src/scss/layout/_sidebar.scss'; `,
        },
      },
    },
    plugins: [
      // envCompatible(/* options */),
      Vue({
        include: [/\.vue$/],
      }),
      VueI18n({
        include: path.resolve(__dirname, './src/locales/**'),
      }),
      Pages({
        pagesDir: [
          {
            dir: 'src/pages',
            baseRoute: '',
          },
        ],
      }),
      // ViteComponents({
      //   extensions: ['vue', 'md'],
      //   dirs: ['documentation', 'src/components', 'src/layouts'],
      //   customLoaderMatcher: (path) => path.endsWith('.md'),
      // }),
      imagetools(),
      PurgeIcons(),
      Components({
        dirs: ['documentation', 'src/components', 'src/layouts'],
        extensions: ['vue', 'md'],
        dts: true,
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),
      ViteFonts({
        google: {
          families: [
            {
              name: 'Fira Code',
              styles: 'wght@400;600',
            },
            {
              name: 'Montserrat',
              styles: 'wght@500;600;700;800;900',
            },
            {
              name: 'Roboto',
              styles: 'wght@300;400;500;600;700',
            },
          ],
        },
      }),
      ViteRadar({
        analytics: {
          id: 'G-8PH6FM2JEL',
        },
      }),

      VitePWA({
        base: '/',
        includeAssets: [
          'favicon.svg',
          'favicon.ico',
          'robots.txt',
          'apple-touch-icon.png',
        ],
        manifest: {
          name: 'Solarspeed - A complete Vue 3 design system',
          short_name: 'Solarspeed',
          start_url: '/?utm_source=pwa',
          display: 'standalone',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),

      ImageMin({
        gifsicle: {
          optimizationLevel: 3,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 3,
        },
        mozjpeg: {
          quality: 90,
        },
        pngquant: {
          quality: [0.8, 1],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
              active: false,
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    ],
  }
}
