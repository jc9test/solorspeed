import axiosClient from '../composable/useApi'

export interface MenuItems {
  menu: string
  groupName: string
}

export const getMenuItems = (data: MenuItems) => {
  return axiosClient.get(`/menuitems?menu=${data.menu}&groupName=${data.groupName}`)
}
