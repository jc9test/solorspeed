import store from '../stores/index'

export const landingPagePath = () => {
  if (
    store.getters.getNormalUserConfig.groupListWithAll ||
    store.getters.getNormalUserConfig.hasHomePage
  ) {
    return '/home'
  }
  if (!store.getters.getNormalUserConfig.groupListWithAll) {
    return store.getters.getNormalUserConfig.landingPagePath
  }
}
