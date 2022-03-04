<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, onMounted, onUpdated } from 'vue'
import { getEdgeChartData } from '/@src/api/monitor'
import { themeColors } from '/@src/utils/themeColors'

const props = defineProps({
  kind: {
    type: String,
    default: 'domainBarChartByCacheStatus',
  },
  barTitle: {
    type: String,
    default: 'Cached',
  },
  barTitleTwo: {
    type: String,
    default: 'Uncached',
  },
})

let nginxData = ref()
let dataCollection = ref()
let isDataExist = ref()
let barStatus = ref()
let cachedPercentage = ref(0)
let uncachedPercentage = ref(0)

const testCollection = ref({
  datasets: [
    {
      data: [100, 3000, 5000],
      label: 'cached',
    },
    {
      data: [82339, 6500, 7500],
      label: 'uncached',
    },
  ],
  labels: ['ss.aicloud8.com', 'hello.com', 'lalala.com'],
})

const cacheOptions = ref({
  series: [
    {
      name: 'Cached',
      data: [44, 55, 41, 67, 22, 43],
    },
    {
      name: 'Uncached',
      data: [13, 23, 20, 8, 13, 27],
    },
  ],
  chart: {
    type: 'bar',
    height: 320,
    // stacked: false,
    stacked: true,
    toolbar: {
      show: false,
      // show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  colors: [
    themeColors.info,
    themeColors.purple,
    themeColors.accent,
    themeColors.green,
    themeColors.orange,
  ],
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'top',
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      // horizontal: true,
      horizontal: false,
    },
  },
  xaxis: {
    categories: ['domain1', 'domain2', 'domain3', 'domain4', 'domain5', 'domain6'],
  },
  title: {
    text: '',
    align: 'left',
  },
  legend: {
    // position: 'top',
    horizontalAlign: 'center',
  },
  fill: {
    opacity: 1,
  },
})

function UpdateChart(newCached, newUncached, newDomain) {
  cacheOptions.value = {
    series: [
      {
        name: 'Cached',
        // data: [100, 3000, 5000],
        data: newCached,
      },
      {
        name: 'Uncached',
        // data: [82339, 6500, 7500],
        data: newUncached,
      },
    ],
    chart: {
      type: 'bar',
      height: 320,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    colors: [
      themeColors.info,
      themeColors.purple,
      themeColors.accent,
      themeColors.green,
      themeColors.orange,
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'top',
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: newDomain,
    },
    title: {
      text: '',
      align: 'left',
    },
    legend: {
      horizontalAlign: 'center',
    },
    fill: {
      opacity: 1,
    },
  }
}

function getNginxData() {
  var chartOptions = {
    chartType: props.kind, // this.chartType,
    groupNames: [], //this.queryFilter.groupNames,
    tags: [], //this.queryFilter.tags,
    serviceGroupNames: [], //this.queryFilter.serviceGroupNames,
    domains: [], //this.queryFilter.domains,
    appProfileNames: [], //this.queryFilter.appProfileNames,
    origins: [], //this.queryFilter.origins,
    originHosts: [], //his.queryFilter.originHosts,
    originPorts: [], //this.queryFilter.originPorts,
    slbNames: [], //this.queryFilter.slbNames,
    edgeNames: [], //this.queryFilter.edgeNames,
    latencyStatusNames: [], //this.queryFilter.latencyStatusNames,
    dateRangeOptions: {
      index: '1', //this.queryFilter.dateRangeOptions.index,
      customTimeRange: [], //this.queryFilter.dateRangeOptions.customTimeRange
    },
    apiEndpoint: '', //this.apiEndpoint
  }

  return getEdgeChartData(chartOptions).then((res) => {
    if (res.data.datasets[0].label) {
      // nginxData.value = res.data
      nginxData.value = testCollection.value //sample data

      //overview
      dataCollection.value = nginxData.value.labels.map((label, i) => {
        return {
          title: label,
          value: nginxData.value.datasets[0].data[i],
        }
      })

      //bar

      let totalCached = ref(0)
      let totalUncached = ref(0)

      for (let i in nginxData.value.datasets[0].data) {
        totalCached.value += nginxData.value.datasets[0].data[i]
      }

      for (let i in nginxData.value.datasets[1].data) {
        totalUncached.value += nginxData.value.datasets[1].data[i]
      }

      cachedPercentage.value = (
        (totalCached.value / (totalCached.value + totalUncached.value)) *
        100
      ).toFixed(2)

      uncachedPercentage.value = 100 - cachedPercentage.value

      // bar chart
      let newDomain = nginxData.value.labels
      let newCached = nginxData.value.datasets[0].data
      let newUncached = nginxData.value.datasets[1].data

      UpdateChart(newCached, newUncached, newDomain)
    } else {
      isDataExist = false
    }
  })
}

onMounted(() => {
  getNginxData()
})
</script>

<template>
  <!-- overview -->

  <div class="cache-status-header">
    <div v-for="(item, index) in dataCollection" :key="index" class="header-item">
      <div class="item-inner">
        <div class="title-with-dot">
          <div class="dot"></div>
          <p>{{ item.title }}</p>
        </div>
        <div class="overview-header-detail">
          <span class="dark-inverted overview-header-detail-header">
            {{ item.value }}
          </span>
          <div class="overview-header-hover-button">
            <button><span class="dark-inverted">Filter</span></button>
            <button>
              <span class="dark-inverted">Exclude</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- bar -->

  <div class="bars">
    <div class="bar" style="background-color: #41b883">
      <span>{{ props.barTitle }}</span>
      <span>{{ cachedPercentage }}%</span>
    </div>

    <div class="bar" style="background-color: #93e088">
      <span>{{ props.barTitleTwo }}</span>
      <span>{{ uncachedPercentage }}%</span>
    </div>
  </div>

  <!-- bar chart -->

  <apexchart
    id="cache-status-acceleration"
    :height="cacheOptions.chart.height"
    :type="cacheOptions.chart.type"
    :series="cacheOptions.series"
    :options="cacheOptions"
  >
  </apexchart>
</template>

<style lang="scss" scoped>
// overview

.cache-status-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 30px;

  .header-item {
    width: 10%;

    &:first-child {
      &::after {
        content: '';
        display: none;
      }
    }

    &::after {
      content: '';
      margin-top: -100px;
      margin-left: -21px;
      padding-left: 15px;
      border-left: 1px solid #c0c4cc;
      height: 50px;
      display: inline-block;
      vertical-align: middle;
    }

    &:hover button {
      display: block;
    }

    &:hover .overview-header-detail-header {
      display: none;
    }

    button {
      margin: 10px 0 20px 0;
      display: none;
    }

    .item-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 60px;

      .title-with-dot {
        display: flex;
        align-items: center;

        .dot {
          height: 10px;
          width: 10px;
          min-width: 10px;
          border-radius: $radius-rounded;
          background: $primary;
          margin: 0 5px 0 0;
        }
      }

      span {
        font-weight: bold;
        font-size: 1.5rem;

        &:last-child {
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

      .overview-header-detail {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
      }

      .overview-header-hover-button {
        position: absolute;
        display: flex;
      }

      .cache-status-header-detail {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .cache-status-detail-header {
          font-weight: bold;
          font-size: 1.5rem;
        }
      }
    }
  }
}

// bar

.bars {
  display: flex;
  margin: 0 30px;

  .bar {
    display: flex;
    flex-direction: column;
    height: 45px;
    flex-basis: 20%;
    text-align: center;

    span {
      color: $white;
    }

    &:first-child {
      flex-basis: 8%;
    }

    &:last-child {
      flex-basis: 92%;
    }
  }
}

@media only screen and (max-width: 1000px) {
  .cache-status-header {
    flex-direction: column;

    .header-item {
      width: 100%;
    }
  }

  .header-item {
    margin: 5px 0;
    border-bottom: 1px solid $lighter-grey;
    span {
      margin-bottom: 5px;
    }
  }
  .flex-list-inner {
    .r-card {
      .table-card-item {
        span {
          &:first-child {
            min-width: 35%;
          }
        }
      }
    }
  }
}
</style>
