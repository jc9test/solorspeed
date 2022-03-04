<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import store from '/@src/stores/index'

const { t } = useI18n()

const props = defineProps({
  searchFilters: {
    type: Array,
    default: () => [],
  },
  filteredDataTotal: {
    type: String,
    default: () => '',
  },
})
const emit = defineEmits(['getData'])

const serviceLineSearch = ref()
const domainName = ref()
const searchOptions = ref({})
const filteredDataTotal = computed(() => {
  return props.filteredDataTotal
})

const searchServiceLine = () => {
  if (serviceLineSearch.value || domainName.value) {
    let dataFilter = [
      { key: 'groupName', type: 'string', value: store.state.queryGroupName },
    ]
    if (serviceLineSearch.value) {
      searchOptions.value.esIndex = 'rcm-app-profiles'
      searchOptions.value.isFuzzySearch = true
      dataFilter.push({
        key: 'appProfileName',
        type: 'string',
        value: serviceLineSearch.value,
      })
    }
    if (domainName.value) {
      searchOptions.value.esIndex = 'rcm-nginxconfigs'
      searchOptions.value.isFuzzySearch = false
      dataFilter.push({
        key: 'servername',
        type: 'string',
        value: domainName.value,
      })
    }
    searchOptions.value.filters = dataFilter
  } else {
    searchOptions.value.esIndex = 'rcm-app-profiles'
    searchOptions.value.filters = [
      { key: 'groupName', type: 'string', value: store.state.queryGroupName },
    ]
  }

  // getTableData()
  emit('getData', searchOptions)
}
</script>

<template>
  <div class="list-view-toolbar">
    <VField>
      <VControl icon="feather:search">
        <input
          v-model="serviceLineSearch"
          class="input custom-text-filter"
          :placeholder="
            `${t('filter.searchText')}` + ' ' + `${t('service.service_line')}`
          "
          @keyup.enter="searchServiceLine"
          @blur="searchServiceLine"
        />
      </VControl>
    </VField>
    <VField>
      <VControl icon="feather:search">
        <input
          v-model="domainName"
          class="input custom-text-filter"
          :placeholder="`${t('filter.searchText')}` + ' ' + `${t('service.domain_name')}`"
          @keyup.enter="searchServiceLine"
          @blur="searchServiceLine"
        />
      </VControl>
    </VField>

    <div class="list-info">
      <span>{{ filteredDataTotal }} {{ t('service.records_found') }}</span>
    </div>

    <div class="buttons">
      <RouterLink :to="{ name: 'add' }">
        <VButton color="primary" bold raised>
          {{ t('service.createText') }}
        </VButton>
      </RouterLink>
    </div>
  </div>
</template>
