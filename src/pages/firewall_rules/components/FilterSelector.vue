<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { formReferences, formInputs } from '../data/filter_selector_data'
import FormBuilder from '/@src/components/general/FormBuilder.vue'
import { generateSearchFilter } from '/@src/utils/search-filter'

const { t } = useI18n()
//form v-model

const props = defineProps({
  filters: {
    type: Array,
    default: () => [],
  },
})

const isFilterOpen = ref(false)

function initFormItem() {
  formReferences.createBy.value = ''
  formReferences.groupName.value = '604'
  formReferences.ruleName.value = ''
  formReferences.wafAction.value = ''
  formReferences.wafRedirectHttpCode.value = ''
  formReferences.wafSetReqHeaders.value = ''
  formReferences.wafSetResHeaders.value = ''
  formReferences.wafIp.value = ''
  formReferences.wafUri.value = ''
  formReferences.wafHeaders.value = ''
  formReferences.wafHeadersNotExist.value = ''
  formReferences.wafCountry.value = ''
  formReferences.wafIsp.value = ''
  formReferences.wafHttpMethod.value = ''
  formReferences.wafRate.value = ''
  formReferences.wafOwasp.value = ''
  formReferences.wafIpExclude.value = ''
  formReferences.wafUriExclude.value = ''
  formReferences.wafHeadersExclude.value = ''
  formReferences.wafProxyType.value = ''
  formReferences.createdDate.value = ''
  formReferences.modifiedDate.value = ''
  formReferences.description.value = ''
  formReferences.status.value = ''
}

const searchFilterOptions = ref(props.filters)
const emit = defineEmits(['search-filter-called'])
const handleSearch = () => {
  searchFilterOptions.value = generateSearchFilter(searchFilterOptions.value, formInputs)
  emit('search-filter-called', searchFilterOptions.value)
}

onMounted(() => {})
</script>

<template>
  <div class="filter-form-originPolicy">
    <div class="filter-btn">
      <V-IconButton
        color="primary"
        style="color: #fff"
        class="filter-icon"
        icon="feather:sliders"
        @click="isFilterOpen = !isFilterOpen"
      />

      <!-- <div :class="props.hasFilter ? 'filter-dot' : 'dot'"></div> -->
    </div>

    <VModal
      :open="isFilterOpen"
      :title="`WAF ${t('filter.filter')}`"
      size="big"
      actions="right"
      @close="isFilterOpen = false"
    >
      <template #content>
        <form class="modal-form">
          <FormBuilder :form-inputs="formInputs"> </FormBuilder>
        </form>
      </template>

      <template #action>
        <VButton @click="initFormItem"> {{ t('main.clearText') }} </VButton>

        <VButton color="primary" raised @click="handleSearch">
          {{ t('filter.searchText') }}
        </VButton>
      </template>
    </VModal>
  </div>
</template>

<style lang="scss">
.filter-btn {
  position: relative;
  margin-right: 10px;
}

.filter-dot {
  width: 8px;
  height: 8px;
  background-color: $danger;
  border-radius: 20px;
  position: absolute;
  right: 31%;
  top: -8%;
}

.radio-button-container {
  display: flex;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.radio {
  padding-left: 0px;
}
</style>
