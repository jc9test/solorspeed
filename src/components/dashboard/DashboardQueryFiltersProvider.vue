<script setup lang="ts">
import { ref, provide, watch } from 'vue'

import store from '/@src/stores/index'
import { tagLabels } from './charts/filterOption'
import { default as countryList } from '/@src/data/json/countryList.json'
import {
  DashboardQueryFilter,
  UpdateDashboardQueryFilterAction,
  ItemData,
} from '/@types/dashboard'

const dashboardQueryFilters = ref<DashboardQueryFilter[]>(
  store.state.dashboard.dashboardChartOptions.dashboardQueryFilters
)
const CHARSET = [
  '!',
  ' ',
  '+',
  '-',
  '=',
  '<',
  '>',
  '&',
  '*',
  '|',
  '(',
  ')',
  '[',
  ']',
  '{',
  '}',
  '^',
  '~',
  '?',
  ':',
]

const actionOptions = {
  '00': 'Allow',
  '01': 'Deny',
  '03': 'Gesture',
  '04': 'Log',
  '05': 'Speed',
  '06': 'Redirect',
  '07': 'Cookie',
  '08': 'Period',
  '09': 'Request Headers',
  '10': 'Response Headers',
  '11': 'Log Only',
  '12': 'Custom Page',
  '13': 'Origin Policy',
  '14': 'Smart Captcha',
}

function createFilterFromItem(item: ItemData) {
  let labelTitle = tagLabels.find((tag) => tag.title === item.chartFilterKey)?.label

  let value
  switch (item.chartFilterKey) {
    case 'req_headers.accept.keyword':
      if (item.chartFilterValue === '*/*') {
        value = item.chartFilterValue
          .split('')
          .map((char) => (CHARSET.includes(char) ? '\\' + char : char))
          .join('')
      } else {
        value = item.chartFilterValue || '""'
      }
      break
    default:
      value = item.chartFilterValue
      break
  }
  let labelValue
  switch (item.chartFilterKey) {
    case 'tb_action.keyword':
      labelValue = actionOptions[item.chartFilterValue] || '*'
      break
    case 'country.keyword':
      labelValue = countryList[item.chartFilterValue] || '*'
      break
    default:
      labelValue = item.chartFilterValue
      break
  }

  let label
  switch (item.chartFilterOperator) {
    default: // handle for in-chart filter tag removal
    case 'is':
      label = `${labelTitle}: ${labelValue}`
      break
    case 'not':
      label = `NOT ${labelTitle}: ${labelValue}`
      break
    case 'contains':
      label = `EXIST ${labelTitle}: ${labelValue}`
      break
    case 'not contains':
      label = `NOT EXIST ${labelTitle}: ${labelValue}`
      break
  }

  return {
    chartFilterKey: item.chartFilterKey,
    chartFilterOperator: item.chartFilterOperator,
    chartFilterValue: value,
    chartFilterEnabled: true,
    chartFilterLabel: label,
  } as DashboardQueryFilter
}

const updateDashboardQueryFilters = (
  action: UpdateDashboardQueryFilterAction,
  item: ItemData
) => {
  const filter = createFilterFromItem(item)

  switch (action) {
    case 'ADD_FILTER':
      if (
        dashboardQueryFilters.value.some(
          (x) =>
            x.chartFilterKey === filter.chartFilterKey &&
            x.chartFilterValue === filter.chartFilterValue
        )
      ) {
        throw new Error('Duplicate Filter!')
      } else {
        dashboardQueryFilters.value.push(filter)
      }
      break
    case 'REMOVE_FILTER':
      dashboardQueryFilters.value = dashboardQueryFilters.value.filter(
        (x) =>
          x.chartFilterKey !== filter.chartFilterKey &&
          x.chartFilterValue !== filter.chartFilterValue
      )
      break
  }
}
provide('dashboardQueryFilters', { dashboardQueryFilters, updateDashboardQueryFilters })

watch(
  dashboardQueryFilters,
  () => {
    store.commit('SET_DASHBOARD_QUERY_FILTER', dashboardQueryFilters)
  },
  { deep: true }
)
</script>

<template>
  <slot></slot>
</template>
