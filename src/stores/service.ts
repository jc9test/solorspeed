/* eslint-disable @typescript-eslint/no-unused-vars */
// Store for User
import axiosClient from '../composable/useApi'
import { createStore } from 'vuex'
import { ipValidate, luceneValidate } from '/@src/api/formValidate'
import { getEsData } from '/@src/api/esdata'
import store from '/@src/stores/index'
import useNotyf from '/@src/composable/useNotyf'

const notif = useNotyf()

export interface ServiceState {
  service_detail: {
    appProfileName: string
    serviceGroupName: string
    origins: Array<String>
    originscheme: string
    portMappingType: string
    originPort: Number
    servername: string
    certs: boolean
    useHsts: boolean
    redirecthttps: boolean
    redirectHttpCode: number
    httpPort: Array<String>
    httpsPort: Array<String>
    scheme: Array<String>
    groupName: string
    tags: Array<String>
    useOriginPolicy: boolean
    usedOriginPolicies: Array<Object>
    isWildcardDomain: boolean
    wildcardServername: string
    proxyCacheIgnoreArgs: boolean
    cusCachepath: string
    cusCachefile: string
    forceCusCachePath: string
    forceCusCacheFile: string
    cusNoncachepath: string
    cusNonachefile: string
    errorHtmlPageName: string
    upstreamTimeout: number
    isEnabledCompressionToOrigin: boolean
    isEnabledUpstreamHttp11: boolean
    isInsertRidHeaderToOrigin: boolean
    setCustomHostHeader: string
    customHostHeader: string
    isAcceptHttpV1: boolean
    websocketPath: string
    proxyBufferSize: number
    isUpgradeInsecureRequest: boolean
    maxUploadSize: number
    cusFollowCachePath: string
    cusFollowCacheFile: string
    cusCachepathExp: string
    cusCachepathSrvexp: string
    cusCachepathHottime: string
    cusCachefileExp: string
    cusCachefileSrvexp: string
    cusCachefileHottime: string
    defCachefileExp: string
    defCachefileSrvexp: string
    defCachefileHottime: string
    description: string
    usedWafRules: Array<Object>
  }
  cname: string
  service_list: null | Array<Object>
  appProfileName: string
  refreshTable: boolean
}

const userStore = {
  state: {
    service_detail: {
      appProfileName: '',
      cusCachefile: '',
      cusCachefileExp: '1d',
      cusCachefileHottime: '1',
      cusCachefileSrvexp: '1d',
      cusCachepath: '',
      cusCachepathExp: '1d',
      cusCachepathHottime: '1',
      cusCachepathSrvexp: '1d',
      cusFollowCacheFile: '',
      cusFollowCachePath: '',
      cusNonachefile: '',
      cusNoncachepath: '',
      customHostHeader: '',
      defCachefileExp: '1d',
      defCachefileHottime: '1',
      defCachefileSrvexp: '1d',
      description: '',
      servername: '',
      errorHtmlPageName: 'default',
      forceCusCacheFile: '',
      forceCusCachePath: '',
      groupName: '',
      httpPort: [],
      httpsPort: [],
      isAcceptHttpV1: false,
      isEnabledCompressionToOrigin: true,
      isEnabledUpstreamHttp11: true,
      isInsertRidHeaderToOrigin: false,
      isUpgradeInsecureRequest: false,
      maxUploadSize: 1,
      originPort: '',
      origins: [],
      originscheme: '',
      portMappingType: 'default',
      proxyBufferSize: 4,
      proxyCacheIgnoreArgs: false,
      redirectHttpCode: '302',
      redirecthttps: false,
      scheme: [],
      serviceGroupName: '',
      keypairname: 'self-sign',
      isEnforceProtect: false,
      useHttp2: false,
      setCustomHostHeader: 'off',

      upstreamTimeout: 60,
      useHsts: false,
      useOriginPolicy: false,
      usedOriginPolicies: [],
      useSystemCert: false,
      usedWafRules: [],
      websocketPath: '',
      tags: [],
    },
    cname: '',
    service_list: ['caricarz.my', 'spotify.app'],
    appProfileName: '',
    refreshTable: false,
  },
  getters: {
    getCname(state: ServiceState) {
      return state.cname
    },
    refreshTable(state: ServiceState) {
      return state.refreshTable
    },
  },
  mutations: {
    SET_SERVICE_DETAIL(state: ServiceState, detail: any) {
      if (detail.isWildcardDomain !== undefined) {
        delete detail.isWildcardDomain
      }
      if (detail.wildcardServername !== undefined) {
        delete detail.wildcardServername
      }
      if (detail.wildcardSubdomain !== undefined) {
        delete detail.wildcardSubdomain
      }
      state.service_detail = detail
      state.appProfileName = detail.appProfileName
    },
    SET_ESSENTIAL(state: ServiceState, detail: any) {
      state.service_detail.serviceGroupName = detail.serviceGroupName.value
      state.service_detail.tags = detail.tags
      state.service_detail.description = detail.desc
    },
    SET_ORIGIN_DETAILS(state: ServiceState, detail: any) {
      state.service_detail.origins = detail.origins.value
      state.service_detail.useOriginPolicy = detail.useOriginPolicy

      state.service_detail.originPort = detail.originPort.value
      state.service_detail.originscheme = detail.originscheme
      state.service_detail.portMappingType = detail.portMappingType
      state.service_detail.usedOriginPolicies = detail.usedOriginPolicies
    },
    SET_SSL_DETAILS(state: ServiceState, detail: any) {
      state.service_detail.httpPort = detail.httpPort
      state.service_detail.httpsPort = detail.httpsPort
    },
    SET_CREATE_SERVICE(state: ServiceState, data: any) {
      console.log(state.service_detail)
      state.service_detail.appProfileName = data.appProfileName.value
      state.service_detail.serviceGroupName = data.serviceGroupName.value
      state.service_detail.portMappingType = data.portMappingType.value
      state.service_detail.originPort = data.originPort.value
      state.service_detail.origins = data.origins.value
      state.service_detail.scheme = data.scheme.value
      state.service_detail.originscheme = data.originscheme.value
      state.service_detail.groupName = store.state.queryGroupName
    },
    SET_SSL(state: ServiceState, data: any) {
      state.service_detail.servername = data.servername
      state.service_detail.scheme = data.scheme
      state.service_detail.useHsts = data.useHsts
      state.service_detail.redirecthttps = data.redirecthttps
      state.service_detail.redirectHttpCode = data.redirectHttpCode
      state.service_detail.httpPort = data.httpPort
      state.service_detail.httpsPort = data.httpsPort
    },
    UPDATE_SSL(state: ServiceState, data: any) {
      state.service_detail.servername = data.servername
      state.service_detail.scheme = data.scheme.value
      state.service_detail.useHsts = data.useHsts
      state.service_detail.redirecthttps = data.redirecthttps
      state.service_detail.redirectHttpCode = data.redirectHttpCode
      state.service_detail.httpPort = data.httpPort.value
      state.service_detail.httpsPort = data.httpsPort.value
    },
    SET_DOMAIN_NAME(state: ServiceState, data: any) {
      state.service_detail.servername = data.servername
      state.service_detail.certs = data.certs
    },
    SET_CNAME(state: ServiceState, cname: string) {
      userStore.state.cname = cname
    },
    SET_APP_PROFILE_NAME(state: ServiceState, appProfileName: string) {
      userStore.state.appProfileName = appProfileName
    },
    SET_CACHE_RULES(state: ServiceState, rules: any) {
      state.service_detail.cusCachefile = rules.cusCachefile
      state.service_detail.cusCachepath = rules.cusCachepath
      state.service_detail.forceCusCacheFile = rules.forceCusCacheFile
      state.service_detail.forceCusCachePath = rules.forceCusCachePath
      state.service_detail.proxyCacheIgnoreArgs = rules.proxyCacheIgnoreArgs
    },
    SET_NO_CACHE_RULES(state: ServiceState, rules: any) {
      state.service_detail.cusNonachefile = rules.cusNonachefile
      state.service_detail.cusNoncachepath = rules.cusNoncachepath
    },
    SET_ADVANCED_SETTINGS(state: ServiceState, settings: any) {
      state.service_detail.errorHtmlPageName = settings.errorHtmlPageName
      state.service_detail.upstreamTimeout = settings.upstreamTimeout
      state.service_detail.isEnabledCompressionToOrigin =
        settings.isEnabledCompressionToOrigin
      state.service_detail.isEnabledUpstreamHttp11 = settings.isEnabledUpstreamHttp11
      state.service_detail.isInsertRidHeaderToOrigin = settings.isInsertRidHeaderToOrigin
      state.service_detail.setCustomHostHeader = settings.setCustomHostHeader
      state.service_detail.customHostHeader = settings.customHostHeader
      state.service_detail.isAcceptHttpV1 = settings.isAcceptHttpV1
      state.service_detail.websocketPath = settings.websocketPath
      state.service_detail.proxyBufferSize = settings.proxyBufferSize
      state.service_detail.isUpgradeInsecureRequest = settings.isUpgradeInsecureRequest
      state.service_detail.maxUploadSize = settings.maxUploadSize
      state.service_detail.cusFollowCachePath = settings.cusFollowCachePath
      state.service_detail.cusFollowCacheFile = settings.cusFollowCacheFile
      state.service_detail.cusCachepathExp = settings.cusCachepathExp
      state.service_detail.cusCachepathSrvexp = settings.cusCachepathSrvexp
      state.service_detail.cusCachepathHottime = settings.cusCachepathHottime
      state.service_detail.cusCachefileExp = settings.cusCachefileExp
      state.service_detail.cusCachefileSrvexp = settings.cusCachefileSrvexp
      state.service_detail.cusCachefileHottime = settings.cusCachefileHottime
      state.service_detail.defCachefileExp = settings.defCachefileExp
      state.service_detail.defCachefileSrvexp = settings.defCachefileSrvexp
      state.service_detail.defCachefileHottime = settings.defCachefileHottime
    },
    SET_WAF_RULES(state: ServiceState, rules: any) {
      state.service_detail.usedWafRules = rules
    },
    SET_REFRESH_TABLE(state: ServiceState, data: any) {
      state.refreshTable = data
    },
  },
  actions: {
    async updateServiceForm(state: ServiceState) {
      const origins = userStore.state.service_detail.origins
      const appProfileName = userStore.state.service_detail.appProfileName
      await ipValidate('origin', origins).then(async (result) => {
        if (!result.data.success) {
          console.log('failed')
        } else {
          try {
            await axiosClient
              .post(
                '/table/rcm-app-profiles/update/index',
                userStore.state.service_detail
              )
              .then((res) => {
                if (res.data.taskNo == '') {
                  notif.error(
                    `Service Line is already deploying. Please try again later.`
                  )
                } else {
                  notif.success('Update successful!')
                }
              })
          } catch (err) {
            console.log(err)
          }
        }
      })
    },
    async createServiceForm(state: ServiceState) {
      // // set to default when create new service line
      // userStore.state.service_detail.cusNonachefile = ''
      // userStore.state.service_detail.cusNoncachepath = ''
      // userStore.state.service_detail.cusCachefile = ''
      // userStore.state.service_detail.cusCachepath = ''
      // userStore.state.service_detail.forceCusCacheFile = ''
      // userStore.state.service_detail.forceCusCachePath = ''
      // userStore.state.service_detail.proxyCacheIgnoreArgs = false
      // userStore.state.service_detail.cusFollowCachePath = ''
      // userStore.state.service_detail.cusFollowCacheFile = ''
      // userStore.state.service_detail.cusCachepathExp = '1d'
      // userStore.state.service_detail.cusCachepathSrvexp = '1d'
      // userStore.state.service_detail.cusCachepathHottime = '1'
      // userStore.state.service_detail.cusCachefileExp = '1d'
      // userStore.state.service_detail.cusCachefileSrvexp = '1d'
      // userStore.state.service_detail.cusCachefileHottime = '1'
      // userStore.state.service_detail.defCachefileExp = '1d'
      // userStore.state.service_detail.defCachefileSrvexp = '1d'
      // userStore.state.service_detail.defCachefileHottime = '1'
      // userStore.state.service_detail.description = ''

      // userStore.state.service_detail.upstreamTimeout = 60
      // userStore.state.service_detail.useOriginPolicy = false
      // userStore.state.service_detail.usedOriginPolicies = []
      // userStore.state.service_detail.usedWafRules = []
      // userStore.state.service_detail.websocketPath = ''
      // userStore.state.service_detail.tags = []

      const origins = userStore.state.service_detail.origins
      const appProfileName = userStore.state.service_detail.appProfileName
      await ipValidate('origin', origins).then(async (result) => {
        console.log({ 'create - submit form': userStore.state.service_detail })
        if (!result.data.success) {
          console.log('failed')
        } else {
          try {
            await axiosClient
              .post(
                '/table/rcm-app-profiles/update/create',
                userStore.state.service_detail
              )
              .then((res) => {
                if (res.data.taskNo == '') {
                  notif.error(
                    `Service Line is already deploying. Please try again later.`
                  )
                } else {
                  notif.success('Create successful!')
                  userStore.mutations.SET_APP_PROFILE_NAME(state, appProfileName)
                }
                console.log({ 'create - return data': res })
              })
          } catch (err) {
            console.log(err)
          }
        }
      })
    },
    async createDomain(state: ServiceState) {
      // // set to default when create new service line
      // userStore.state.service_detail.cusNonachefile = ''
      // userStore.state.service_detail.cusNoncachepath = ''
      // userStore.state.service_detail.cusCachefile = ''
      // userStore.state.service_detail.cusCachepath = ''
      // userStore.state.service_detail.forceCusCacheFile = ''
      // userStore.state.service_detail.forceCusCachePath = ''
      // userStore.state.service_detail.proxyCacheIgnoreArgs = false
      // userStore.state.service_detail.cusFollowCachePath = ''
      // userStore.state.service_detail.cusFollowCacheFile = ''
      // userStore.state.service_detail.cusCachepathExp = '1d'
      // userStore.state.service_detail.cusCachepathSrvexp = '1d'
      // userStore.state.service_detail.cusCachepathHottime = '1'
      // userStore.state.service_detail.cusCachefileExp = '1d'
      // userStore.state.service_detail.cusCachefileSrvexp = '1d'
      // userStore.state.service_detail.cusCachefileHottime = '1'
      // userStore.state.service_detail.defCachefileExp = '1d'
      // userStore.state.service_detail.defCachefileSrvexp = '1d'
      // userStore.state.service_detail.defCachefileHottime = '1'
      // userStore.state.service_detail.description = ''

      // userStore.state.service_detail.upstreamTimeout = 60
      // userStore.state.service_detail.useOriginPolicy = false
      // userStore.state.service_detail.usedOriginPolicies = []
      // userStore.state.service_detail.usedWafRules = []
      // userStore.state.service_detail.websocketPath = ''
      // userStore.state.service_detail.tags = []
      const origins = userStore.state.service_detail.origins
      await ipValidate('origin', origins).then(async (result) => {
        if (!result.data.success) {
          console.log('failed')
        } else {
          try {
            console.log(userStore.state.service_detail)
            await axiosClient
              .post(
                '/table/rcm-nginxconfigs/update/create',
                userStore.state.service_detail
              )
              .then((res) => {
                if (res.data.taskNo == '') {
                  notif.error('')
                } else {
                  notif.success('Create successful!')
                  userStore.getters.getCname(state)
                }
              })
          } catch (err) {
            console.log(err)
          }
        }
      })
    },
    async getCNAME(state: ServiceState) {
      console.log('getCName')
      let cname = ''
      const servername = userStore.state.service_detail.servername
      cname = servername + '.ssdev4u.com'

      userStore.mutations.SET_CNAME(state, cname)
    },
  },
}

export default userStore
