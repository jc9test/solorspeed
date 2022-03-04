<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

import { getEsData } from '/@src/api/esdata'
import { getGroupAsset } from '/@src/api/groupasset'
import store from '/@src/stores/index'
import { useHead } from '@vueuse/head'

import { pageTitle } from '/@src/state/sidebarLayoutState'
import ServiceListingHeader from '/@src/pages/services/container/ServiceListingHeader.vue'
import ServiceListing from '/@src/pages/services/container/ServiceListing.vue'

type TabId = 'active' | 'closed'
var activeTab = ref<TabId>('active')

const usage = ref({})
const pageSize = ref(10)
const pageCurrent = ref(1)
const filteredData = ref([])
const filteredDataTotal = ref(0)

const searchFilters = ref([
  { key: 'groupName', type: 'string', value: store.state.queryGroupName },
])
const searchOptions = computed(() => {
  var options = {
    isFuzzySearch: true,
    esIndex: 'rcm-app-profiles',
    from: pageSize.value * (pageCurrent.value - 1),
    size: pageSize.value,
    sort: [{ modifiedDate: { order: 'desc' } }],
    filters: searchFilters.value,
    searchView: 'AppProfile',
  }
  return options
})

const getAssetData = () => {
  getGroupAsset({
    category: 'FQDNConfigs',
    groupNames: [store.state.queryGroupName],
  }).then((res) => {
    let { used, max } = res.data
    let available = max - used
    usage.value.FQDNConfig = { used, max, available }
  })
  getGroupAsset({
    category: 'fqdns',
    groupNames: [store.state.queryGroupName],
  }).then((res) => {
    let { used, max } = res.data
    let available = max - used
    usage.value.fqdns = { used, max, available }
  })
}

const getData = (filtered = null, value = null) => {
  if (filtered && !value) {
    searchOptions.value.esIndex = filtered.value.esIndex ?? searchOptions.value.esIndex
    searchOptions.value.isFuzzySearch =
      filtered.value.isFuzzySearch ?? searchOptions.value.isFuzzySearch
    searchOptions.value.filters = filtered.value.filters ?? searchOptions.value.filters
    searchOptions.value.from =
      filtered.value.pageCurrent > 1
        ? filtered.value.pageSize * (filtered.value.pageCurrent - 1)
        : 0
    searchOptions.value.size = filtered.value.pageSize ?? searchOptions.value.size
  }
  getEsData(searchOptions.value)
    .then((res) => {
      console.log({ filteredData: filteredData.value })
      filteredData.value = res.data.mapData
      filteredDataTotal.value = res.data.total
      // if (res.data.mapData[0].status !== '運行中') {
      //   const myInterval = setInterval(() => {
      //     getEsData(searchOptions.value).then((res) => {
      //       if (res.data.mapData[0].status === '運行中') {
      //         clearInterval(myInterval)
      //         getData()
      //         notif.success(t('service.notif.deploy_success'))
      //       }
      //     })
      //   }, 5000)
      // }
    })
    .catch((err) => {
      activeTab = 'closed'
      filteredData.value = []
      console.log({ 'getEsData - error': err })
    })
}

onMounted(() => {
  getAssetData()
  getData()
})

pageTitle.value = 'serviceLines'
useHead({
  title: 'Service Lines | Solarspeed',
})
</script>

<template>
  <div class="service-line">
    <ServiceListingHeader
      :search-filters="searchFilters"
      :filtered-data-total="filteredDataTotal"
      :page-size="pageSize"
      :page-current="pageCurrent"
      @get-data="getData"
    />
    <ServiceListing
      :active-tab="activeTab"
      :filtered-data="filteredData"
      :filtered-data-total="filteredDataTotal"
      :page-size="pageSize"
      :page-current="pageCurrent"
      @get-data="getData"
    />
  </div>
</template>
