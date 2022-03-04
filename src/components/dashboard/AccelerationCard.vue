<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const cachedFilter = [
  {
    chartFilterKey: 'upstream_cache_status_isCached.keyword',
    chartFilterOperator: 'is',
    chartFilterValue: 'false',
    chartFilterLabel: 'Origin',
    chartFilterEnabled: true,
  },
  {
    chartFilterKey: 'upstream_cache_status_isCached.keyword',
    chartFilterOperator: 'is',
    chartFilterValue: 'true',
    chartFilterLabel: 'SolarSpeed',
    chartFilterEnabled: true,
  },
]
</script>

<template>
  <div class="tile-body">
    <span class="dark-inverted">
      <PieChart
        chart-metric="dataUsage"
        chart-metric-group-by="filters"
        chart-metric-group-by-terms=""
        :chart-metric-group-by-filters="cachedFilter"
        type="num"
        numeral-format="'0.0b'"
      />
    </span>
  </div>
  <span class="light-text">{{ t('dashboard.cachedPerformance') }}</span>
  <div class="spark-tile">
    <PieChart
      chart-metric="dataUsage"
      chart-metric-group-by="filters"
      chart-metric-group-by-terms=""
      :chart-metric-group-by-filters="cachedFilter"
      type="chart"
      numeral-format="'0.0b'"
    />
  </div>
</template>

<style lang="scss" scoped>
.home {
  .analytics-dashboard {
    .tile-body {
      padding: 0 30px;

      span {
        font-size: 1.8rem;
      }
    }
    .light-text {
      padding: 0 30px;
      display: inherit;
    }
  }
}
</style>
