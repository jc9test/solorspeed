<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { getEsData } from '/@src/api/esdata'
import XLSX from 'xlsx'
import store from '/@src/stores/index'

const tableData = ref([])
const searchFilters = ref([
  { key: 'group', type: 'string', value: store.state.queryGroupName },
])

const searchOptions = computed(() => {
  var options = {
    isFuzzySearch: false,
    esIndex: 'rcm-monitor-edge-accesslog-*',
    from: 0,
    size: 10000,
    sort: [{ modifiedDate: { order: 'desc' } }],
    filters: searchFilters.value,
    searchView: 'WafEvent',
  }
  return options
})

const getTableData = () => {
  getEsData(searchOptions.value)
    .then((res) => {
      tableData.value = res.data.mapData
    })
    .catch(() => {
      tableData.value = []
    })
}

function exportTable(filename) {
  const data = XLSX.utils.json_to_sheet(tableData.value)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, data, 'data')
  XLSX.writeFile(wb, filename)
}

onMounted(() => {
  getTableData()
})
</script>

<template>
  <div class="filter-btn">
    <V-IconButton
      color="primary"
      style="color: #fff"
      class="filter-icon"
      icon="feather:download"
      @click="exportTable('event_log.csv')"
    />
  </div>
</template>

<style lang="scss" scoped>
.filter-btn {
  position: relative;
}
</style>
