<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, onMounted, computed, watch, inject } from 'vue'
import { getEdgeChartDataV2 } from '/@src/api/monitor'
import { themeColors } from '/@src/utils/themeColors'
import { default as countryList } from '/@src/data/json/countryList.json'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import numeral from 'numeral'
import store from '/@src/stores/index'
import { tagLabels } from './filterOption'
const { locale, t } = useI18n()
const notif = useNotyf()
const { dashboardQueryFilters, updateDashboardQueryFilters } = inject(
  'dashboardQueryFilters'
)
const props = defineProps({
  numeralFormat: { type: String, default: '0.00a' },
  decimalPlaces: { type: Number, default: 2 },
  numStringPrefix: { type: String, default: '' },
  numStringSuffix: { type: String, default: '' },

  itemNumber: { type: Number, default: 3 },
  title: { type: String, default: 'Title' },
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

const isDataExist = ref()
const isLoading = ref()
const nginxData = ref()
const dataCollection = ref()
const nprogressSum = ref()
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

function getNginxData() {
  const chartOptions = {
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

  isLoading.value = true

  return getEdgeChartDataV2(chartOptions).then((res) => {
    nginxData.value = res.data

    if (nginxData.value.datasets.length !== 0) {
      dataCollection.value = nginxData.value.datasets.map((item) => {
        const sum = item.data.reduce((prev, next) => prev + next, 0)
        let itemName
        let formattedData = formatNumToString(sum)

        if (lineChartOptions.value.chartMetricGroupByTerms === 'tb_action.keyword') {
          itemName = actionOptions[item.label]
        } else if (lineChartOptions.value.chartMetricGroupByTerms === 'country.keyword') {
          itemName = countryList[item.label]
        } else {
          itemName = item.label
        }

        return {
          name: itemName ? itemName : '-',
          data: sum,
          formattedData: formattedData,
          chartFilterKey: chartOptions.chartMetricGroupByTerms,
          chartFilterValue: item.label ? item.label : '-',
          chartFilterEnabled: true,
        }
      })

      dataCollection.value = dataCollection.value.filter((item) => item.data > 0)

      dataCollection.value.sort(function (a, b) {
        return b.data - a.data
      })

      const _total = dataCollection.value.map((item) => {
        return item.data
      })

      nprogressSum.value =
        _total.length > 0 ? _total.reduce((prev, next) => prev + next) : 0

      if (dataCollection.value.length >= 1) {
        isDataExist.value = true
      } else {
        isDataExist.value = false
      }

      isLoading.value = false
    } else {
      isDataExist.value = false
      isLoading.value = false
    }
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

function formatNumToString(num) {
  let formatedNum = parseFloat(num).toFixed(props.decimalPlaces)
  formatedNum = num >= 1000 ? numeral(num).format(props.numeralFormat) : num

  return props.numStringPrefix + formatedNum + props.numStringSuffix
}

watch(
  () => dateRange.value,
  (to) => {
    getNginxData()
    isLoading.value = true
  }
)

watch(
  () => props.dashboardQueryFilters,
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
  <div class="raw-card">
    <div class="card-title dark-inverted">{{ title }}</div>
    <div v-if="isDataExist && !isLoading">
      <div
        v-for="item in dataCollection.slice(0, itemNumber)"
        :key="item"
        class="card-detail"
      >
        <div class="card-detail-left">
          <abbr :title="item.name">
            <span class="dark-inverted">{{ item.name }}</span>
          </abbr>
        </div>

        <div class="card-detail-right">
          <span class="card-detail-num dark-inverted">{{ item.formattedData }}</span>

          <div>
            <V-Progress
              size="small"
              :value="nprogressSum !== 0 ? (item.data / nprogressSum) * 100 : 0"
            />

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
              <button class="filter-btn" @click="addQueryFilter(item, 'is')">
                <span>{{ t('filter.filterText') }}</span>
              </button>
              <button class="filter-btn" @click="addQueryFilter(item, 'not')">
                <span>{{ t('filter.excludeText') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isDataExist && !isLoading">
      <div class="light-text">{{ t('dashboard.noDataText') }}</div>
    </div>

    <div v-if="isLoading" class="content-shape-group">
      <div class="content-shape loads" style="--5f472bef: 60%; --0e8f8ec0: 10px"></div>
      <div class="content-shape loads" style="--5f472bef: 60%; --0e8f8ec0: 10px"></div>
      <div class="content-shape loads" style="--5f472bef: 60%; --0e8f8ec0: 10px"></div>
    </div>
  </div>
</template>

<style lang="scss">
.cards,
.country-right {
  .r-card {
    height: 100%;
  }

  .cards-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-title {
    font-weight: 500;
    margin-bottom: 8px;
  }

  .card-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    &:hover .progress {
      display: none;
    }

    &:hover .card-detail-num {
      display: none;
    }

    .card-detail-left {
      margin-right: 35px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-detail-right {
      position: relative;
      display: flex;
      align-items: center;

      .progress {
        margin-bottom: 0;
        min-width: 125px;
      }

      .card-detail-num {
        margin-right: 10px;
      }

      .filter-btn {
        margin: 0;
        display: block;
        width: 60px;
      }

      .filter-buttons {
        button {
          span {
            border: 1px solid $primary;
            border-radius: 5px;
            padding: 0 8px;
          }

          &:hover span {
            background-color: $primary;
            color: $white;
          }

          &:hover .dark-inverted {
            color: $white;
          }
        }
      }
    }
  }
}

.filter-buttons {
  display: none;
}

.card-detail:hover .filter-buttons {
  display: block;
  display: flex;
}

.loads {
  margin-bottom: 10px;
}

abbr {
  text-decoration: none;
}

.is-dark {
  .cards,
  .country-right {
    color: $white;

    .card-detail-right {
      .filter-btn {
        span {
          color: #fff !important;
        }
      }
    }
  }
}

@media only screen and (max-width: 450px) {
  .cards,
  .country-right {
    .card-detail {
      .card-detail-right {
        .progress {
          margin-bottom: 0;
          min-width: 75px;
        }
      }
    }
  }
}
</style>
