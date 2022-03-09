<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formReferences } from '../data/filter_selector_data'
const { t } = useI18n()

const props = defineProps({
  filters: {
    type: Array,
    default: () => [],
  },
  isFuzzySearch: {
    type: Boolean,
    default: () => false,
  },
})
const emit = defineEmits(['update:isFuzzySearch', 'update:filters'])
const searchText = ref('')
const isFuzzySearchCheckbox = ref([])

watch(
  () => isFuzzySearchCheckbox.value,
  () => {
    const bool = isFuzzySearchCheckbox.value.includes('isFuzzy')
    emit('update:isFuzzySearch', bool)
  },
  { deep: true }
)

const updateFilters = () => {
  if (searchText.value.length > 0) {
    const filter = {
      key: 'req_id',
      type: 'string',
      value: searchText.value,
    }
    formReferences.reqID.value = searchText.value
    if (!props.filters.some((x) => x.key === 'req_id')) {
      emit('update:filters', [...props.filters, filter])
    } else {
      emit(
        'update:filters',
        props.filters.map((x) => (x.key === 'req_id' ? filter : x))
      )
    }
  } else {
    emit(
      'update:filters',
      props.filters.filter((x) => x.key !== 'req_id')
    )
  }
}
</script>

<template>
  <VControl icon="feather:search">
    <input
      v-model="searchText"
      class="input custom-text-filter"
      :placeholder="`${t('filter.searchText')} ${t('eventLog.req_id')}`"
      @keyup.enter="updateFilters"
    />
  </VControl>

  <VControl>
    <VCheckbox
      v-model="isFuzzySearchCheckbox"
      value="isFuzzy"
      :label="t('filter.deepSearch')"
      color="primary"
    />
  </VControl>
</template>
