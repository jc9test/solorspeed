<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import FilterSelector from '../components/FilterSelector.vue'
import ColumnSelector from '../components/ColumnSelector.vue'
import HeaderSearchBar from '../components/HeaderSearchBar.vue'
import {
  formInputs,
  refUpdater,
  renderValues,
  renderSubmitValues,
} from '../data/create_html_pages_data'
import HTMLPagesForm from './HTMLPagesForm.vue'

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

const showFormHtmlModal = ref(false)
const { t } = useI18n()

//pagination
const htmlPagesData = ref()
const emit = defineEmits(['search-filter-called', 'getData'])
const searchFilter = (searchFilterOptions) => {
  emit('search-filter-called', searchFilterOptions)
}
const showFormHtml = (value: boolean) => {
  showFormHtmlModal.value = value
  if (value) {
    htmlPagesData.value = renderValues()
  }
}

const getData = () => {
  emit('getData')
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
        <ColumnSelector />
      </div>
      <div class="header-searchbar-container">
        <HeaderSearchBar />
      </div>
    </div>

    <div class="header-action-container">
      <VButton color="primary" class="cache-button" bold @click="showFormHtml"
        >{{ t('main.createText') }}
      </VButton>
    </div>
    <HTMLPagesForm
      :show-form-html-modal="showFormHtmlModal"
      :form-inputs="formInputs"
      :html-pages-data="htmlPagesData"
      :render-values="renderValues"
      :render-submit-values="renderSubmitValues"
      :ref-updater="refUpdater"
      action="create"
      @show-form-html="showFormHtml"
      @get-data="getData"
    />
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
