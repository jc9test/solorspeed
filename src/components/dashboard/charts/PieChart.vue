<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, onMounted, computed, watch, onUpdated } from 'vue'
import { getEdgeChartDataV2 } from '/@src/api/monitor'
import { themeColors } from '/@src/utils/themeColors'
import { default as countryList } from '/@src/data/json/countryList.json'
import numeral from 'numeral'
import store from '/@src/stores/index'

const props = defineProps({
  hasFilter: { type: Boolean, default: true },
  type: { type: String, default: 'chart' },
  chartType: { type: String, default: '' },
  chartId: { type: String, default: '' },
  numeralFormat: { type: String, default: '0.0a' },
  decimalPlaces: { type: Number, default: 2 },
  numStringPrefix: { type: String, default: '' },
  numStringSuffix: { type: String, default: '' },

  chartVisualizeType: { type: String, default: 'lineChart' },
  chartMetric: { type: String, default: '' },
  chartMetricGroupBy: { type: String, default: '' },
  chartMetricGroupByTerms: { type: String, default: '' },
  chartMetricGroupByTermSize: { type: Number, default: 10 },
  chartMetricGroupByFilters: { type: Array, default: () => [] },
  chartQueryFilters: { type: Array, default: () => [] },
  dashboardQueryFilters: { type: Array, default: () => [] },
  dateRange: { type: String, default: '' },
  customTimeRange: { type: Array, default: () => [] },
})

const lineChartOptions = computed(() => {
  const lineChartOptions = store.state.dashboard.dashboardChartOptions

  return {
    chartVisualizeType:
      props.chartVisualizeType.length > 0
        ? props.chartVisualizeType
        : lineChartOptions.chartVisualizeType,
    chartMetric:
      props.chartMetric.length > 0 ? props.chartMetric : lineChartOptions.chartMetric,
    chartMetricGroupBy:
      props.chartMetricGroupBy.length > 0
        ? props.chartMetricGroupBy
        : lineChartOptions.chartMetricGroupBy,
    chartMetricGroupByTerms:
      props.chartMetricGroupByTerms.length > 0
        ? props.chartMetricGroupByTerms
        : lineChartOptions.chartMetricGroupByTerms,
    chartMetricGroupByTermSize:
      props.chartMetricGroupByTermSize.length > 0
        ? props.chartMetricGroupByTermSize
        : lineChartOptions.chartMetricGroupByTermSize,
    chartMetricGroupByFilters:
      props.chartMetricGroupByFilters.length > 0
        ? props.chartMetricGroupByFilters
        : lineChartOptions.chartMetricGroupByFilters,
    chartQueryFilters:
      props.chartQueryFilters.length > 0
        ? props.chartQueryFilters
        : lineChartOptions.chartQueryFilters,
    dashboardQueryFilters:
      props.dashboardQueryFilters.length > 0
        ? props.dashboardQueryFilters
        : lineChartOptions.dashboardQueryFilters,
    dateRangeOptions: dateRange.value,
  }
})

const dateRange = computed(() => {
  return {
    index: store.state.dateRangeOptions.index,
    customTimeRange: store.state.dateRangeOptions.customTimeRange,
  }
})
const filters = computed(() => {
  return store.state.dashboard.dashboardChartOptions.dashboardQueryFilters
})
const dateRangeDay = ref()
const isDataExist = ref()
const nginxData = ref()
const dataTotal = ref()
const cachedDataTotal = ref()
const newData = ref('0')
const newLabel = ref([])
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
    animations: {
      enabled: true,
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
      animations: {
        enabled: true,
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
          return cachedDataTotal.value
        },
      },
    },
  }
}

function getNginxData() {
  let chartOptions = {
    chartVisualizeType: lineChartOptions.value.chartVisualizeType,
    chartMetric: lineChartOptions.value.chartMetric,
    chartMetricGroupBy: lineChartOptions.value.chartMetricGroupBy,
    chartMetricGroupByTerms: lineChartOptions.value.chartMetricGroupByTerms,
    chartMetricGroupByTermSize: lineChartOptions.value.chartMetricGroupByTermSize,
    chartMetricGroupByFilters: lineChartOptions.value.chartMetricGroupByFilters,
    chartQueryFilters: lineChartOptions.value.chartQueryFilters,
    dashboardQueryFilters: lineChartOptions.value.dashboardQueryFilters,
    groupNames: store.state.queryGroupName,
    dateRangeOptions: {
      index: lineChartOptions.value.dateRangeOptions.index,
      customTimeRange: lineChartOptions.value.dateRangeOptions.customTimeRange,
    },
  }

  return getEdgeChartDataV2(chartOptions).then((res) => {
    nginxData.value = res.data

    const cached = nginxData.value.datasets[1].data
    const uncached = nginxData.value.datasets[0].data

    const uncachedData = uncached ? uncached.reduce((prev, next) => prev + next, 0) : 0
    const cachedData = cached ? cached.reduce((prev, next) => prev + next, 0) : 0
    cachedDataTotal.value = numeral(cachedData).format(props.numeralFormat)

    const ratio = cachedData / (cachedData + uncachedData)
    const percent = Number.isNaN(ratio) ? 0 : ratio * 100

    newData.value = percent.toFixed(2)

    dataTotal.value = Number(newData.value) > 0 ? Number(newData.value) : 0
    updateChart(percent)
  })
}

watch(
  () => dateRange.value,
  (to) => {
    getNginxData()
  }
)

watch(
  () => filters,
  (to) => {
    getNginxData()
  },
  { deep: true }
)

onMounted(() => {
  getNginxData()
})
</script>

<template>
  <div v-if="props.type === 'num'">
    <span class="dark-inverted">{{ dataTotal ?? 0 }}%</span>
  </div>

  <div v-if="props.type === 'chart'" class="gauge-holder">
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
