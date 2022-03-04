import axiosClient from '../composable/useApi'

export const getEdgeChartData = (options: any) => {
  const apiEndpoint = options.apiEndpoint || '/monitor/edgechartdata'
  return axiosClient.post(apiEndpoint, options)
}

export const getEdgeChartDataV2 = (options: any) => {
  const apiEndpoint = options.apiEndpoint || '/monitor/edgechartdata-v2'
  return axiosClient.post(apiEndpoint, options)
}

// 準備棄用; 透過上面的api整合
export const getMbChartData = (options: any) => {
  return axiosClient.post(`/monitor/mbchartdata`, options)
}

export const getSlbExternCheckStats = (hostname: any) => {
  return axiosClient.get(`/monitor/slbexterncheckstats?hostname=${hostname}`)
}

export const _getAlertRuleLogs = (options: any) => {
  // let { groupName, ruleName, dateTime } = options;
  const { groupName, ruleName, dateTime } = options
  return axiosClient.get(
    `/monitor/alertrulelogs?groupName=${groupName}&ruleName=${ruleName}&dateTime=${dateTime}`
  )
}
