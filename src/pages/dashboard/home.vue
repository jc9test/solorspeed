<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { pageTitle } from '/@src/state/sidebarLayoutState'
import RequestCard from '/@src/components/dashboard/RequestCard.vue'
import DataUsageCard from '/@src/components/dashboard/DataUsageCard.vue'
import FirewallCard from '/@src/components/dashboard/FirewallCard.vue'
import AccelerationCard from '/@src/components/dashboard/AccelerationCard.vue'

const { t } = useI18n()
const route = useRoute()

function activeCard(isActive: string) {
  // return isActive ? 'active' : ''
  return isActive ? 'dashboard-tile active' : 'dashboard-tile'
}

pageTitle.value = 'dashboard'
useHead({
  title: computed(() => `${t('main.dashboard')} | Solar Speed`),
})
</script>

<template>
  <!-- <LandingLayout theme="light"> -->
  <div class="home page-content-inner">
    <div class="analytics-dashboard">
      <div class="spark-tiles">
        <div class="columns is-multiline">
          <div class="column is-3">
            <RouterLink :to="{ name: 'home' }">
              <div :class="activeCard(route.name === 'home')">
                <div class="tile-head">
                  <h3 class="dark-inverted">{{ t('dashboard.overview') }}</h3>
                </div>
                <RequestCard />
              </div>
            </RouterLink>
          </div>
          <div class="column is-3">
            <RouterLink :to="{ name: 'home.data-usage' }">
              <div :class="activeCard(route.name === 'home.data-usage')">
                <div class="tile-head">
                  <h3 class="dark-inverted">{{ t('dashboard.data_usage') }}</h3>
                </div>
                <DataUsageCard />
              </div>
            </RouterLink>
          </div>
          <div class="column is-3">
            <RouterLink :to="{ name: 'home.firewall' }">
              <div :class="activeCard(route.name === 'home.firewall')">
                <div class="tile-head">
                  <h3 class="dark-inverted">{{ t('dashboard.firewall') }}</h3>
                </div>
                <FirewallCard />
              </div>
            </RouterLink>
          </div>
          <div class="column is-3">
            <RouterLink :to="{ name: 'home.acceleration' }">
              <div :class="activeCard(route.name === 'home.acceleration')">
                <div class="tile-head">
                  <h3 class="dark-inverted">{{ t('dashboard.acceleration') }}</h3>
                </div>
                <AccelerationCard />
              </div>
            </RouterLink>
          </div>
        </div>
      </div>

      <RouterView v-slot="{ Component }">
        <DashboardQueryFiltersProvider>
          <component :is="Component" />
        </DashboardQueryFiltersProvider>
      </RouterView>
    </div>
  </div>
</template>
