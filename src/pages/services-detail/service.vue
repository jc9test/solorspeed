<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Service'
useHead({
  title: 'Service',
})
</script>

<template>
  <!-- <SidebarLayout theme="labels-hover"> -->
  <RouterView v-slot="{ Component }">
    <!-- <transition name="fade-slow" mode="out-in"> -->
    <component :is="Component" />
    <!-- </transition> -->
  </RouterView>
  <!-- </SidebarLayout> -->
</template>
