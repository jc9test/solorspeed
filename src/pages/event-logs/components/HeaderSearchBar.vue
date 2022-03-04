<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const fuzzySearchCheckbox = ref(['true'])
const policyNameSearch = ref()
</script>

<template>
  <VControl icon="feather:search">
    <input
      v-model="policyNameSearch"
      class="input custom-text-filter"
      :placeholder="`${t('filter.searchText') + ' ' + t('eventLog.req_id')}`"
    />
  </VControl>

  <VControl>
    <VCheckbox
      v-model="fuzzySearchCheckbox"
      value="false"
      :label="t('filter.fuzzySearch')"
      color="primary"
    />
  </VControl>
</template>
