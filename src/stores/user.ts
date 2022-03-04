/* eslint-disable @typescript-eslint/no-unused-vars */
// Store for User
import { createStore } from 'vuex'
export interface UserState {
  userData: null | {
    currentLanguage: string
    email: string
    inGroupsRole: Array<Object>
    privilege: string
    userId: string
    username: string
  }
}

const userStore = {
  state: {
    userData: {
      currentLanguage: '',
      email: '',
      inGroupsRole: [],
      privilege: '',
      userId: '',
      username: '',
    },
  },
  getters: {
    getUserData(state: any): {} {
      return state.userData
    },
  },
  mutations: {
    SET_USER_DATA(state: UserState, data: any) {
      state.userData = data
    },
  },
}

export default userStore
