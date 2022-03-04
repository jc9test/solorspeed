<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import OriginPolicyListing from './container/OriginPolicyListing.vue'
import { appliedSelectedColumn } from './data/column_selector_data'
// import { useViewWrapper } from '/@src/stores/viewWrapper'
import { pageTitle } from '/@src/state/sidebarLayoutState'

type TabId = 'active' | 'closed'
const activeTab = ref<TabId>('active')

const { t } = useI18n()

pageTitle.value = 'originPolicy'
useHead({
  title: computed(() => `${t('main.originPolicy')} | Solar Speed`),
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
      <OriginPolicyListing
        class="is-navbar"
        :active-tab="activeTab"
        :applied-selected-column="appliedSelectedColumn"
      />
    </div>
  </div>
  <!-- </RouterView> -->
  <!-- </AppLayout> -->
</template>
