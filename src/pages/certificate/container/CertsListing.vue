<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import CertsTableHeader from './CertsTableHeader.vue'
import CertsTable from './CertsTable.vue'
import { getEsData } from '/@src/api/esdata'
import store from '/@src/stores/index'

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
    esIndex: 'rcm-certpems',
    from: pageCurrent.value > 1 ? pageSize.value * (pageCurrent.value - 1) : 0,
    size: pageSize.value,
    sort: [{ modifiedDate: { order: 'desc' } }],
    filters: searchFilters.value,
    searchView: 'CertsManage',
  }
  return options
})

const filteredData = ref([])
const filteredDataTotal = ref(0)

const getData = (filtered = null, value = null) => {
  if (filtered && !value) {
    filters.value.from =
      filtered.value.pageCurrent > 1
        ? filtered.value.pageSize * (filtered.value.pageCurrent - 1)
        : 0
    filters.value.size = filtered.value.size || filtered.value.pageSize
  }
  getEsData(filters.value)
    .then(async (res) => {
      filteredData.value = res.data.mapData
      filteredDataTotal.value = res.data.total
      //   isDataExist.value = filteredDataTotal.value > 0 ? true : false

      //   for (let i = 0; i < filteredData.value.length; i++) {
      //     if (filteredData.value[i].wafIp.length > 0) {
      //       filteredData.value[i].newWafList = filteredData.value[i].wafIp.split('\n')
      //     }
      //   }
      //   finalData.value = filteredData.value
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleSearch = (searchFilterOptions) => {
  const filters = ref(searchFilterOptions)
  filters.value.from = 0
  pageCurrent.value = 1
  getData(filters, 2)
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div>
    <CertsTableHeader
      :filters="filters"
      @get-data="getData"
      @search-filter-called="handleSearch"
    />
    <CertsTable
      :page-size="pageSize"
      :page-current="pageCurrent"
      :filters="filters"
      :active-tab="props.activeTab"
      :filtered-data="filteredData"
      :filtered-data-total="filteredDataTotal"
      :applied-selected-column="props.appliedSelectedColumn"
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
