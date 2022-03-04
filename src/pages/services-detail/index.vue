<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'

import { getEsData, _updateData } from '/@src/api/esdata'
import useNotyf from '/@src/composable/useNotyf'
import store from '/@src/stores/index'
import serviceStore from '/@src/stores/service'
import { activeSidebar, toggleSidebar } from '/@src/state/overviewState'
import { pageTitle } from '/@src/state/sidebarLayoutState'
// import { data } from '/@src/data/layouts/services-lines'

import EssentialCard from '/@src/pages/services-detail/container/EssentialCard.vue'
import OriginCard from '/@src/pages/services-detail/container/OriginCard.vue'
import SslCard from '/@src/pages/services-detail/container/SslCard.vue'
import FirewallCard from '/@src/pages/services-detail/container/FirewallCard.vue'
import CacheCard from '/@src/pages/services-detail/container/CacheCard.vue'
import AdvancedSettingCard from './container/AdvancedSettingCard.vue'
import DomainCard from './container/DomainCard.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const notif = useNotyf()

const essentialRef = ref<HTMLElement | null>(null)
const originRef = ref<HTMLElement | null>(null)
const sslRef = ref<HTMLElement | null>(null)
const wafRef = ref<HTMLElement | null>(null)
const cacheRef = ref<HTMLElement | null>(null)
const advanceSettingRef = ref<HTMLElement | null>(null)
const domainRef = ref<HTMLElement | null>(null)

const tableData = ref(null)
const appProfileName = ref(route.query.appProfileName)

const overview = ref(activeSidebar.value.filter((e) => e.name == 'overview')[0].open)
const essentialDropdown = ref(
  activeSidebar.value.filter((e) => e.name == 'essential')[0].open
)
const originAddressDropdown = ref(
  activeSidebar.value.filter((e) => e.name == 'origin')[0].open
)
const sslDropdown = ref(activeSidebar.value.filter((e) => e.name == 'ssl')[0].open)
const firewallDropdown = ref(
  activeSidebar.value.filter((e) => e.name == 'firewall')[0].open
)
const cacheDropdown = ref(activeSidebar.value.filter((e) => e.name == 'cache')[0].open)
const advancedDropdown = ref(
  activeSidebar.value.filter((e) => e.name == 'advanced')[0].open
)
const domainsDropdown = ref(
  activeSidebar.value.filter((e) => e.name == 'domains')[0].open
)

const getTableData = async () => {
  let searchOptions = {
    isFuzzySearch: true,
    esIndex: 'rcm-app-profiles',
    from: 0,
    size: 10,
    sort: [{ modifiedDate: { order: 'desc' } }],
    filters: [
      { key: 'groupName', type: 'string', value: store.state.queryGroupName },
      {
        key: 'appProfileName',
        type: 'string',
        value: route.query.appProfileName,
      },
    ],
    searchView: 'AppProfile',
  }

  await getEsData(searchOptions)
    .then((res) => {
      tableData.value = res.data.mapData[0]

      // store.service.mutations.SET_SERVICE_DETAIL(
      //   store.state.service.service_detail,
      //   tableData.value
      // )
      serviceStore.mutations.SET_SERVICE_DETAIL(serviceStore.state, tableData.value)
      appProfileName.value = tableData.value.appProfileName

      // To Check if param appProfileName is correct
      if (route.query.appProfileName !== appProfileName.value) {
        router.push({ query: { appProfileName: appProfileName.value } })
      }
      console.log({ 'tableData.value': tableData.value })
    })
    .catch((err) => {
      console.log({ 'getEsData - error': err })
      notif.error('Invalid Service.')
      router.push({ name: 'lines' })
    })
}

const submitData = async (data) => {
  console.log({ 'submit everything - data': data })
  if (data) {
    try {
      await _updateData('rcm-app-profiles', data).then((res) => {
        if (res?.data?.taskNo) {
          tableData.value = data
          serviceStore.mutations.SET_SERVICE_DETAIL(serviceStore.state, data)
          notif.success('Update Successful')
        } else {
          notif.error('Failed to update.')
        }
        console.log({
          API_Update_Data: {
            result: res,
            taskNo: res.data.taskNo,
          },
        })
      })
    } catch (err) {
      console.log({ '_updateData - err': err })
    }
  }
}

const clickDropdown = (item: string) => {
  // console.log(item)
  switch (item) {
    case 'essential':
      // resetEssential()
      toggleSidebar('essential')
      essentialDropdown.value = activeSidebar.value.filter(
        (e) => e.name == 'essential'
      )[0].open
      return
    case 'origin':
      // resetOrigin()
      toggleSidebar('origin')
      originAddressDropdown.value = activeSidebar.value.filter(
        (e) => e.name == 'origin'
      )[0].open
      return
    case 'ssl':
      // resetSSL()
      toggleSidebar('ssl')
      sslDropdown.value = activeSidebar.value.filter((e) => e.name == 'ssl')[0].open
      return
    case 'firewall':
      toggleSidebar('firewall')
      firewallDropdown.value = activeSidebar.value.filter(
        (e) => e.name == 'firewall'
      )[0].open
      return
    case 'cache':
      toggleSidebar('cache')
      cacheDropdown.value = activeSidebar.value.filter((e) => e.name == 'cache')[0].open
      return
    case 'advanced':
      toggleSidebar('advanced')
      advancedDropdown.value = activeSidebar.value.filter(
        (e) => e.name == 'advanced'
      )[0].open
      return
    case 'domains':
      toggleSidebar('domains')
      domainsDropdown.value = activeSidebar.value.filter(
        (e) => e.name == 'domains'
      )[0].open
      return
  }
}

onMounted(async () => {
  await getTableData()
})

watch(activeSidebar.value, () => {
  const scrollIntoViewOptions = {
    behavior: 'smooth',
  }
  let previousOverview = overview.value
  let previousEssential = essentialDropdown.value
  let previousOrigin = originAddressDropdown.value
  let previousSSL = sslDropdown.value
  let previousWaf = firewallDropdown.value
  let previousCache = cacheDropdown.value
  let previousAdvance = advancedDropdown.value
  let previousDomain = domainsDropdown.value

  overview.value = activeSidebar.value.filter((e) => e.name == 'overview')[0].open
  essentialDropdown.value = activeSidebar.value.filter(
    (e) => e.name == 'essential'
  )[0].open
  originAddressDropdown.value = activeSidebar.value.filter(
    (e) => e.name == 'origin'
  )[0].open
  sslDropdown.value = activeSidebar.value.filter((e) => e.name == 'ssl')[0].open
  firewallDropdown.value = activeSidebar.value.filter((e) => e.name == 'firewall')[0].open
  cacheDropdown.value = activeSidebar.value.filter((e) => e.name == 'cache')[0].open
  advancedDropdown.value = activeSidebar.value.filter((e) => e.name == 'advanced')[0].open
  domainsDropdown.value = activeSidebar.value.filter((e) => e.name == 'domains')[0].open

  if (previousOverview != overview.value) {
    window.scrollTo({
      ...scrollIntoViewOptions,
      top: 0,
    })
  } else if (previousEssential != essentialDropdown.value) {
    essentialRef.value.scrollIntoView(scrollIntoViewOptions)
  } else if (previousOrigin != originAddressDropdown.value) {
    originRef.value.scrollIntoView(scrollIntoViewOptions)
  } else if (previousSSL != sslDropdown.value) {
    sslRef.value.scrollIntoView(scrollIntoViewOptions)
  } else if (previousWaf != firewallDropdown.value) {
    wafRef.value.scrollIntoView(scrollIntoViewOptions)
  } else if (previousCache != cacheDropdown.value) {
    cacheRef.value.scrollIntoView(scrollIntoViewOptions)
  } else if (previousAdvance != advancedDropdown.value) {
    advanceSettingRef.value.scrollIntoView(scrollIntoViewOptions)
  } else if (previousDomain != domainsDropdown.value) {
    domainRef.value.scrollIntoView(scrollIntoViewOptions)
  }
})

pageTitle.value = 'overview'
useHead({
  title: 'Overview | Solarspeed',
})
</script>

<template>
  <div>
    <div class="container tile-grid tile-grid-v2" @submit.prevent>
      <div class="columns is-multiline">
        <div class="column is-12">
          <div
            class="subtitle"
            style="font-weight: 500; font-size: 1.5rem; display: flex"
          >
            <span class="p-r-10">{{ appProfileName }}</span>
            <div v-if="tableData != null">
              <VTag
                v-if="tableData.status === '運行中'"
                label="Running"
                color="green"
                rounded
                elevated
              />
              <VTag v-else label="Pending" color="orange" rounded elevated />
            </div>
          </div>
        </div>
        <div class="column is-12">
          <div class="subtitle">
            {{ t('service.contentText') }}
          </div>
        </div>

        <div ref="essentialRef" class="column is-12">
          <EssentialCard
            :essential-dropdown="essentialDropdown"
            :overview-data="tableData"
            @submit-data="(e) => submitData(e)"
            @click-dropdown="() => clickDropdown('essential')"
          />
        </div>
        <div ref="originRef" class="column is-12">
          <OriginCard
            :origin-dropdown="originAddressDropdown"
            :overview-data="tableData"
            @submit-data="(e) => submitData(e)"
            @click-dropdown="() => clickDropdown('origin')"
          />
        </div>

        <div ref="sslRef" class="column is-12">
          <SslCard
            :ssl-dropdown="sslDropdown"
            :overview-data="tableData"
            @submit-data="(e) => submitData(e)"
            @click-dropdown="() => clickDropdown('ssl')"
          />
        </div>

        <div ref="wafRef" class="column is-12">
          <FirewallCard
            :firewall-dropdown="firewallDropdown"
            :overview-data="tableData"
            @submit-data="(e) => submitData(e)"
            @click-dropdown="() => clickDropdown('firewall')"
          />
        </div>

        <div ref="cacheRef" class="column is-12">
          <CacheCard
            :cache-dropdown="cacheDropdown"
            :overview-data="tableData"
            @submit-data="(e) => submitData(e)"
            @click-dropdown="() => clickDropdown('cache')"
          />
        </div>

        <div ref="advanceSettingRef" class="column is-12">
          <AdvancedSettingCard
            :advanced-dropdown="advancedDropdown"
            :overview-data="tableData"
            @submit-data="(e) => submitData(e)"
            @click-dropdown="() => clickDropdown('advanced')"
          />
        </div>

        <div ref="domainRef" class="column is-12">
          <DomainCard
            :domains-dropdown="domainsDropdown"
            :overview-data="tableData"
            @submit-data="(e) => submitData(e)"
            @click-dropdown="() => clickDropdown('domains')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
