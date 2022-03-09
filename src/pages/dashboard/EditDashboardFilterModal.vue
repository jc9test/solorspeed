<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed, ref, watchEffect, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import store from '/@src/stores/index'
import useNotyf from '/@src/composable/useNotyf'
import { getChartFilterValueOptions } from '/@src/api/formOptions'
import { default as countryList } from '/@src/data/json/countryList.json'
import { tagLabels } from '/@src/components/dashboard/charts/filterOption'

const { dashboardQueryFilters, updateDashboardQueryFilters } = inject(
  'dashboardQueryFilters'
)

const props = defineProps({
  selected: {
    type: Object,
    default: () => {},
  },
  isEditFilterShow: {
    type: Boolean,
    default: false,
  },
})
const { t } = useI18n()
const notif = useNotyf()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(['close', 'edit'])
const isEditFilterShow = computed(() => {
  return props.isEditFilterShow
})

const filterKeyOptions = ref(store.state.dashboardFilterOptions.filterKeyOptions)
const filterOperatorOptions = ref(
  store.state.dashboardFilterOptions.filterOperatorOptions
)
const filterValueOptions = ref([])
const actionOptions = store.state.dashboardFilterOptions.actionOptions

const oriSelectedValue = ref()
const selectedValue = ref()

const getFilterValueSelectorOptions = async (key) => {
  let queryParams = {
    chartFilterKey: key,
    chartFilterValue: '***',
  }
  let queryString = new URLSearchParams(queryParams).toString()
  await getChartFilterValueOptions(`?${queryString}`).then((res) => {
    filterValueOptions.value = res.data.options.map((item) => {
      let itemName
      if (queryParams.chartFilterKey === 'tb_action.keyword') {
        itemName = actionOptions[item]
      } else if (queryParams.chartFilterKey === 'country.keyword') {
        itemName = countryList[item]
      } else {
        itemName = item
      }
      return {
        label: itemName,
        value: item,
      }
    })
  })
}
watchEffect(() => {
  if (isEditFilterShow.value == true) {
    oriSelectedValue.value = JSON.parse(JSON.stringify(props.selected))
    selectedValue.value = JSON.parse(JSON.stringify(props.selected))
    getFilterValueSelectorOptions(oriSelectedValue.value.chartFilterKey)
  }
})
const getValueOptions = () => {
  selectedValue.value.chartFilterValue = ''
  getFilterValueSelectorOptions(selectedValue.value.chartFilterKey)
}

const result = ref('')
function editFilter() {
  const { chartFilterKey, chartFilterValue, chartFilterOperator } = selectedValue.value

  updateDashboardQueryFilters('REMOVE_FILTER', { chartFilterKey, chartFilterValue })
  try {
    updateDashboardQueryFilters('ADD_FILTER', {
      chartFilterKey,
      chartFilterValue,
      chartFilterOperator,
    })
    emit('edit', { chartFilterKey, chartFilterValue, chartFilterOperator })
  } catch (error) {
    notif.error(error.message)
  }
}
</script>

<template>
  <V-Modal
    :open="isEditFilterShow"
    :title="`${t('dashboard.editFilter')}`"
    size="big"
    actions="right"
    @close="$emit('close')"
  >
    <template #content>
      <div v-if="selectedValue" class="edit-filter-container">
        <Multiselect
          v-model="selectedValue.chartFilterKey"
          placeholder="Action"
          mode="single"
          :searchable="true"
          :can-deselect="false"
          :can-clear="false"
          :options="filterKeyOptions"
          @select="getValueOptions"
        />
        <Multiselect
          v-model="selectedValue.chartFilterOperator"
          placeholder="Equals"
          mode="single"
          :searchable="true"
          :can-deselect="false"
          :can-clear="false"
          :options="filterOperatorOptions"
        />
        <Multiselect
          v-model="selectedValue.chartFilterValue"
          placeholder="Allow"
          mode="single"
          :searchable="true"
          :can-deselect="false"
          :can-clear="false"
          :options="filterValueOptions"
        />
      </div>
    </template>
    <template #action>
      <V-Button color="primary" raised @click="editFilter">{{
        t('service.confirmText')
      }}</V-Button>
    </template>
  </V-Modal>
</template>

<style lang="scss" scoped>
.edit-filter-container {
  display: flex;
  margin-bottom: 130px;
  margin-right: -10px;

  & > div {
    margin-right: 10px;
  }
}
</style>
