import axiosClient from '../composable/useApi'

export const getFormOptions = (endpoint: any) => {
  return axiosClient.get(`/formoptions/${endpoint}`)
}

export const getTimeRangeOptions = () => {
  return axiosClient.get(`/formoptions/timerangeoptions`)
}

export const getGroupNamesOption = () => {
  return axiosClient.get(`/formoptions/groupnames`)
}

export const getRedirectHttpCodeOption = () => {
  return axiosClient.get(`/redirect-http-code?codeName=***`)
}

export const getServiceGroupNameOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/servicegroupnames?groupNames=${filter}`)
}

export const getAppProfileNamesOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/app-profilenames?groupNames=${filter}`)
}

export const getServerNamesOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/servernames?groupNames=${filter}`)
}

export const getOriginOption = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/origins?groupNames=${filter}`)
}

export const getServiceLineNameOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/groupasset/slbnames?withVirtual=false&groupNames=${filter}`)
}

export const getEdgeNamesOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/groupasset/edgenames?groupNames=${filter}`)
}

export const getTagOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/groupby/tags?groupNames=${filter}`)
}
export const getWafActionOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/wafactions?actionName=***`)
}

export const getWafRulesOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/wafrules?groupNames=${filter}`)
}

export const getOriginPolicyNamesOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/originpolicynames?groupNames=${filter}`)
}

export const getHtmlPageNamesOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/htmlpagenames?groupNames=${filter}`)
}

export const getHttpPortOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/groupby/httpPort?groupNames=${filter}`)
}

export const getHttpsPortOptions = (filter: any) => {
  if(!filter){
    filter='*'
  }
  return axiosClient.get(`/formoptions/groupby/httpsPort?groupNames=${filter}`)
}

export const getChartFilterValueOptions = (filter: any) => {
  if(!filter){
    filter=''
  }
  return axiosClient.get(`/formoptions/chart-filter-value${filter}`)
}
