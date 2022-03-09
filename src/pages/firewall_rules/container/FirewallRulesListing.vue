<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { getEsData } from '/@src/api/esdata'
import { getGroupAsset } from '/@src/api/groupasset'
import store from '/@src/stores'
import { useI18n } from 'vue-i18n'

import FirewallRulesTable from './FirewallRulesTable.vue'
import FirewallRulesTableHeader from './FirewallRulesTableHeader.vue'

const { t } = useI18n()

const props = defineProps({
  activeTab: {
    type: String,
    default: () => '',
  },
  appliedSelectedColumn: {
    type: Object,
    default: () => {},
  },
})

const groupName = computed(() => store.state.queryGroupName)
const isFuzzySearch = ref(false)

const pageCurrent = ref(1)
const pageSize = ref(10)
const pageFrom = computed(() => pageSize.value * (pageCurrent.value - 1))

const _filters = ref([])
const filters = computed(() => [
  {
    key: 'groupName',
    type: 'string',
    value: groupName.value,
  },
  ..._filters.value,
])

const sort = computed(() => [{ modifiedDate: { order: 'desc' } }])

const esOptions = computed(() => {
  return {
    isFuzzySearch: isFuzzySearch.value,
    esIndex: 'rcm-wafrules',
    from: pageFrom.value,
    size: pageSize.value,
    sort: sort.value,
    filters: filters.value,
    searchView: 'WafRules',
  }
})

const filtered = ref({ data: [], total: 0 })
const usage = ref({ used: 0, max: 0, available: 0 })

const getData = () => {
  getEsData(esOptions.value).then((res) => {
    const { mapData, total } = res.data
    filtered.value = { data: mapData, total }
  })
}

const getAssetData = () => {
  getGroupAsset({
    category: 'wafRules',
    groupNames: groupName.value,
  }).then((res) => {
    const { used, max } = res.data
    const available = max - used
    usage.value = { used, max, available }
  })
}

const getAllData = () => {
  getData()
  getAssetData()
}

watch(
  () => [esOptions.value, pageCurrent.value, pageSize.value],
  () => getData(),
  { deep: true }
)

onMounted(() => {
  getAllData()
})
</script>

<template>
  <div>
    <TitleDesc
      :title="`${t('waf.titleContent')}`"
      :desc="`${t('waf.subtitleContent.first')} ${usage.used} ${t(
        'waf.subtitleContent.of'
      )} ${usage.max} ${t('waf.subtitleContent.wafrules')}`"
    />
    <FirewallRulesTableHeader
      v-model:filters="_filters"
      v-model:isFuzzySearch="isFuzzySearch"
      @get-data="getAllData"
    />
    <FirewallRulesTable
      v-model:pageSize="pageSize"
      v-model:pageCurrent="pageCurrent"
      :active-tab="props.activeTab"
      :filtered-data="filtered.data"
      :filtered-data-total="filtered.total"
      :applied-selected-column="props.appliedSelectedColumn"
      @get-data="getAllData"
    />
  </div>
</template>

<style lang="scss">
.table-button {
  transition: all 0.4s;
  cursor: pointer;
  &:hover {
    color: #06d6a0;
  }
}
.origin-policy-table {
  .flex-table-cell {
    word-break: break-all;
    white-space: unset;
  }
}
</style>
