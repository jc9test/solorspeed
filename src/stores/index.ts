/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import Vuex from 'vuex'
// import userStore from '../stores/user'
import serviceStore from '../stores/service'
import createPersistedState from 'vuex-persistedstate'

import { createStore } from 'vuex'
import { UserData } from '../composable/useUserSession'

export interface FrontEndConfig {
  frontendConfigs: {}
}
export interface PlatformPlan {
  platformPlan: {}
}

const store = createStore({
  modules: {
    // user: userStore,
    service: serviceStore,
  },

  state: () => ({
    queryGroupName: '604',
    allGroupNames: [],
    userAvatar: 'blond-curly-hair-business-lady',
    userPref: {},
    frontendConfigs: {},
    groupResourceLimits: {},
    userSelectedColumns: {
      eventLog: [],
      waf: [],
      cert: [],
      origin: [],
      html: [],
    },
    dashboardFilterOptions: {},
    userData: {},
    // userData: userStore.state.userData,
    maxRecordLb: {
      a: 0,
      cname: 0,
    },
    socketInfo: { socketId: null, connect: false },
    backendData: {
      thirdParty: { lineOptimize: { regionInfo: [] } },
    },
    dateRangeOptions: {
      index: '4',
      customTimeRange: [],
    },
    platformPlan: {
      currentPlan: 'basic',
      planSpec: [
        {
          planName: 'basic',
          dnsPodPlan: 'DP_Free',
          wafActions: ['00', '01', '06', '12', '13'],
          features: [],
          resourceLimits: {},
          packages: {},
        },
      ],
    },
    platformPrefs: {
      functions: {
        appProfile: {
          enterProfileDomainStyle: 'a',
        },
        domain: {
          domainWithNoneAppProfile: true,
          canBulkCreate: false,
          cnameInfoStyle: 'withText',
          isEnforceProtectWithPaw: true,
        },
        wafRule: {
          component: 'OneListDraggable',
        },
        serviceGroup: {
          isEnforceProtectWithPaw: true,
        },
      },
      pages: {
        LoginPage: {
          images: {
            loginFormLogoImgName: '/static/prefs/img/login_form_logo.png',
            backgroundLogoImgName: '',
            backgroundImgName: '/static/prefs/img/login_background.png',
          },
          loginDescription: 'CDN Management',
        },
        InnerPage: {
          images: {
            headerLogoImgName: '',
          },
          layout: {
            adminMenuDirection: 'vertical',
            normalUserMenuDirection: 'vertical',
            userWithAvatar: false,
            languageItems: ['en-US', 'zh-TW', 'zh-CN'],
            normalUserConfig: {
              hasHomePage: true,
              landingPagePath: '', //only works when `hasHompage: false`
              groupListWithAll: true,
            },
          },
        },
      },
      components: {
        Table: {
          withBorder: false,
          withModal: false,
          actionWithIcon: false,
          headerStyle: 'hasBackgroundColor',
          fixedColumn: false,
          paginationPosition: 'left',
          resizable: false,
        },
        Chart: {
          withRawBtn: true,
          showRawBtnStyle: 'iconBtn',
          colorScheme: {
            blue: 'rgb(87, 115, 153)',
            red: 'rgb(239, 99, 81)',
            green: 'rgb(112, 151, 117)',
            yellow: 'rgb(255, 188, 66)',
            darkYellow: 'rgb(253, 202, 64)',
            grey: 'rgb(153, 153, 161)',
            purple: 'rgb(166, 128, 140)',
            orange: 'rgb(255, 172, 129)',
            pink: 'rgb(234, 201, 193)',
            greyBlue: 'rgb(157, 180, 192)',
            brown: 'rgb(193, 140, 93)',
          },
          legendChart: {
            pointStyle: false,
          },
          dashboardQueryFilter: 'V2',
          dashboardWithSearchBtn: false,
          isCircleTCPListBtn: true,
        },
        Notify: {
          name: 'iview-notice',
          position: 'bottom left',
        },
        JsonPopTip: {
          withIcon: false,
        },
      },
      i18n: {},
      favicon: {
        faviconName: 'favicon.ico',
      },
      brandTitle: 'A8CDN',
      themeName: 'a8-cdn',
      layoutName: 'a8-cdn',
      fontFamily: '',
    },
    dashboard: {
      queryFilter: {
        // groupNames: queryGroupName,
        groupNames: ['604'],
        serviceGroupNames: [],
        appProfileNames: [],
        serverNames: [],
        tags: [],
        origins: [],
        originHosts: [],
        originPorts: [],
        slbNames: [],
        edgeNames: [],
        latencyStatusNames: [],
        dateRangeOptions: {
          index: '99',
          customTimeRange: ['2021-08-08 00:00', '2021-08-24 00:00'],
        },
      },
      dashboardChartOptions: {
        chartVisualizeType: 'lineChart',
        chartMetric: '',
        chartMetricGroupBy: '',
        chartMetricGroupByTerms: '',
        chartMetricGroupByTermSize: 10,
        chartMetricGroupByFilters: [],
        chartQueryFilters: [],
        dashboardQueryFilters: [],
      },
    },
  }),
  mutations: {
    SET_FRONTEND_CONFIGS(state, data) {
      state.frontendConfigs = data
    },
    SET_QUERY_GROUPNAME: (state, data) => {
      state.queryGroupName = data
      state.dashboard.queryFilter.groupNames = data == 'all' ? [] : [data]
    },
    SET_PLATFORM_PLAN(state, data) {
      state.platformPlan = data
    },
    SET_ALL_GROUPNAMES: (state, data) => {
      state.allGroupNames = data
    },
    SET_GROUP_RESOURCE_LIMITS: (state: any, data: any) => {
      const { groupName, groupResourceLimits } = data
      state.groupResourceLimits[groupName] = groupResourceLimits
    },
    // SET_DASHBOARD_QUERY_FILTER: (state, { key, value }) => {
    //   state.dashboard.queryFilter[key] = value;
    //   for dot notations
    //   objectPath.set(state.dashboard.queryFilter, key, value)
    // },
    SET_TIME_RANGE: (state: any, { index, customTimeRange }) => {
      state.dateRangeOptions.index = index
      state.dateRangeOptions.customTimeRange = customTimeRange
    },
    SET_DASHBOARD_QUERY_FILTER: (state, filters) => {
      state.dashboard.dashboardChartOptions.dashboardQueryFilters = filters
    },
    SET_USER_DATA(state, data) {
      state.userData = data
    },
    SET_USER_PREF(state, data) {
      state.userPref = data
    },
    SET_EVENTLOG_COLUMN_SELECTION(state, data) {
      state.userSelectedColumns.eventLog = data
    },
    SET_WAF_COLUMN_SELECTION(state, data) {
      state.userSelectedColumns.waf = data
    },
    SET_CERT_COLUMN_SELECTION(state, data) {
      state.userSelectedColumns.cert = data
    },
    SET_ORIGIN_COLUMN_SELECTION(state, data) {
      state.userSelectedColumns.origin = data
    },
    SET_HTML_COLUMN_SELECTION(state, data) {
      state.userSelectedColumns.html = data
    },
    SET_DASHBOARD_FILTER_OPTIONS(state, data) {
      state.dashboardFilterOptions = data
    },
  },
  getters: {
    isAdmin(state: any) {
      return store.state.userData.privilege == 'admin'
      // return userStore.state.userData.privilege == 'admin'
    },
    getNormalUserConfig(state: any) {
      return state.platformPrefs.pages.InnerPage.layout.normalUserConfig
    },
    inGroupNames(state: any) {
      if (!store.state.userData.privilege) return []
      const inGroupNames =
        store.state.userData.privilege == 'admin'
          ? JSON.parse(JSON.stringify(state.allGroupNames))
          : store.state.userData.inGroupsRole.map((e: any) => e.groupName)
      if (store.state.userData.privilege == 'admin') {
        inGroupNames.unshift('all')
      }

      if (
        state.platformPrefs.pages.InnerPage.layout.normalUserConfig.groupListWithAll &&
        store.state.userData.privilege !== 'admin'
        // userStore.state.userData.privilege !== 'admin'
      ) {
      }
      return inGroupNames
    },
    getUserData(state: any): {} {
      return state.userData
    },
    getEventLogColumnSelection(state: any) {
      return state.userSelectedColumns.eventLog
    },
    getWafColumnSelection(state: any) {
      return state.userSelectedColumns.waf
    },
    getCertColumnSelection(state: any) {
      return state.userSelectedColumns.cert
    },
    getOriginColumnSelection(state: any) {
      return state.userSelectedColumns.origin
    },
    getHtmlColumnSelection(state: any) {
      return state.userSelectedColumns.html
    },
    getDashboardFilterOptions(state: any) {
      return state.dashboardFilterOptions
    },
  },
  plugins: [
    createPersistedState({
      paths: [
        'queryGroupName',
        'allGroupNames',
        'userData',
        'userPref',
        'frontendConfigs',
        'userSelectedColumns',
        'dashboardFilterOptions',
        'maxRecordLb',
        'socketInfo',
        'backendData',
        'platformPrefs',
        'platformPlan',
        'userAvatar',
      ],
    }),
  ],
})

export default store
