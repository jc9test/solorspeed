<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import FirewallRulesListing from './container/FirewallRulesListing.vue'
import { appliedSelectedColumn } from './data/column_selector_data'
import { pageTitle } from '/@src/state/sidebarLayoutState'

type TabId = 'active' | 'closed'
const activeTab = ref<TabId>('active')

const { t } = useI18n()

pageTitle.value = 'wafRules'
// viewWrapper.setPageTitle('Firewall Rules')
useHead({
  title: computed(() => `${t('main.wafRules')} | Solar Speed`),
})
</script>

<route lang="yaml">
meta:
  requiresAuth: true
</route>

<template>
  <!-- <AppLayout> -->
  <!-- Content Wrapper -->
  <!-- <RouterView> -->
  <div class="is-relative tabs-wrapper is-slider is-squared is-inverted is-navbar-lg">
    <div class="page-content-inner">
      <FirewallRulesListing
        class="is-navbar"
        :active-tab="activeTab"
        :applied-selected-column="appliedSelectedColumn"
      />
    </div>
  </div>
  <!-- </RouterView> -->
  <!-- </AppLayout> -->
</template>
