<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, onMounted, computed, watch, inject } from 'vue'
import { getEdgeChartDataV2 } from '/@src/api/monitor'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import numeral from 'numeral'
import store from '/@src/stores/index'
import { tagLabels } from './filterOption'

const { dashboardQueryFilters, updateDashboardQueryFilters } = inject(
  'dashboardQueryFilters'
)

const { locale, t } = useI18n()
const notif = useNotyf()
const props = defineProps({
  hasFilter: { type: Boolean, default: true },
  numeralFormat: { type: String, default: '0.00a' },
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
      dashboardQueryFilters.length > 0
        ? dashboardQueryFilters
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

const isDataExist = ref()
const isLoading = ref()
const nginxData = ref()
const dataCollection = ref()
const progressSum = ref()

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
    dashboardQueryFilters: lineChartOptions.value.dashboardQueryFilters,
    groupNames: store.state.queryGroupName,
    dateRangeOptions: {
      index: lineChartOptions.value.dateRangeOptions.index,
      customTimeRange: lineChartOptions.value.dateRangeOptions.customTimeRange,
    },
  }

  return getEdgeChartDataV2(chartOptions).then((res) => {
    nginxData.value = res.data

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
      //chart summary
      dataCollection.value = nginxData.value.datasets.map((item, index) => {
        let sum = item.data.reduce((prev, next) => prev + next, 0)
        let formattedSum = formatNumToString(sum)

        return {
          name: item.label !== '' ? item.label : '-',
          data: formattedSum,
          chartFilterKey: chartOptions.chartMetricGroupByTerms,
          sum: sum,
          chartFilterValue: item.label,
          chartFilterEnabled: true,
        }
      })

      dataCollection.value = dataCollection.value.filter((item) => item.sum > 0)

      dataCollection.value.sort(function (a, b) {
        return b.sum - a.sum
      })

      dataCollection.value = dataCollection.value.map((item, index) => {
        item['color'] = dotColor[index]
        return item
      })

      const _total = dataCollection.value.map((item) => {
        return item.sum
      })

      const progressSum = _total.reduce((prev, next) => prev + next)

      dataCollection.value = dataCollection.value.map((item) => {
        const percentage = ((item.sum / progressSum) * 100).toFixed(2)
        return {
          ...item,
          percentage: percentage,
        }
      })

      isDataExist.value = true
      isLoading.value = false
    } else {
      isDataExist.value = false
      isLoading.value = false
    }
  })
}

function formatNumToString(num) {
  let formatedNum = parseFloat(num).toFixed(props.decimalPlaces)
  formatedNum = num >= 1000 ? numeral(num).format(props.numeralFormat) : num

  return props.numStringPrefix + formatedNum + props.numStringSuffix
}

function filterChartData(item, chartFilterOperator) {
  const { chartFilterKey, chartFilterValue } = item
  try {
    updateDashboardQueryFilters('ADD_FILTER', {
      chartFilterKey,
      chartFilterValue,
      chartFilterOperator,
    })
  } catch (error) {
    notif.error(error.message)
  }
}

function clearFilter(item) {
  updateDashboardQueryFilters('REMOVE_FILTER', item)
}

watch(
  () => dateRange.value,
  (to) => {
    getNginxData()
    isLoading.value = true
  }
)

watch(
  () => dashboardQueryFilters,
  (to) => {
    getNginxData()
    isLoading.value = true
  },
  { deep: true }
)

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
            <p class="item-name">
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
                (el) => el.chartFilterKey === item.chartFilterKey
              )
            "
            class="filter-buttons"
          >
            <button class="filter-btn" @click="clearFilter(item)">
              <span>{{ t('filter.removeText') }}</span>
            </button>
          </div>

          <div v-else class="filter-buttons">
            <button @click="filterChartData(item, 'is')">
              <span>{{ t('filter.filterText') }}</span>
            </button>
            <button @click="filterChartData(item, 'not')">
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

  <div v-if="isDataExist && !isLoading" class="cache-status-bars">
    <div
      v-for="item in dataCollection"
      :key="item"
      :style="{ flexBasis: `${item.percentage}%` }"
    >
      <div
        v-if="item.percentage > 10"
        :class="item.color"
        class="cache-status-bar"
        @click="filterChartData(item, 'is')"
        @keypress="bar"
      >
        <tippy>
          <div class="bar">
            <span>{{ item.name }}</span>
            <span>{{ item.percentage }} %</span>
          </div>
          <template #content>
            <span> {{ item.name }} : {{ item.data }} ({{ item.percentage }}%) </span>
          </template>
        </tippy>
      </div>

      <div
        v-else
        :class="item.color"
        class="cache-status-bar"
        @click="filterChartData(item, 'is')"
        @keypress="bar"
      >
        <tippy>
          <div class="bar">
            <span></span>
            <span></span>
          </div>
          <template #content>
            <span> {{ item.name }} : {{ item.data }} ({{ item.percentage }}%) </span>
          </template>
        </tippy>
      </div>
    </div>
  </div>

  <div v-if="isLoading" class="cache-status-bars">
    <div class="content-shape loads" style="--5f472bef: 60%; --0e8f8ec0: 10px"></div>
  </div>

  <div v-if="!isLoading && !isDataExist" class="cache-status-bars">
    <div class="no-data">No Data</div>
  </div>
</template>

<style lang="scss" scoped>
.chart-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  column-gap: 20px;
  row-gap: 20px;
  margin-bottom: 20px;

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

.no-data {
  display: flex;
  width: 100%;
  height: 45px;
  color: $dark;
  justify-content: center;
  align-items: center;
  background: $light-grey;
}

.is-dark {
  .no-data {
    background: $grey;
  }
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

// chart bar

.cache-status-bars {
  display: flex;
  margin: 0 30px;

  .loads {
    height: 45px;
  }

  .cache-status-bar {
    transition: 100ms;
    cursor: pointer;

    &:hover {
      transform: scale(1.03);
      transition: 100ms;
      box-shadow: 0px 0px 40px -7px rgba(0, 0, 0, 0.12);
    }
  }

  .bar {
    display: flex;
    flex-direction: column;
    height: 45px;
    text-align: center;
    min-width: 20px;
    justify-content: center;

    span {
      color: $white !important;
    }
  }
}

//color code
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

@media only screen and (max-width: 518px) {
  .chart-summary {
    .summary-items {
      border-bottom: 1px solid $lighter-grey;
      border-right: none;
    }
  }

  .cache-status-bars {
    margin: 0 10px;
  }
}
</style>
