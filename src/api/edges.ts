import axiosClient from '../composable/useApi'

export const _purgeCache = (purgeData: any) => {
  return axiosClient.post(`/edges/purgecache`, purgeData)
}
