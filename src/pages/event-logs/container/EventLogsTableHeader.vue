<script setup lang="ts">
import { computed } from 'vue'

import FilterSelector from '../components/FilterSelector.vue'
import ColumnSelector from '../components/ColumnSelector.vue'
import HeaderSearchBar from '../components/HeaderSearchBar.vue'
import EventLogsFilterGroup from './EventLogsFilterGroup.vue'
import ExportData from '../components/ExportData.vue'

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
const emit = defineEmits(['update:filters', 'update:isFuzzySearch', 'getData'])

const isFuzzySearch = computed({
  get: () => {
    return props.isFuzzySearch
  },
  set: (x) => emit('update:isFuzzySearch', x),
})

const filters = computed({
  get: () => {
    return props.filters
  },
  set: (x) => emit('update:filters', x),
})
</script>

<template>
  <div class="header-container">
    <div class="header-options-container">
      <div class="filter-column-container">
        <FilterSelector v-model:filters="filters" />
        <ColumnSelector />
        <ExportData />
      </div>
      <div class="header-searchbar-container">
        <HeaderSearchBar
          v-model:isFuzzySearch="isFuzzySearch"
          v-model:filters="filters"
        />
      </div>
    </div>
  </div>
  <EventLogsFilterGroup v-model:filters="filters" />
</template>

<style lang="scss">
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  .control {
    font-size: 0.8em;
  }

  .header-icons {
    cursor: pointer;
  }

  .button.v-button {
    height: 37px;
  }
}

.header-options-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .checkbox,
  label {
    margin-left: 10px;
  }

  .filter-column-container {
    display: flex;
  }

  .header-searchbar-container {
    display: flex;
  }
}

@media only screen and (max-width: 767px) {
  .header-container {
    margin-bottom: 15px;
    align-items: flex-start;

    .checkbox {
      padding: 1em 0;
    }
  }

  .header-options-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;

    .filter-column-container {
      display: flex;
    }

    .header-searchbar-container {
      display: flex;
      label {
        white-space: nowrap;
        position: absolute;
        margin-left: 5px;
      }
    }
  }
}
@media only screen and (max-width: 576px) {
  .header-container {
    margin-bottom: 15px;
  }
}
</style>
