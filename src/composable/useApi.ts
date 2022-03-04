/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectionKey, inject } from 'vue'
import axios, { AxiosInstance } from 'axios'
import store from '../stores'
import { useRouter, useRoute } from 'vue-router'

// import { useUserSession } from '/@src/stores/userSession'

export const apiSymbol: InjectionKey<AxiosInstance> = Symbol()
// let api: AxiosInstance

// export function createApi() {
//   // Here we set the base URL for all requests made to the api
//   api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//   })

//   // We set an interceptor for each request to
//   // include Bearer token to the request if user is logged in
//   api.interceptors.request.use((config) => {
//     const userSession = useUserSession()

//     if (userSession.isLoggedIn) {
//       config.headers = {
//         ...config.headers,
//         Authorization: `Bearer ${userSession.token}`,
//       }
//     }

//     return config
//   })

//   return api
// }

// export function useApi() {
//   if (!api) {
// createApi()
//   }
//   return api
// }

// FROM web-user
const api_live_mode = import.meta.env.VITE_API_LIVE_MODE
const api_live_url = import.meta.env.VITE_API_LIVE_URL
const axiosInstance = axios.create({
  baseURL: api_live_mode == 'true' ? `${api_live_url}` : '/api',
  // baseURL: '/api', // process.env.MODE == 'production' ? process.env.VITE_API_URL : '/api',
})
const router = useRouter()

axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response.status == 401) {
      if (error.response.config.url === '/user/login') {
        return Promise.reject('setting.notif.unauthorized_login')
      }
      store.commit('SET_USER_DATA', {})
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
