<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, onMounted, onUpdated, computed, watch } from 'vue'
import { getEdgeChartData } from '/@src/api/monitor'
import { themeColors } from '/@src/utils/themeColors'
import { gauge } from 'billboard.js'
import numeral from 'numeral'
import store from '/@src/stores/index'

const props = defineProps({
  chartType: { type: String, default: 'cacheStatusPieChart' },
  numeralFormat: { type: String, default: '0.00a' },

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

let isDataExist = ref()
let nginxData = ref()

const chartData = ref({
  series: [0],
  title: {
    text: '',
  },
  chart: {
    height: 200,
    type: 'radialBar',
    sparkline: {
      enabled: true,
    },
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          offsetY: -2,
          fontSize: '22px',
          show: false,
        },
      },
    },
  },
})

function updateChart(newData) {
  chartData.value = {
    series: [newData],
    title: {
      text: '',
    },
    chart: {
      height: 200,
      type: 'radialBar',
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    colors: [themeColors.accent],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: false,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          enabled: false,
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ['Cached'],
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => {
          return value + '%'
        },
      },
    },
  }
}

function getNginxData() {
  var chartOptions = {
    chartType: props.chartType,
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
    let newData = ref()

    nginxData.value = res.data
    if (nginxData.value.datasets.length !== 0) {
      let cachedData = nginxData.value.datasets[0].data[0]
      let uncachedData = nginxData.value.datasets[0].data[1]
      newData.value = ((cachedData / (cachedData + uncachedData)) * 100).toFixed(2)
    } else {
      newData.value = 0
    }

    updateChart(newData.value)
  })
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
    dateRangeOptions: dateRange.value,
    // dateRangeOptions: {
    //   index: props.dateRange || queryFilter.dateRangeOptions.index,
    //   customTimeRange:
    //     props.customTimeRange.length > 0
    //       ? customTimeRange
    //       : queryFilter.dateRangeOptions.customTimeRange,
    // },
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
  <div id="gauge-holder" class="gauge-holder">
    <apexchart
      id="gaugeChart"
      :height="chartData.chart.height"
      :type="chartData.chart.type"
      :series="chartData.series"
      :options="chartData"
    >
    </apexchart>
  </div>
</template>
