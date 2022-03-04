<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, onMounted, computed, watch } from 'vue'
import { getEdgeChartData } from '/@src/api/monitor'
import { themeColors } from '/@src/utils/themeColors'
import store from '/@src/stores/index'
import numeral from 'numeral'

const props = defineProps({
  kind: { type: String, default: '' },
  numeralFormat: { type: String, default: '0.00a' },
  decimalPlaces: { type: Number, default: 2 },
  numStringPrefix: { type: String, default: '' },
  numStringSuffix: { type: String, default: '' },

  groupNames: { type: Array, default: () => [] },
  tags: { type: Array, default: () => [] },
  serviceGroupNames: { type: Array, default: () => [] },
  domains: { type: Array, default: () => [] },
  appProfileNames: { type: Array, default: () => [] },
  origins: { type: Array, default: () => [] },
  originHosts: { type: Array, default: () => [] },
  originPorts: { type: Array, default: () => [] },
  latencyStatusNames: { type: Array, default: () => [] },
  edgeNames: { type: Array, default: () => [] },
  slbNames: { type: Array, default: () => [] },
  dateRange: { type: String, default: '' },
  customTimeRange: { type: Array, default: () => [] },
})

const totalNumber = ref(0)

function getNginxData() {
  let chartOptions = {
    chartType: props.kind,
    groupNames: queryFilter.value.groupNames,
    tags: queryFilter.value.tags,
    serviceGroupNames: queryFilter.value.tags,
    domains: queryFilter.value.domains,
    appProfileNames: queryFilter.value.appProfileNames,
    origins: queryFilter.value.origins,
    originHosts: queryFilter.value.originHosts,
    originPorts: queryFilter.value.originPorts,
    slbNames: queryFilter.value.slbNames,
    edgeNames: queryFilter.value.edgeNames,
    latencyStatusNames: queryFilter.value.latencyStatusNames,
    dateRangeOptions: {
      index: queryFilter.value.dateRangeOptions.index,
      customTimeRange: queryFilter.value.dateRangeOptions.customTimeRange,
    },
    apiEndpoint: '',
  }

  return getEdgeChartData(chartOptions).then((res) => {
    if (res.data.num != null) {
      totalNumber.value = formatNumToString(res.data.num)
    } else {
      totalNumber.value = 0
    }
  })
}

function formatNumToString(num) {
  let formatedNum = parseFloat(num).toFixed(props.decimalPlaces)
  formatedNum = numeral(num).format(props.numeralFormat)

  return props.numStringPrefix + formatedNum + props.numStringSuffix
}

const queryFilter = computed(() => {
  const queryFilter = store.state.dashboard.queryFilter

  return {
    groupNames: store.state.queryGroupName,
    tags: props.tags.length > 0 ? props.tags : queryFilter.tags,
    serviceGroupNames:
      props.serviceGroupNames.length > 0
        ? props.serviceGroupNames
        : queryFilter.serviceGroupNames,
    domains: props.domains.length > 0 ? props.domains : queryFilter.serverNames,
    appProfileNames:
      props.appProfileNames.length > 0
        ? props.appProfileNames
        : queryFilter.appProfileNames,
    origins: props.origins.length > 0 ? props.origins : queryFilter.origins,
    originHosts:
      props.originHosts.length > 0 ? props.originHosts : queryFilter.originHosts,
    originPorts:
      props.originPorts.length > 0 ? props.originPorts : queryFilter.originPorts,
    slbNames: props.slbNames.length > 0 ? props.slbNames : queryFilter.slbNames,
    edgeNames: props.edgeNames.length > 0 ? props.edgeNames : queryFilter.edgeNames,
    latencyStatusNames:
      props.latencyStatusNames.length > 0
        ? props.latencyStatusNames
        : queryFilter.latencyStatusNames,
    // dateRangeOptions: {
    //   index: props.dateRange || queryFilter.dateRangeOptions.index,
    //   customTimeRange:
    //     props.customTimeRange.length > 0
    //       ? customTimeRange
    //       : queryFilter.dateRangeOptions.customTimeRange,
    // },
    dateRangeOptions: dateRange.value,
  }
})

const dateRange = computed(() => {
  return {
    index: store.state.dateRangeOptions.index,
    customTimeRange: store.state.dateRangeOptions.customTimeRange,
  }
})

watch(
  () => dateRange.value,
  (to) => {
    getNginxData()
  }
)

onMounted(() => {
  getNginxData()
})
</script>

<template>
  <div>
    <span class="dark-inverted">{{ totalNumber }}</span>
  </div>
</template>
