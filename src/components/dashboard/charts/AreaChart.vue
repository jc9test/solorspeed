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
const newData = ref()
const newLabel = ref([])
const chartSeries = ref([])
const chartOptions = ref({
  chart: {
    id: 'request-card',
    type: 'area',
    height: 83,
    sparkline: {
      enabled: true,
    },
    group: 'area-chart',
  },
  yaxis: {
    min: 0,
    labels: {
      minWidth: 100,
      show: false,
    },
    showAlways: false,
  },
})

function updateChart(newData, newLabel, chartId) {
  chartSeries.value = newData

  chartOptions.value = {
    chart: {
      id: chartId,
      type: 'area',
      height: 83,
      sparkline: {
        enabled: true,
      },
      group: 'area-chart',
      animations: {
        enabled: false,
      },
    },
    colors: [themeColors.primary, themeColors.accent],
    stroke: {
      width: 2.5,
      curve: 'smooth',
    },
    fill: {
      opacity: 1,
    },
    // labels: newLabel,
    yaxis: {
      min: 0,
      labels: {
        minWidth: 100,
        show: false,
      },
      showAlways: false,
    },
    xaxis: {
      type: 'datetime',
      categories: newLabel,
      tickPlacement: 'on',
      labels: {
        rotate: -50,
        rotateAlways: true,
        formatter: function (value, timestamp, otps) {
          return formatChartLabel(value)
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => {
          if (value > 1000) {
            return numeral(value).format(props.numeralFormat)
          } else {
            return value
          }
        },
      },
    },
    noData: {
      text: 'No Data',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: -15,
      style: {
        fontSize: '20px',
      },
    },
  }
}

function formatChartLabel(value) {
  let formattedDate = new Date(value)
  let timeRange = dateRange.value.index
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  let hours = formattedDate.getHours()
  let minutes = formattedDate.getMinutes().toString()
  let seconds = formattedDate.getSeconds().toString()
  let month = months[formattedDate.getMonth()]
  let day = formattedDate.getDate()

  if (minutes.length < 2) minutes = '0' + minutes
  if (seconds.length < 2) seconds = '0' + seconds

  let newTime = `${hours}:${minutes}:${seconds}`
  let newDate = `${month} ${day}`
  let newRange = `${month} ${day} ${hours}:${minutes}`

  if (timeRange === '5') {
    return newDate
  } else if (timeRange === '99' && dateRangeDay.value > 7) {
    return newDate
  } else if (timeRange === '99' && dateRangeDay.value <= 7) {
    return newRange
  } else {
    return newTime
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

    let datesItem = nginxData.value.labels ? nginxData.value.labels : ''
    let timeRange = chartOptions.dateRangeOptions.index
    let total = nginxData.value.datasets.map((item, index) => {
      let sum = item.data.reduce((prev, next) => prev + next, 0)
      return formatNumToString(sum)
    })

    dataTotal.value = total[0]

    if (nginxData.value.datasets.length !== 0) {
      checkTimeRangeDay()
      //chart y-axis
      newData.value = nginxData.value.datasets.map((item, index) => {
        let itemName

        if (props.chartType === 'request') {
          itemName = 'Request'
        } else if (props.chartType === 'firewall') {
          itemName = 'Waf'
        } else if (props.chartType === 'dataUsage' && index === 0) {
          itemName = 'Data Served'
        } else if (props.chartType === 'dataUsage' && index === 1) {
          itemName = 'Data Cached'
        }

        return {
          name: itemName ? itemName : '-',
          data: item.data,
        }
      })

      newData.value.sort(function (a, b) {
        return b.data - a.data
      })

      // chart x-axis
      newLabel.value = datesItem
      isDataExist.value = true
    } else {
      newData.value = []
      newLabel.value = []
      isDataExist.value = false
    }

    updateChart(newData.value, newLabel.value, props.chartId)
  })
}

function checkTimeRangeDay() {
  if (dateRange.value.index === '99') {
    let _start = dateRange.value.customTimeRange[0].split('-').join('/').slice(0, 10)
    let _end = dateRange.value.customTimeRange[1].split('-').join('/').slice(0, 10)
    let start = new Date(_start)
    let end = new Date(_end)

    let difference = end.getTime() - start.getTime()
    dateRangeDay.value = Math.ceil(difference / (1000 * 3600 * 24))
  }
}

function formatNumToString(num) {
  let formatedNum = parseFloat(num).toFixed(props.decimalPlaces)
  formatedNum = num >= 1000 ? numeral(num).format(props.numeralFormat) : num

  return props.numStringPrefix + formatedNum + props.numStringSuffix
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
    <span class="dark-inverted">{{ dataTotal ?? 0 }}</span>
  </div>

  <div v-if="props.type === 'chart'">
    <apexchart
      :height="chartOptions.chart.height"
      type="area"
      :options="chartOptions"
      :series="chartSeries"
    >
    </apexchart>
  </div>
</template>
