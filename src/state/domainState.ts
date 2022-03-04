import store from '/@src/stores/index'
import { reactive, ref } from 'vue'

export const domainList = store.getters.inGroupNames
export const refDomainList = ref(domainList)

export const currentDomain = reactive(ref(store.state.queryGroupName))
