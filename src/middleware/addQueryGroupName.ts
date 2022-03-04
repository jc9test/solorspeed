/* eslint-disable @typescript-eslint/no-unused-vars */
import store from '../stores/index'
const LOGIN_PAGE_NAME = 'login'
const NOTFOUND_PAGE = 'error_404'
const ROOT_PAGE_NAME = 'root'

export const addQueryGroupNameMiddleware = async (to: any, from: any) => {
  try {
    // 配置filter群組路由
    if (to.name == NOTFOUND_PAGE)
      return {
        nextOption: {},
      }
    const inGroupNames = store.getters.inGroupNames
    const toQueryGroupName = to.query.groupName
    // console.log('store query group name ' + store.state.queryGroupName)
    // console.log('store group names ' + store.getters.allGroupNames)
    // console.log('toQueryGroupName ' + toQueryGroupName)
    // console.log('inGroupNames ' + inGroupNames)
    // console.log(store.getters.getNormalUserConfig.groupListWithAll)
    // 注意state.queryGroupName不取變數, 因為值有可能更改, 先獲取的變數不會跟著改變
    if (store.getters.getNormalUserConfig.groupListWithAll && !toQueryGroupName) {
      // store.commit('SET_QUERY_GROUPNAME', inGroupNames[0])
    }
    // console.log('middleware groupNames ' + inGroupNames)
    // 如果有給query
    if (toQueryGroupName) {
      if (toQueryGroupName && toQueryGroupName !== store.state.queryGroupName) {
        if (inGroupNames.includes(toQueryGroupName)) {
          // console.log(`${toQueryGroupName} different from store`);
          // console.log(`${toQueryGroupName} is valid, commit to store`);
          store.commit('SET_QUERY_GROUPNAME', toQueryGroupName)
          return {
            nextOption: {},
          }
        } else {
          // console.log(`${toQueryGroupName} is NOT valid, use store state`);
          return {
            nextOption: {
              path: to.path,
              query: { groupName: store.state.queryGroupName },
            },
          }
        }
      } else {
        // console.log(`${toQueryGroupName}, same as store, nothing to do`);
        return {
          nextOption: {},
        }
      }
    } else {
      // console.log(
      //   `No given query, detect store has ${store.state.queryGroupName}, adding query`
      // )
      if (to.query.appProfileName) {
        return {
          nextOption: {
            path: to.path,
            query: {
              appProfileName: to.query.appProfileName,
              groupName: store.state.queryGroupName,
            },
          },
        }
      } else {
        return {
          nextOption: {
            path: to.path,
            query: { groupName: store.state.queryGroupName },
          },
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}
