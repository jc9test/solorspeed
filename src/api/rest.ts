import axiosClient from '../composable/useApi'

// GET 類會帶groupName參數
// POST 類groupName會在data中

// export const getAppProfile = (id, groupName) => {
//     return axiosClient.get(`/rest/app-profiles/${id}?groupName=${groupName}`);
// };

export const _getDashboard = (id: any, groupName: any) => {
  return axiosClient.get(`/rest/dashboard/${id}?groupName=${groupName}`)
}

export const _updateDashboard = (id: any, data: any) => {
  return axiosClient.post(`/rest/dashboard/${id}`, data)
}

export const _getObjectLog = (id: any, groupName: any) => {
  return axiosClient.get(`/rest/object-log/${id}?groupName=${groupName}`)
}

// export const _getCert = (id, groupName) => {
//     return axiosClient.get(`/rest/certs/${id}?groupName=${groupName}`);
// };

export const _getResource = (endPoint: any, id: any, groupName: any) => {
  return axiosClient.get(`/rest/${endPoint}/${id}?groupName=${groupName}`)
}

export const _searchResources = (searchText: any, groupName: any) => {
  const queryString = new URLSearchParams({
    q: searchText,
    groupName,
  }).toString()
  return axiosClient.get(`/rest/resources?${queryString}`)
}
