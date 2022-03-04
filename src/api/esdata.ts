import axiosClient from '../composable/useApi'

// export interface Options {
//   esIndex: Object
// }

export const getEsData = (options: any) => {
  return axiosClient.post(`/table/${options.esIndex}/search`, options)
}

export const _updateData = (esIndex: String, formData: Object) => {
  return axiosClient.post(`/table/${esIndex}/update/index`, formData)
}

export const _createData = (esIndex: String, formData: Object) => {
  return axiosClient.post(`/table/${esIndex}/update/create`, formData)
}

export const _deleteData = (esIndex: String, formData: Object) => {
  return axiosClient.post(`/table/${esIndex}/update/delete`, formData)
}

export const _bulkCreateData = (esIndex: String, formData: Object) => {
  return axiosClient.post(`/table/${esIndex}/update/bulk-create`, formData)
}

export const _batchUpdateData = (
  esIndex: Object,
  formData: Object,
  selectedItems: Array<String>
) => {
  return axiosClient.post(`/table/${esIndex}/update/batch`, {
    formData: formData,
    selectedItems: selectedItems,
  })
}
export const _batchDeleteData = (
  esIndex: Object,
  formData: Object,
  selectedItems: Array<String>
) => {
  return axiosClient.post(`/table/${esIndex}/update/batch-delete`, {
    formData: formData,
    selectedItems: selectedItems,
  })
}
export const updateDescription = (params: string, id: any, updateData: Object) => {
  return axiosClient.patch(`/general/${params}/${id}`, updateData)
}
