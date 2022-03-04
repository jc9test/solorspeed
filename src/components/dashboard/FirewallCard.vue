<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const firewallFilter = [
  {
    chartFilterKey: 'tb_type.keyword',
    chartFilterOperator: 'is',
    chartFilterValue: '01',
    chartFilterEnabled: true,
    chartFilterLabel: 'tb_type.keyword:01',
  },
  {
    chartFilterKey: 'tb_action.keyword',
    chartFilterOperator: 'not',
    chartFilterValue: '00',
    chartFilterEnabled: true,
    chartFilterLabel: 'NOT tb_tb_action.keyword:00',
  },
]
</script>

<template>
  <div class="tile-body">
    <span class="dark-inverted">
      <AreaChart
        chart-metric="count"
        chart-metric-group-by="none"
        chart-metric-group-by-terms=""
        chart-type="firewall"
        type="num"
        chart-id="FirewallCard"
        :chart-query-filters="firewallFilter"
        numeral-format="'0.0a'"
      />
    </span>
  </div>
  <span class="light-text">{{ t('dashboard.firewallEvents') }}</span>
  <div class="spark-tile">
    <AreaChart
      chart-metric="count"
      chart-metric-group-by="none"
      chart-metric-group-by-terms=""
      chart-type="firewall"
      chart-id="FirewallCard"
      :chart-query-filters="firewallFilter"
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
