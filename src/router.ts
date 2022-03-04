import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'

const routes: any = [
  {
    component: () => import('/@src/pages/index.vue'),
    path: '/home',
    name: 'index',
    children: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        component: () => import('/@src/pages/dashboard/home.vue'),
        path: '',
        name: 'index',
        children: [
          {
            path: '/',
            redirect: '/',
          },
          {
            component: () => import('/@src/components/dashboard/Request.vue'),
            name: 'home',
            path: '',
            props: true,
          },
          {
            component: () => import('./components/dashboard/DataUsage.vue'),
            name: 'home.data-usage',
            path: 'data-usage',
            props: true,
          },
          {
            component: () => import('/@src/components/dashboard/Firewall.vue'),
            name: 'home.firewall',
            path: 'firewall',
            props: true,
          },
          {
            component: () => import('/@src/components/dashboard/Acceleration.vue'),
            name: 'home.acceleration',
            path: 'acceleration',
            props: true,
          },
        ],
      },
      {
        component: () => import('/@src/pages/services/index.vue'),
        path: '/service-lines',
        name: 'lines',
        props: true,
      },
      {
        component: () => import('/@src/pages/services/service-create.vue'),
        path: '/service-lines/create',
        name: 'add',
      },
      {
        component: () => import('/@src/pages/profile/profile.vue'),
        name: 'home-profile',
        path: '/user/profile',
        props: true,
        children: [
          {
            component: () => import('/@src/pages/profile/profile-setting.vue'),
            name: 'profile-general',
            path: '/user/profile',
            prop: true,
          },
          {
            component: () => import('/@src/pages/profile/profile-change-password.vue'),
            name: 'profile-change-password',
            path: '/user/change-password',
            prop: true,
          },
          {
            component: () => import('/@src/pages/profile/profile-security.vue'),
            name: 'profile-security',
            path: '/user/security',
            prop: true,
          },
          {
            component: () => import('/@src/pages/profile/profile-subscription.vue'),
            name: 'profile-subscription',
            path: '/user/subscription',
            prop: true,
          },
        ],
      },
      {
        component: () => import('/@src/pages/services-detail/service.vue'),
        name: 'service',
        path: '/service',
        props: true,
        children: [
          {
            path: '',
            redirect: '/service/overview',
            props: true,
          },
          {
            component: () => import('/@src/pages/services-detail/index.vue'),
            path: 'overview/:appProfileName?/:groupName?',
            name: 'service.overview',
            props: true,
          },
        ],
      },
      {
        component: () => import('/@src/pages/firewall_rules/index.vue'),
        name: 'firewall_rules',
        path: '/firewall_rules',
        props: true,
      },
      {
        component: () => import('/@src/pages/html/index.vue'),
        name: 'html',
        path: '/html',
      },
      {
        component: () => import('/@src/pages/origin_policy/index.vue'),
        name: 'origin_policy',
        path: '/origin_policy',
        props: true,
      },
      {
        component: () => import('/@src/pages/certificate/index.vue'),
        name: 'certs',
        path: '/certs',
        props: true,
      },
      {
        component: () => import('/@src/pages/event-logs/index.vue'),
        name: 'event-logs',
        path: '/event-logs',
        props: true,
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('/@src/pages/[...all].vue'),
  },
  {
    component: () => import('/@src/pages/auth/login.vue'),
    name: 'login',
    path: '/login',
    props: true,
  },
  {
    component: () => import('/@src/pages/logout.vue'),
    name: 'logout',
    path: '/logout',
    props: true,
    children: {
      path: '',
      redirect: '/login',
    },
  },
  {
    component: () => import('/@src/pages/auth/signup.vue'),
    name: 'signup',
    path: '/signup',
    props: true,
  },
  // {
  //   component: () => import('/@src/pages/subscribe.vue'),
  //   name: 'subscribe',
  //   path: '/subscribe',
  //   props: true,
  // },
]

export function createRouter2() {
  const router = createRouter({
    /**
     * If you need to serve solarspeed under a subdirectory,
     * you have to set the name of the directory in createWebHistory here
     * and update "base" config in vite.config.ts
     */
    // history: createWebHistory('my-subdirectory'),
    history: createWebHistory(),
    routes,
  })

  /**
   * Handle NProgress display on page changes
   */
  router.beforeEach(() => {
    NProgress.start()
  })
  router.afterEach(() => {
    NProgress.done()
  })

  return router
}
