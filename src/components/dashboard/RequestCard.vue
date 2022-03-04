<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="tile-body">
    <span>
      <AreaChart
        chart-metric="count"
        chart-metric-group-by="none"
        chart-metric-group-by-terms=""
        type="num"
        chart-type="request"
        chart-id="requestCard"
        numeral-format="'0.0a'"
      />
    </span>
  </div>
  <span class="light-text">{{ t('dashboard.totalRequestCount') }}</span>
  <div class="spark-tile">
    <AreaChart
      chart-metric="count"
      chart-metric-group-by="none"
      chart-metric-group-by-terms=""
      chart-type="request"
      chart-id="requestCard"
      numeral-format="'0.0a'"
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
