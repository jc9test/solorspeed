<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ref,
  onMounted,
  computed,
  watch,
  onBeforeUpdate,
  onBeforeMount,
  onUpdated,
  inject,
} from 'vue'
import { getEdgeChartDataV2 } from '/@src/api/monitor'
import { themeColors } from '/@src/utils/themeColors'
import { useI18n } from 'vue-i18n'
import { default as countryList } from '/@src/data/json/countryList.json'
import ClipboardJS from 'clipboard'
import useNotyf from '/@src/composable/useNotyf'
import numeral from 'numeral'
import store from '/@src/stores/index'
import { tagLabels } from './filterOption'

const { locale, t } = useI18n()
const clipboard = new ClipboardJS('.item-name')
const notif = useNotyf()
const { dashboardQueryFilters, updateDashboardQueryFilters } = inject(
  'dashboardQueryFilters'
)
const props = defineProps({
  hasFilter: { type: Boolean, default: true },
  chartType: { type: String, default: '' },
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
const dateRangeDay = ref()
const prevRange = ref({ index: '4', customTimeRange: [] })
const isChangeByDrag = ref(false)
const isDataExist = ref()
const isLoading = ref()
const nginxData = ref()
const newData = ref()
const newLabel = ref([])
const dataCollection = ref()
const summaryData = ref([])
const tooltipNum = ref('5')
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

const chartData = ref({
  series: [],
  chart: {
    height: 400,
  },
  noData: {
    text: 'Loading...',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: -15,
    style: {
      fontSize: '20px',
    },
  },
})

function updateChart(newData, newLabel, tooltipNum) {
  chartData.value = {
    series: newData,
    chart: {
      height: 400,
      zoom: {
        enabled: true,
      },
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
      },
      selection: {
        enabled: true,
      },
      events: {
        zoomed: function (chartContext, { xaxis }) {
          if (xaxis.min && xaxis.max !== undefined) {
            let _total = chartContext.getSeriesTotalXRange(xaxis.min - 1, xaxis.max + 1)
            summaryData.value = _total
          } else {
            summaryData.value = []
          }
          setTimeRange(chartContext)
        },
      },
    },
    colors: [
      themeColors.blue,
      themeColors.green,
      themeColors.purple,
      themeColors.yellow,
      themeColors.orange,
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      curve: 'smooth',
    },
    legend: {
      show: true,
      offsetY: 0,
      markers: {
        width: 12,
        height: 12,
      },
      onItemClick: {
        toggleDataSeries: false,
      },
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      type: 'datetime',
      categories: newLabel,
      tickAmount: tooltipNum,
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
    markers: {
      size: [0],
      strokeWidth: 2,
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

  isLoading.value = false
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
  isLoading.value = true

  let chartOptions = {
    chartVisualizeType: lineChartOptions.value.chartVisualizeType,
    chartMetric: lineChartOptions.value.chartMetric,
    chartMetricGroupBy: lineChartOptions.value.chartMetricGroupBy,
    chartMetricGroupByTerms: lineChartOptions.value.chartMetricGroupByTerms,
    chartMetricGroupByTermSize: lineChartOptions.value.chartMetricGroupByTermSize,
    chartMetricGroupByFilters: lineChartOptions.value.chartMetricGroupByFilters,
    chartQueryFilters: lineChartOptions.value.chartQueryFilters,
    dashboardQueryFilters: dashboardQueryFilters.value,
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
    let dotColor = [
      'blue',
      'green',
      'purple',
      'yellow',
      'orange',
      'blue',
      'green',
      'purple',
      'yellow',
      'orange',
    ]

    if (nginxData.value.datasets.length !== 0) {
      checkTimeRangeDay()
      //chart summary

      dataCollection.value = nginxData.value.datasets.map((item, index) => {
        let sum = item.data.reduce((prev, next) => prev + next, 0)
        let formattedSum = formatNumToString(sum)
        let itemName
        let filterKey
        let filterValue
        let filterSort

        if (lineChartOptions.value.chartMetricGroupByTerms === 'tb_action.keyword') {
          itemName = actionOptions[item.label]
        } else if (lineChartOptions.value.chartMetricGroupByTerms === 'country.keyword') {
          itemName = countryList[item.label]
        } else {
          itemName = item.label
        }

        if (props.chartType === 'servedBy') {
          filterKey = chartOptions.chartMetricGroupByFilters[0].chartFilterKey

          if (item.label === 'SolarSpeed') {
            filterValue = 'true'
            filterSort = 2
          } else if (item.label === 'Origin') {
            filterValue = 'false'
            filterSort = 1
          } else {
            filterValue = '*'
            filterSort = 0
          }
        } else {
          filterKey = chartOptions.chartMetricGroupByTerms
          filterValue = item.label
        }

        return {
          name: itemName ? itemName : '-',
          data: formattedSum,
          chartFilterKey: filterKey,
          chartFilterValue: filterValue,
          chartFilterEnabled: true,
          sum: sum,
          sort: filterSort,
        }
      })

      if (props.chartType !== 'servedBy') {
        dataCollection.value = dataCollection.value.filter((item) => item.sum > 0)
      }

      if (props.chartType === 'servedBy') {
        dataCollection.value.sort(function (a, b) {
          return a.sort - b.sort
        })
      } else {
        dataCollection.value.sort(function (a, b) {
          return b.sum - a.sum
        })
      }

      dataCollection.value = dataCollection.value.map((item, index) => {
        item['color'] = dotColor[index]
        return item
      })

      //chart y-axis
      newData.value = nginxData.value.datasets.map((item) => {
        let itemName
        let sum = item.data.reduce((prev, next) => prev + next, 0)

        if (lineChartOptions.value.chartMetricGroupByTerms === 'tb_action.keyword') {
          itemName = actionOptions[item.label]
        } else if (lineChartOptions.value.chartMetricGroupByTerms === 'country.keyword') {
          itemName = countryList[item.label]
        } else if (props.chartType === 'servedBy') {
          itemName = 'Served By ' + item.label
        } else {
          itemName = item.label
        }

        return {
          name: itemName ? itemName : '-',
          data: item.data,
          sum: sum,
        }
      })

      newData.value.sort(function (a, b) {
        return b.sum - a.sum
      })

      if (props.chartType !== 'servedBy') {
        newData.value = newData.value.filter((item) => item.sum > 0)
      }

      // chart x-axis
      newLabel.value = datesItem
      isDataExist.value = true
    } else {
      newData.value = []
      newLabel.value = []
      timeRange = 'empty'
      isDataExist.value = false
    }

    setTooltipsNumber(timeRange, dateRangeDay.value)
    updateChart(newData.value, newLabel.value, tooltipNum.value)
  })
}

function addQueryFilter(item, chartFilterOperator) {
  const { chartFilterKey, chartFilterValue } = item
  try {
    updateDashboardQueryFilters('ADD_FILTER', {
      chartFilterKey,
      chartFilterValue,
      chartFilterOperator,
    })
  } catch (error) {
    notif.error(error)
  }
}

function clearFilter(item) {
  updateDashboardQueryFilters('REMOVE_FILTER', item)
}

function setTooltipsNumber(timeRange, dateRangeDay) {
  switch (timeRange) {
    case 'empty': //data empty
      tooltipNum.value = 0
    case '0': //last 5 minutes
      tooltipNum.value = 5
      break
    case '1': //last 1 hour
      tooltipNum.value = 5
      break
    case '2': //last 3 hour
      tooltipNum.value = 2
      break
    case '3': //last 6 hour
      tooltipNum.value = 5
      break
    case '4': //last 1 day
      tooltipNum.value = 13
      break
    case '5': //last 7 days
      tooltipNum.value = 7
      break
    case '99':
      if (dateRangeDay > 7) {
        tooltipNum.value = nginxData.value.labels.length
      } else {
        tooltipNum.value = nginxData.value.labels.length / 3
      }
      break
  }
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

function setTimeRange(chartContext) {
  isChangeByDrag.value = true

  let all = newLabel.value
  let selected = chartContext.w.globals.labels

  let _start = selected[0]
  let _end = selected[selected.length - 1]
  let start = new Date(all[_start - 1])
  let end = new Date(all[_end - 1])

  let timeRange = []
  let _startYear = start.getFullYear().toString()
  let _startMonth = (start.getMonth() + 1).toString()
  let _startDate = start.getDate().toString()
  let _startHours = start.getHours().toString()
  let _startMinutes = start.getMinutes().toString()

  let _endYear = end.getFullYear().toString()
  let _endMonth = (end.getMonth() + 1).toString()
  let _endDate = end.getDate().toString()
  let _endHours = end.getHours().toString()
  let _endMinutes = end.getMinutes().toString()

  if (_startDate.length < 2) _startDate = '0' + _startDate
  if (_endDate.length < 2) _endDate = '0' + _endDate
  if (_startHours.length < 2) _startHours = '0' + _startHours
  if (_endHours.length < 2) _endHours = '0' + _endHours
  if (_startMinutes.length < 2) _startMinutes = '0' + _startMinutes
  if (_endMinutes.length < 2) _endMinutes = '0' + _endMinutes

  let customTimeStart = `${_startYear}-${_startMonth}-${_startDate} ${_startHours}:${_startMinutes}`
  let customTimeEnd = `${_endYear}-${_endMonth}-${_endDate} ${_endHours}:${_endMinutes}`

  timeRange.push(customTimeStart)
  timeRange.push(customTimeEnd)

  store.commit('SET_TIME_RANGE', {
    index: '99',
    customTimeRange: timeRange,
  })
}

function initChart() {
  isChangeByDrag.value = true
  const _prevRange = prevRange.value
  store.commit('SET_TIME_RANGE', prevRange.value)
}

function copyText() {
  notif.success('Already copied.')
}

watch(
  () => dateRange.value,
  (to) => {
    getNginxData()
    isLoading.value = true

    if (isChangeByDrag.value === false) {
      prevRange.value = to
    }
  }
)

watch(
  () => dashboardQueryFilters.value,
  (to) => {
    getNginxData()
    isLoading.value = true
  },
  { deep: true }
)

onUpdated(() => {
  isChangeByDrag.value = false
})

onMounted(() => {
  getNginxData()
})
</script>

<template>
  <div v-if="isDataExist && !isLoading" class="chart-summary">
    <div v-for="item in dataCollection" :key="item" class="summary-items">
      <div class="summary-item">
        <div class="title-with-dot">
          <div :class="`dot ${item.color}`"></div>
          <abbr :title="item.name">
            <p
              class="item-name"
              :data-clipboard-text="item.name"
              @click="copyText()"
              @keypress="bar"
            >
              {{ item.name }}
            </p>
          </abbr>
        </div>
        <div v-if="props.hasFilter" class="item-detail">
          <span class="dark-inverted item-detail-total">
            {{ item.data }}
          </span>

          <div
            v-if="
              dashboardQueryFilters.some(
                (el) =>
                  el.chartFilterKey === item.chartFilterKey &&
                  el.chartFilterValue === item.chartFilterValue
              )
            "
            class="filter-buttons"
          >
            <button class="filter-btn" @click="clearFilter(item)">
              <span>{{ t('filter.removeText') }}</span>
            </button>
          </div>

          <div v-else class="filter-buttons">
            <button @click="addQueryFilter(item, 'is')">
              <span>{{ t('filter.filterText') }}</span>
            </button>
            <button @click="addQueryFilter(item, 'not')">
              <span>{{ t('filter.excludeText') }}</span>
            </button>
          </div>
        </div>

        <div v-else class="item-detail">
          <span class="dark-inverted">
            {{ item.data }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!isDataExist && !isLoading">
    <div class="empty-summary"></div>
  </div>

  <div v-if="isLoading">
    <div class="chart-summary">
      <div v-for="index in 5" :key="index" class="summary-items loading-items">
        <div class="content-shape loads" style="--5f472bef: 60%; --0e8f8ec0: 10px"></div>
        <div class="content-shape loads" style="--5f472bef: 60%; --0e8f8ec0: 10px"></div>
      </div>
    </div>
  </div>

  <button @click="initChart">
    <i class="iconify" data-icon="feather:refresh-cw"></i>
  </button>

  <!-- <div v-if="!isLoading"> -->
  <apexchart
    :height="chartData.chart.height"
    :type="chartData.chart.type"
    :series="chartData.series"
    :options="chartData"
  >
  </apexchart>
  <!-- </div> -->
</template>

<style lang="scss" scoped>
.chart-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  column-gap: 20px;
  row-gap: 20px;
  margin-bottom: 40px;

  .loading-items {
    padding: 0 40px;
    margin-top: 10px;
  }

  .summary-items {
    border-right: 1px solid $lighter-grey;

    &:last-child {
      border-right: none;
    }

    &:hover button {
      display: block;
    }

    &:hover .item-detail-total {
      display: none;
    }

    button {
      margin: 10px 0 20px 0;
      display: none;
      width: 60px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 60px;
      padding: 0 10px;

      .title-with-dot {
        display: flex;
        align-items: center;

        .blue {
          background: #37c3ff;
        }

        .green {
          background: #41b883;
        }

        .purple {
          background: #8269b2;
        }

        .yellow {
          background: #ffd66e;
        }

        .orange {
          background: #ffa981;
        }

        .dot {
          height: 10px;
          width: 10px;
          min-width: 10px;
          border-radius: $radius-rounded;
          margin: 0 5px 0 0;
        }

        .item-name {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: default;
        }
      }

      .filter-buttons {
        span {
          font-weight: 400;
          font-size: 1rem;
          border: 1px solid $primary;
          border-radius: 5px;
          padding: 0 8px;

          &:hover {
            background-color: $primary;
            color: $white;
          }
        }
      }

      span {
        font-weight: bold;
        font-size: 1.5rem;
      }

      .item-detail {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
      }

      .filter-buttons {
        position: absolute;
        display: flex;
      }
    }
  }
}

abbr {
  text-decoration: none;
}

.is-dark {
  .chart-summary {
    color: $white;

    .filter-buttons {
      span {
        color: #fff !important;
      }
    }
  }
}

.empty-summary {
  height: 20px;
}

button {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;

  .iconify {
    &:hover {
      color: $primary;
    }
  }
}

.is-dark {
  button {
    .iconify {
      color: $light-grey;

      &:hover {
        color: $primary;
      }
    }
  }
}

// chart label
.apexcharts-legend {
  .apexcharts-legend-text {
    max-width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media only screen and (max-width: 518px) {
  .chart-summary {
    .summary-items {
      border-bottom: 1px solid $lighter-grey;
      border-right: none;
    }
  }
}
</style>
