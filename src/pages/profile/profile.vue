<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'
import { useI18n } from 'vue-i18n'

import EditProfile from './container/EditProfile.vue'

const { t } = useI18n()
pageTitle.value = 'profile'
useHead({
  title: computed(() => `${t('main.profile')} | Solar Speed`),
})
</script>

<route lang="yaml">
meta:
  requiresAuth: true
</route>

<template>
  <!-- <SidebarLayout theme="labels-hover"> -->
  <div class="page-content-inner">
    <EditProfile />
  </div>
  <!-- </SidebarLayout> -->
</template>
