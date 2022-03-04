/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosClient from '../composable/useApi'

export interface LoginData {
  username: string
  password: string
  otpToken: string
}

export const getUserData = () => {
  return axiosClient.get(`/user`)
}

export const resendOtpMail = (data: any) => {
  return axiosClient.post(`/table/rcm-users/update/resendotpmail`, data)
}

export const resetPwdMail = (data: any) => {
  return axiosClient.post(`/table/rcm-users/update/resetpassword`, data)
}

export const removeFromGroup = (data: any) => {
  return axiosClient.post(`/table/rcm-users/update/removefromgroup`, data)
}

export const _login = (data: LoginData) => {
  return axiosClient.post(`/user/login`, data)
}

export const _logout = (data: any) => {
  return axiosClient.get(`/user/logout`)
}

export const getJwtToken = (data: any) => {
  return axiosClient.get(`/user/signtoken`)
}

export const resetPassword = (data: any) => {
  return axiosClient.post(`/user/resetpassword`, data)
}

export const _setGroupName = (data: any) => {
  return axiosClient.post(`/user/setgroupname`, data)
}

export const setUserAvatar = (data: any) => {
  return axiosClient.post(`/user/set-user-avatar`, data)
}

export const changeUserRole = ({ userName, groupName, roleName }: any) => {
  return axiosClient.post(`/user/change-user-role`, {
    userName,
    groupName,
    roleName,
  })
}

export const setUserLang = (data: any) => {
  return axiosClient.post(`/user/set-user-lang`, data)
}
