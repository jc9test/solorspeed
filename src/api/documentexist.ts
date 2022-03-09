import axiosClient from '../composable/useApi'

export const checkDocumentExist = (options: {
  topic: string
  fieldVal: string
  groupName: string
}) => {
  return axiosClient.get(
    `/validate/documentexist?topic=${options.topic}&fieldVal=${
      options.fieldVal
    }&groupName=${options.groupName}&t=${new Date().getTime()}`
  )
}
