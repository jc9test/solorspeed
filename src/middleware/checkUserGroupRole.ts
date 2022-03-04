/* eslint-disable @typescript-eslint/no-unused-vars */
import store from '../stores/index'

import { landingPagePath } from '../middleware/landingPageMiddleware'

const LOGIN_PAGE_NAME = 'login'
const NOTFOUND_PAGE = 'error_404'
const ROOT_PAGE_NAME = 'root'
const LANDING_PAGE_PATH = store.getters.isAdmin ? '/home' : landingPagePath()

export const checkUserGroupRoleMiddleware = async (to: any, from: any) => {
  try {
    // 路由無須權限
    const userData: any = store.getters.getUserData
    // let userData: any = user.getters.getUserData

    if (!to.meta.requiredPermission || store.getters.isAdmin)
      return {
        nextOption: {},
      }
    const toQueryGroupName = to.query.groupName
    if (
      toQueryGroupName == 'all' &&
      ![ROOT_PAGE_NAME, LANDING_PAGE_PATH].includes(to.name)
    )
      return {
        nextOption: { path: LANDING_PAGE_PATH, query: { groupName: 'all' } },
      }
    const currentRole = userData.inGroupsRole.find(
      (e: any) => e.groupName == toQueryGroupName
    )
    // 當前角色設定找不到時, 比如群組在all, 自然沒有權限
    if (!currentRole)
      return {
        nextOption: { path: LANDING_PAGE_PATH, query: { groupName: 'all' } },
      }

    const requiredPermissionObject =
      currentRole.rolePermissions[to.meta.requiredPermission]

    let hasPermission: Boolean
    // 沒資料就沒權限（空值）
    if (requiredPermissionObject == undefined) {
      hasPermission = false
    } else {
      // 有資料且有找到相對應頁面沒權限就沒權限，有資料但沒找到相對應頁面就返回上一層權限
      hasPermission =
        requiredPermissionObject.children.filter(
          (e: any) => e.name == to.meta.requiredPermissionName
        ).length !== 0
          ? requiredPermissionObject.children.find(
              (e: any) => e.name == to.meta.requiredPermissionName
            ).read
          : requiredPermissionObject.read
    }

    // 用戶沒權限
    if (!hasPermission)
      return {
        nextOption: {
          path: LANDING_PAGE_PATH,
          query: { groupName: currentRole.groupName },
        },
      }

    return {
      nextOption: {},
    }
  } catch (err) {
    console.log(err)
  }
}
