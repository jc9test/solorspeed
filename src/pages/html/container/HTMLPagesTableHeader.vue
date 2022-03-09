<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import FilterSelector from '../components/FilterSelector.vue'
import ColumnSelector from '../components/ColumnSelector.vue'
import HeaderSearchBar from '../components/HeaderSearchBar.vue'
import HTMLPagesForm from './HTMLPagesForm.vue'
import HTMLPagesFilterGroup from './HTMLPagesFilterGroup.vue'
import {
  formReferences,
  formInputs,
  refUpdater,
  renderValues,
  renderSubmitValues,
  inputAttributeUpdater,
} from '../data/create_html_pages_data'

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

const getData = () => emit('getData')

const showFormHTML = ref(false)
const htmlPagesData = renderValues()
</script>

<template>
  <div class="header-container">
    <div class="header-options-container">
      <div class="filter-column-container">
        <FilterSelector v-model:filters="filters" />
        <ColumnSelector />
      </div>
      <div class="header-searchbar-container">
        <HeaderSearchBar
          v-model:isFuzzySearch="isFuzzySearch"
          v-model:filters="filters"
        />
      </div>
    </div>
    <div />
    <div class="header-action-container">
      <VButton color="primary" class="cache-button" bold @click="showFormHTML = true">
        {{ t('main.createText') }}
      </VButton>
    </div>
    <HTMLPagesForm
      :show-form-html-modal="showFormHTML"
      :form-inputs="formInputs"
      :form-references="formReferences"
      :html-pages-data="htmlPagesData"
      :ref-updater="refUpdater"
      :attribute-updater="inputAttributeUpdater"
      :render-values="renderValues"
      :render-submit-values="renderSubmitValues"
      action="create"
      @show-form-html="
        (e) => {
          showFormHTML = e
        }
      "
      @get-data="getData"
    />
  </div>
  <HTMLPagesFilterGroup v-model:filters="filters" />
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
