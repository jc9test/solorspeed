import axiosClient from '../composable/useApi'

export const ipValidate = (topic: any, val: any) => {
  return axiosClient.post(`/validate/ipvalidate`, {
    topic: topic,
    val: val,
  })
}

export const luceneValidate = (val: any) => {
  return axiosClient.post(`/validate/lucenevalidate`, {
    val: val,
  })
}

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
