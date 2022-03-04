<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import OriginPolicyTableHeader from './OriginPolicyTableHeader.vue'
import TitleDesc from '../../../components/general/TitleDesc.vue'
import OriginPolicyTable from './OriginPolicyTable.vue'
import { columnDefaults } from '../data/column_selector_data'
import { getEsData } from '/@src/api/esdata'
import { getGroupAsset } from '/@src/api/groupasset'
import store from '/@src/stores/index'

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

const pageSize = ref(10)
const pageCurrent = ref(1)
const searchFilters = ref([
  { key: 'groupName', type: 'string', value: store.state.queryGroupName },
])

const filters = computed(() => {
  var options = {
    isFuzzySearch: true,
    esIndex: 'rcm-originpolicies',
    from: pageCurrent.value > 1 ? pageSize.value * (pageCurrent.value - 1) : 0,
    size: pageSize.value,
    sort: [{ modifiedDate: { order: 'desc' } }],
    filters: searchFilters.value,
    searchView: 'OriginPolicy',
  }
  return options
})

const columnBuilder = () => {
  let columns = {}
  for (let index = 0; index < columnDefaults.length; index++) {
    if (props.appliedSelectedColumn.includes(columnDefaults[index].name)) {
      if (typeof columnDefaults[index].value === 'string') {
        ;(columns as any)[columnDefaults[index].name] = columnDefaults[index].value
      } else if (typeof columnDefaults[index].value === 'object') {
        ;(columns as any)[columnDefaults[index].name] = {
          ...(columnDefaults[index].value as any),
        }
      }
    }
  }
  return columns
}

const columns = ref(columnBuilder())
const filteredData = ref([])
const filteredDataTotal = ref(0)
const usage = ref({})

const getData = (filtered = null, value = null) => {
  if (filtered && !value) {
    filters.value.from =
      filtered.value.pageCurrent > 1
        ? filtered.value.pageSize * (filtered.value.pageCurrent - 1)
        : 0
    filters.value.size = filtered.value.pageSize
  }
  getEsData(filters.value)
    .then((res) => {
      filteredData.value = res.data.mapData
      filteredDataTotal.value = res.data.total
    })
    .catch(() => {
      filteredData.value = []
      filteredDataTotal.value = 0
    })
}
const getAssetData = () => {
  getGroupAsset({
    category: 'originPolicies',
    groupNames: store.state.queryGroupName,
  }).then((res) => {
    let { used, max } = res.data
    let available = max - used
    usage.value = { used, max, available }
  })
}

watch(
  () => [props.appliedSelectedColumn],
  () => {
    columns.value = columnBuilder()
  }
)

const handleSearch = (formReferences) => {
  const filters = ref(formReferences)
  filters.value.from = 0
  pageCurrent.value = 1
  getData(filters, 2)
}

onMounted(() => {
  getData()
  getAssetData()
})
</script>

<template>
  <div>
    <TitleDesc
      :title="`${t('originPolicy.titleContent')}`"
      :desc="`${t('originPolicy.subtitleContent.first')} ${usage.used} ${t(
        'originPolicy.subtitleContent.of'
      )} ${usage.max} ${t('originPolicy.subtitleContent.originPolicy')}`"
    />
    <OriginPolicyTableHeader
      :filters="filters"
      @get-data="getData"
      @search-filter-called="handleSearch"
    />
    <OriginPolicyTable
      :page-size="pageSize"
      :page-current="pageCurrent"
      :filters="filters"
      :active-tab="activeTab"
      :filtered-data="filteredData"
      :filtered-data-total="filteredDataTotal"
      :applied-selected-column="appliedSelectedColumn"
      @get-data="getData"
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
