/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosClient from '../composable/useApi'

export interface GroupAsset {
  category: string
  groupNames: string | string[]
}
export interface GroupAssetSubscription {
  category: string
  groupNames: string
  subscription: any
}
export const getGroupAsset = ({ category, groupNames }: GroupAsset) => {
  const params = { category, groupNames }
  if (groupNames == 'all') {
    params.groupNames = ''
  } else {
    params.groupNames = groupNames
  }
  // if (groupNames !== undefined && groupNames.length > 0 && !groupNames.some(e => e == "*" || e == "all"))

  const queryString = new URLSearchParams(params).toString()
  return axiosClient.get(`/monitor/groupasset?${queryString}`)
}

export const updateSubscription = ({
  category,
  groupNames,
  subscription,
}: GroupAssetSubscription) => {
  let updateDataKey = category + 'Subscription'
  const updateData = {}
  updateData ? ([updateDataKey] = subscription) : ''

  return axiosClient.post(`/table/rcm-edgegroup/update/partialUpdate`, {
    docId: groupNames,
    groupName: groupNames,
    updateData: updateData,
    esIndex: 'rcm-edgegroups',
  })
}
