<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const chartMetricFilter = [
  {
    chartFilterKey: 'upstream_cache_status_isCached.keyword',
    chartFilterOperator: 'is',
    chartFilterValue: 'true',
    chartFilterLabel: 'upstream_cache_status_isCached.keyword-HIT',
    chartFilterEnabled: true,
  },
  {
    chartFilterKey: 'upstream_cache_status_isCached.keyword',
    chartFilterOperator: 'is',
    chartFilterValue: '*',
    chartFilterLabel: 'upstream_cache_status_isCached.keyword',
    chartFilterEnabled: true,
  },
]

const { t } = useI18n()
</script>

<template>
  <div class="tile-body">
    <span>
      <AreaChart
        chart-metric="dataUsage"
        chart-metric-group-by="filters"
        chart-metric-group-by-terms=""
        :chart-metric-group-by-filters="chartMetricFilter"
        type="num"
        chart-type="dataUsage"
        chart-id="dataUsageCard"
        numeral-format="'0.0b'"
      />
    </span>
  </div>
  <span class="light-text">{{ t('dashboard.dataUsageSummary') }}</span>
  <div class="spark-tile">
    <AreaChart
      chart-metric="dataUsage"
      chart-metric-group-by="filters"
      chart-metric-group-by-terms=""
      :chart-metric-group-by-filters="chartMetricFilter"
      chart-type="dataUsage"
      chart-id="dataUsageCard"
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

    .spark-tile {
      margin-top: 20px;
    }
  }
}
</style>
