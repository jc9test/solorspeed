<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { getChartFilterValueOptions } from '/@src/api/formOptions'
import { default as countryList } from '/@src/data/json/countryList.json'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import store from '/@src/stores/index'
import { tagLabels } from './filterOption'
import { DashboardQueryFiltersPayload } from '/@types/dashboard'

const { locale, t, tc, tm } = useI18n()
const { y } = useWindowScroll()
const isStuck = computed(() => {
  return y.value > 30
})

const notif = useNotyf()

const { dashboardQueryFilters, updateDashboardQueryFilters } = inject(
  'dashboardQueryFilters'
) as DashboardQueryFiltersPayload

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

const STARTING_FILTER = {
  chartFilterKey: 'server_name.keyword',
  chartFilterOperator: 'is',
  chartFilterValue: '*',
}

const isFilterShow = ref(false)
const timeRangeOptions = computed(() => {
  return [
    { value: '0', label: t('filter.last_5min') },
    { value: '1', label: t('filter.last_hour') },
    { value: '2', label: t('filter.last_three_hour') },
    { value: '3', label: t('filter.last_six_hour') },
    { value: '4', label: t('filter.last_day') },
    { value: '5', label: t('filter.last_seven_day') },
    { value: '99', label: t('filter.custom') },
  ]
})

const currentTimeRange = ref(store.state.dateRangeOptions.index)
const isDatePickerShow = ref(false)
const customTimeRange = ref()
const customTimeStart = ref(store.state.dateRangeOptions.customTimeRange[0])
const customTimeEnd = ref(store.state.dateRangeOptions.customTimeRange[1])
const formattedTimeRange = ref([])

const availableStartTime = computed(() => {
  let _startDate = new Date()
  _startDate.setDate(_startDate.getDate() - 44)

  const year = _startDate.getFullYear()
  const month = _startDate.getMonth() + 1
  const day = _startDate.getDate()

  return `${year}, ${month}, ${day}`
})

const availableEndTime = computed(() => {
  let _endDate = new Date()
  _endDate.setDate(_endDate.getDate() + 1)

  const year = _endDate.getFullYear()
  const month = _endDate.getMonth() + 1
  const day = _endDate.getDate()

  return `${year}, ${month}, ${day}`
})

const filterKeySelectorOptions = ref([
  { label: 'Domain', value: 'server_name.keyword' },
  { label: 'Service', value: 'appProfileName.keyword' },
  { label: 'Resolved Group', value: 'servicegroup.keyword' },
  { label: 'Origin', value: 'originHost.keyword' },
  { label: 'Tag', value: 'tags.keyword' },
  { label: 'IP Address', value: 'cus_realy_addr.keyword' },
  { label: 'Country', value: 'country.keyword' },
  { label: 'ISP', value: 'isp.keyword' },
  { label: 'User Agent', value: 'http_user_agent.keyword' },
  { label: 'Status Code', value: 'status.keyword' },
  { label: 'Origin Status Code', value: 'upstream_status.keyword' },
  { label: 'CDN WAF Action', value: 'tb_action.keyword' },
  { label: 'CDN WAF Rule', value: 'tb_rule.keyword' },
  { label: 'Referer', value: 'req_headers.referer.keyword' },
  { label: 'Path', value: 'uri.keyword' },
  { label: 'Http Method', value: 'request_method.keyword' },
  { label: 'Content Type', value: 'req_headers.accept.keyword' },
  // { label: 'CDN WAF Type', value: 'tb_type.keyword' },
  // { label: 'CDN WAF Reason', value: 'tb_reason.keyword' },
  // { label: 'Host', value: 'req_headers.host.keyword' },
  // { label: 'Cache Status', value: 'upstream_cache_status.keyword' },
])

const filterOperatorOptions = ref([
  { value: 'is', label: 'is' },
  { value: 'not', label: 'is not' },
  { value: 'contains', label: 'exists' },
  { value: 'not contains', label: 'does not exist' },
])
const filterValueSelectorOptions = ref([])
const chartFilterData = ref(STARTING_FILTER)

const queryParams = computed(() => {
  return {
    chartFilterKey: chartFilterData.value.chartFilterKey,
    chartFilterValue: chartFilterData.value.chartFilterValue,
  }
})

const getFilterValueSelectorOptions = async (queryValue, queryParams) => {
  queryParams.chartFilterValue = '***'
  let queryString = new URLSearchParams(queryParams).toString()

  await getChartFilterValueOptions(`?${queryString}`).then((res) => {
    filterValueSelectorOptions.value = res.data.options.map((item) => {
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

function addCurrentFilter() {
  try {
    updateDashboardQueryFilters('ADD_FILTER', chartFilterData.value)
    closeFilter()
  } catch (error) {
    notif.error(error.message)
  }
}

function setTimeRange(status) {
  if (status === 'set' && currentTimeRange.value === '99') {
    if (formattedTimeRange.value !== []) {
      formatTimeRange(customTimeRange.value)
      store.commit('SET_TIME_RANGE', {
        index: currentTimeRange.value,
        customTimeRange: formattedTimeRange.value,
      })
      formattedTimeRange.value = []
    }
  } else {
    if (currentTimeRange.value === '99') {
      currentTimeRange.value = '4'
    } else {
      currentTimeRange.value = currentTimeRange.value
    }

    store.commit('SET_TIME_RANGE', {
      index: currentTimeRange.value,
      customTimeRange: [],
    })
    customTimeRange.value = ''
    customTimeStart.value = ''
    customTimeEnd.value = ''
  }
  isDatePickerShow.value = false
}

function formatTimeRange(timeRange) {
  let _timeRange = []
  let _startYear = timeRange.start.getFullYear().toString()
  let _startMonth = (timeRange.start.getMonth() + 1).toString()
  let _startDate = timeRange.start.getDate().toString()
  let _startHours = timeRange.start.getHours().toString()
  let _startMinutes = timeRange.start.getMinutes().toString()

  let _endYear = timeRange.end.getFullYear().toString()
  let _endMonth = (timeRange.end.getMonth() + 1).toString()
  let _endDate = timeRange.end.getDate().toString()
  let _endHours = timeRange.end.getHours().toString()
  let _endMinutes = timeRange.end.getMinutes().toString()

  if (_startDate.length < 2) _startDate = '0' + _startDate
  if (_endDate.length < 2) _endDate = '0' + _endDate
  if (_startHours.length < 2) _startHours = '0' + _startHours
  if (_endHours.length < 2) _endHours = '0' + _endHours
  if (_startMinutes.length < 2) _startMinutes = '0' + _startMinutes
  if (_endMinutes.length < 2) _endMinutes = '0' + _endMinutes

  customTimeStart.value = `${_startYear}-${_startMonth}-${_startDate} ${_startHours}:${_startMinutes}`
  customTimeEnd.value = `${_endYear}-${_endMonth}-${_endDate} ${_endHours}:${_endMinutes}`

  _timeRange.push(customTimeStart.value)
  _timeRange.push(customTimeEnd.value)
  formattedTimeRange.value = _timeRange
}

function showDatePicker() {
  if (currentTimeRange.value === '99' && isDatePickerShow.value === false) {
    isDatePickerShow.value = true
  }
}

function closeFilter() {
  isFilterShow.value = false
  chartFilterData.value = STARTING_FILTER
}

watch(
  chartFilterData,
  (to) => {
    getFilterValueSelectorOptions(queryParams.value.chartFilterValue, queryParams.value)
  },
  { deep: true }
)

const resetValue = () => {
  chartFilterData.value.chartFilterValue = '*'
}

watch(
  () => currentTimeRange.value,
  (to) => {
    if (currentTimeRange.value !== '99') {
      setTimeRange()
    }
  }
)

watch(
  () => store.state.dateRangeOptions.customTimeRange,
  (to) => {
    currentTimeRange.value = store.state.dateRangeOptions.index
    customTimeStart.value = store.state.dateRangeOptions.customTimeRange[0]
    customTimeEnd.value = store.state.dateRangeOptions.customTimeRange[1]
  }
)

onMounted(async () => {
  await getFilterValueSelectorOptions(
    queryParams.value.chartFilterValue,
    queryParams.value
  )
  store.commit('SET_DASHBOARD_FILTER_OPTIONS', {
    filterKeyOptions: filterKeySelectorOptions.value,
    filterOperatorOptions: filterOperatorOptions.value,
    actionOptions: actionOptions,
  })
})
</script>

<template>
  <div class="dashboard-filter-buttons">
    <div class="add-button">
      <V-Button color="primary" @click="isFilterShow = !isFilterShow">
        {{ t('dashboard.addFilter') }}
      </V-Button>

      <div v-if="isFilterShow" class="form-layout is-stacked">
        <div class="form-outer">
          <div
            :class="[isStuck && 'is-stuck']"
            class="form-header stuck-header dashboard-filter"
          >
            <div class="form-header-inner">
              <div class="left">
                <h3>{{ t('dashboard.newFilter') }}</h3>
              </div>
            </div>

            <div class="form-body">
              <div class="form-section">
                <div class="columns is-multiline">
                  <div class="column is-4">
                    <V-Field>
                      <V-Control>
                        <Multiselect
                          v-model="chartFilterData.chartFilterKey"
                          placeholder="Action"
                          mode="single"
                          :searchable="true"
                          :can-deselect="false"
                          :can-clear="false"
                          :options="filterKeySelectorOptions"
                          @select="resetValue"
                        />
                      </V-Control>
                    </V-Field>
                  </div>

                  <div class="column is-4">
                    <V-Field>
                      <V-Control>
                        <Multiselect
                          v-model="chartFilterData.chartFilterOperator"
                          placeholder="Equals"
                          mode="single"
                          :can-deselect="false"
                          :can-clear="false"
                          :options="filterOperatorOptions"
                        />
                      </V-Control>
                    </V-Field>
                  </div>

                  <div class="column is-4">
                    <V-Field>
                      <V-Control>
                        <Multiselect
                          v-model="chartFilterData.chartFilterValue"
                          placeholder="Allow"
                          mode="single"
                          :searchable="true"
                          :can-deselect="false"
                          :can-clear="false"
                          :options="filterValueSelectorOptions"
                        />
                      </V-Control>
                    </V-Field>
                  </div>
                </div>

                <V-Field grouped multiline>
                  <V-Control v-for="filter in dashboardQueryFilters" :key="filter">
                    <V-Tags addons>
                      <V-Tag :label="filter.chartFilterLabel" color="primary" />
                      <V-Tag
                        remove
                        @click="updateDashboardQueryFilters('REMOVE_FILTER', filter)"
                      />
                    </V-Tags>
                  </V-Control>
                </V-Field>

                <div class="filter-search">
                  <V-Button @click="closeFilter">
                    {{ t('main.cancelText') }}
                  </V-Button>

                  <V-Button color="primary" raised @click="addCurrentFilter">
                    {{ t('filter.searchText') }}
                  </V-Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="column time-range-is-3">
      <Multiselect
        v-model="currentTimeRange"
        placeholder="Time Range"
        :can-deselect="false"
        :can-clear="false"
        :options="timeRangeOptions"
      />
    </div>

    <div
      v-if="currentTimeRange === '99'"
      tabindex="0"
      class="show-time"
      @click="isDatePickerShow = !isDatePickerShow"
      @keypress="bar"
    >
      {{
        customTimeStart && customTimeEnd
          ? `${customTimeStart.slice(0, 20)} — ${customTimeEnd.slice(0, 20)}`
          : t('filter.select_date')
      }}
    </div>
  </div>

  <!-- locale need to change accroding to user pref -->
  <div v-if="isDatePickerShow === true" class="date-picker">
    <v-date-picker
      v-model="customTimeRange"
      is-range
      mode="dateTime"
      locale="en"
      :available-dates="{
        start: new Date(availableStartTime),
        end: new Date(availableEndTime),
      }"
    />
    <div class="timerange-button">
      <button @click="setTimeRange('set')">
        <span>{{ t('main.goText') }}</span>
      </button>
      <button @click="setTimeRange('clear')">
        <span>{{ t('main.clearText') }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags {
  .is-primary {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.dashboard-filter-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .add-button {
    flex-grow: 1;
  }

  .button {
    margin-left: 0;
  }

  .filter-search {
    display: flex;
    justify-content: flex-end;

    .button {
      margin-left: 0.5em;
    }

    .button {
      &:first-child {
        border-color: #dbdbdb;
      }
    }
  }
}

.home {
  .button {
    margin-left: 0;
  }
}

h3 {
  font-family: $font-alt;
  color: $dark-text;
  font-weight: 600;
  font-size: 1.17rem;
  margin-bottom: 10px;
}

body.is-dark {
  .multiselect {
    background: #323236;
  }

  .show-time {
    background: #323236;
    color: $light-text;
  }

  .timerange-button {
    background: $dark-sidebar;
    span {
      color: $dark-sidebar !important;
    }

    button {
      &:hover {
        span {
          color: #fff !important;
        }
      }
    }
  }
}

.home {
  .is-stacked {
    position: absolute;
    width: 100%;
    z-index: 20;
    margin-top: 20px;

    .form-outer {
      border: none;

      .form-body {
        .form-section {
          padding: 20px;
          border-bottom: none;

          .buttons {
            justify-content: flex-end;
          }
        }
      }
    }
  }
}

.time-range-is-3 {
  width: 15%;
  padding: 0;
  flex: none;
}

.date-picker {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 3%;
  z-index: 99;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  background: white;
}

.vc-container {
  border: none;
}

.show-time {
  margin-left: 20px;
  background-color: $white;
  padding: 8px 10px;
  border-radius: 5px;
  border: 1px solid #d1d5db;
  font-size: 0.8rem;
  cursor: pointer;
}

.timerange-button {
  display: flex;
  justify-content: center;
  margin-top: -10px;
  padding: 27px 0 22px 0;
  border-top: 1px solid #cbd5e0;
  border-radius: 7px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #edf2f7;
    border-radius: 5px;
    border: 1px solid color;
    height: 33px;
    width: 70px;
    margin: 0 16px;

    &:hover {
      color: white;
      background: #2b6cb0;
    }

    span {
      font-weight: 500;
      text-align: center;
    }
  }
}

@media only screen and (max-width: 1000px) {
  .time-range-is-3 {
    width: 30%;
    flex: none;
  }
}

@media only screen and (max-width: 600px) {
  .dashboard-filter-buttons {
    flex-direction: column;
    align-items: flex-start;

    .button {
      margin-bottom: 10px;
    }

    .show-time {
      margin: 0;
      margin-top: 10px;
    }
  }

  .time-range-is-3 {
    width: 35%;
    flex: none;
  }
}

@media screen and (max-width: 390px) {
  .time-range-is-3 {
    width: 45%;
    flex: none;
  }
}

// @media only screen and (min-width: 767px) {
//   .time-range-is-3 {
//     width: 25%;
//     // flex: none;
//   }
// }
</style>
