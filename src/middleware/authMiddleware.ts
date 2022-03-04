/* eslint-disable @typescript-eslint/no-unused-vars */
import store from '../stores/index'
import { landingPagePath } from '../middleware/landingPageMiddleware'
import { getUserData } from '/@src/api/user'
import { useRouter } from 'vue-router'

const router = useRouter()
// import { RouteLocationNormalized } from 'vue-router'

const LOGIN_PAGE_NAME = 'login'
const NOTFOUND_PAGE = 'error_x404'
const ROOT_PAGE_NAME = 'root'
const LANDING_PAGE_PATH = '/home'

const fetchUserData = async () => {
  try {
    const userDataResult = await getUserData()
    const userData = userDataResult.data
    store.commit('SET_USER_DATA', userData)
    // user.mutations.SET_USER_DATA(user.state, userData)
  } catch (err) {
    // console.log(err)
    store.commit('SET_USER_DATA', {})
    router.push({
      name: 'login',
    })
  }
}
export const authMiddleware = async (to: any, from: any) => {
  try {
    fetchUserData()

    // const userData: any = user.state.userData
    const userData: any = store.state.userData

    // 未登入
    if (userData.privilege === undefined) throw new Error('Login problem?')

    // 已登入, 請求登入頁或是根目錄
    if (to.name === LOGIN_PAGE_NAME || to.name === ROOT_PAGE_NAME)
      return {
        nextOption: {
          path: LANDING_PAGE_PATH,
        },
      }

    // 用戶有權限
    // if (to.meta.rule.indexOf(userData.privilege) > -1)
    //   return {
    //     nextOption: {},
    //   }
    return {
      nextOption: {},
    }

    // 用戶沒權限
    // return {
    //   nextOption: {
    //     path: LANDING_PAGE_PATH,
    //   },
    // }
  } catch (err) {
    // console.log(err)
    if (to.name === LOGIN_PAGE_NAME) {
      // console.log('未登錄且要跳轉的頁面是登錄頁')
      throw { nextOption: {} }
    } else {
      // console.log('未登錄且要跳轉的頁面不是登錄頁')
      throw {
        nextOption: {
          name: LOGIN_PAGE_NAME,
        },
      }
    }
  }
}
