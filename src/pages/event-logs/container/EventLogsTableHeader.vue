<script setup lang="ts">
import { ref } from 'vue'

import FilterSelector from '../components/FilterSelector.vue'
import ColumnSelector from '../components/ColumnSelector.vue'
import HeaderSearchBar from '../components/HeaderSearchBar.vue'
import ExportData from '../components/ExportData.vue'

//search

const policyNameSearch = ref()
const isPolicyNameSearch = ref(false)

//pagination
const hasFilter = ref(false)

const props = defineProps({
  filters: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['search-filter-called'])
const searchFilter = (formReferences) => {
  console.log(formReferences)
  emit('search-filter-called', formReferences)
}
</script>

<template>
  <div class="header-container">
    <div class="header-options-container">
      <div class="filter-column-container">
        <FilterSelector
          v-model:hasFilter="hasFilter"
          v-model:is-policy-name-search="isPolicyNameSearch"
          :filters="props.filters"
          :policy-name-search="policyNameSearch"
          @search-filter-called="searchFilter"
        />
        <ExportData />
        <ColumnSelector />
      </div>
      <div class="header-searchbar-container">
        <HeaderSearchBar />
      </div>
    </div>
  </div>
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
