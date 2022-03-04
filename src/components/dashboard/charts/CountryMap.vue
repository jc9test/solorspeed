<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, onMounted, onUpdated, computed, watch } from 'vue'
import { getEdgeChartDataV2 } from '/@src/api/monitor'
import { themeColors } from '/@src/utils/themeColors'
import { default as countryList } from '/@src/data/json/countryList.json'
import store from '/@src/stores/index'

import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow'
import am4geodata_lang_EN from '@amcharts/amcharts4-geodata/lang/EN'
import { country } from '../home'

const props = defineProps({
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

let countries = []
for (let i in countryList) {
  countries.push(i)
}

// let countryValue = ref(
//   countries.map((item) => {
//     return {
//       id: item,
//       value: 0,
//     }
//   })
// )

function getMap(countryValue) {
  let map = am4core.create('chartdiv', am4maps.MapChart)
  map.geodata = am4geodata_worldLow
  map.geodataNames = am4geodata_lang_EN

  map.projection = new am4maps.projections.Miller()

  let polygonSeries = map.series.push(new am4maps.MapPolygonSeries())
  polygonSeries.exclude = ['AQ']
  polygonSeries.useGeodata = true

  var polygonTemplate = polygonSeries.mapPolygons.template
  polygonTemplate.tooltipText = '{name}: {value}'
  polygonTemplate.fill = am4core.color('#D9E5F1')

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create('hover')
  hs.properties.fill = am4core.color('#4185B4')

  polygonSeries.heatRules.push({
    property: 'fill',
    target: polygonSeries.mapPolygons.template,
    min: am4core.color('#D9E5F1'),
    max: am4core.color('#48759F'),
  })

  //Disable zoom and pan
  // map.maxZoomLevel = 1
  // map.seriesContainer.draggable = false
  // map.seriesContainer.resizable = false

  // Add expectancy data
  // polygonSeries.data = dataCollection.value
  // polygonSeries.data = countryValue.value
  polygonSeries.data = countryValue
}

let isDataExist = ref(false)
let nginxData = ref()
let dataCollection = ref()

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

    let countryValue = ref(
      countries.map((item) => {
        return {
          id: item,
          value: 0,
        }
      })
    )

    if (nginxData.value.datasets.length !== 0) {
      dataCollection.value = nginxData.value.datasets.map((item) => {
        let sum = item.data.reduce((prev, next) => prev + next, 0)
        return {
          id: item.label,
          value: sum,
        }
      })

      dataCollection.value.forEach((element) => {
        countryValue.value.unshift(element)
      })

      isDataExist.value = true
      isDataExist.value = true
    } else {
      isDataExist.value = false
    }

    getMap(countryValue.value)
  })
}

watch(
  () => dateRange.value,
  (to) => {
    getNginxData()
  }
)

watch(
  () => props.dashboardQueryFilters,
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
  <div id="chartdiv"></div>
  <div class="overlay"></div>
</template>

<style lang="scss" scoped>
#chartdiv {
  width: 100%;
  height: 400px;
}

.overlay {
  position: absolute;
  width: 100px;
  height: 45px;
  top: 90%;
  background-color: white;
}

.is-dark {
  .overlay {
    background-color: #323236;
  }
}
</style>
