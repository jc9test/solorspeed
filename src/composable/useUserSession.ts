// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { InjectionKey, ref, computed, inject, reactive } from 'vue'
import { useStorage } from '@vueuse/core'

export const userSessionSymbol: InjectionKey<UserSessionData> = Symbol()

export type UserData = Record<string, any> | null

export interface UserSessionData {
  token: string
  user: UserData
  isLoggedIn: boolean
}

export function initUserSession(): UserSessionData {
  const token = useStorage('token', '')
  const user = ref<UserData>(null)
  const isLoggedIn = computed(() => token.value !== '')

  return reactive({
    token,
    user,
    isLoggedIn,
  })
}
