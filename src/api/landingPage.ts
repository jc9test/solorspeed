import store from '/@src/stores/index'
// const { inGroupNames } = store.getters;

// function normalUserLandingPagePath() {
//     if(store.getters.getNormalUserConfig.groupListWithAll||store.getters.getNormalUserConfig.hasHomePage) {
//         return '/home'
//     }
//     if(!store.getters.getNormalUserConfig.groupListWithAll){
//         return store.getters.getNormalUserConfig.landingPagePath
//     }
// }
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
