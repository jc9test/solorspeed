/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosClient from '../composable/useApi'

export const getSystemFrontendConfig = () => {
  return axiosClient.get(`/system/frontendconfigs`)
}

export const updateSystemFrontendConfig = (data: Object) => {
  return axiosClient.post(`/system/frontendconfigs/update`, data)
}

export const getMaxRecordLb = (options: any) => {
  return axiosClient.get(
    `/system/backendconfigs/maxrecordlb?recordType=${options.recordType}`
  )
}

export const getMaxSubdomainLength = (options: any) => {
  return axiosClient.get(`/system/backendconfigs/maxsubdomainlength`)
}

export const getPlatformPlan = () => {
  return axiosClient.get(`/system/platformplan`)
}
