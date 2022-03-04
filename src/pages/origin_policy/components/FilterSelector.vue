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
  formReferences.groupName.value = ref(604)
  formReferences.originPolicyName.value = ''
  formReferences.originPolicyAction.value = ''
  formReferences.origins.value = ''
  formReferences.originscheme.value = ''
  formReferences.portMappingType.value = ''
  formReferences.loadbalancerMethod.value = ''
  formReferences.loadbalancerSticky.value = ''
  formReferences.healthCheckMode.value = ''
  formReferences.healthCheckUri.value = ''
  formReferences.healthCheckHttpCode.value = ''
  formReferences.healthCheckInterval.value = ''
  formReferences.healthCheckTimeout.value = ''
  formReferences.healthCheckSuccess.value = ''
  formReferences.healthCheckFail.value = ''
  formReferences.createdDate.value = ''
  formReferences.modifiedDate.value = ''
  formReferences.status.value = ''
}

const searchFilterOptions = ref(props.filters)
const emit = defineEmits(['search-filter-called'])
const handleSearch = () => {
  // searchFilterOptions.value.filters = []
  // for (let i in formInputs.value) {
  //   if (formInputs.value[i].ref) {
  //     let labelValue

  //     if (formInputs.value[i].key === 'loadbalancerSticky') {
  //       labelValue = actionOptions[formInputs.value[i].value]
  //     } else {
  //       labelValue = formInputs.value[i].value
  //     }
  //     // searchFilterOptions.value.filters = []
  //     searchFilterOptions.value.filters.unshift({
  //       key: formInputs.value[i].key,
  //       type: formInputs.value[i].type,
  //       value: formInputs.value[i].ref,
  //       tag: `${formInputs.value[i].title}: ${labelValue}`,
  //     })
  //   }
  // }
  searchFilterOptions.value = generateSearchFilter(searchFilterOptions.value, formInputs)
  emit('search-filter-called', searchFilterOptions)
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
      :title="`Origin Policy ${t('filter.filter')}`"
      size="big"
      actions="right"
      @close="isFilterOpen = false"
    >
      <template #content>
        <form class="modal-form">
          <FormBuilder :form-inputs="formInputs" />
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
