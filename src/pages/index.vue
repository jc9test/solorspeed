<script setup lang="ts">
import { useHead } from '@vueuse/head'
import SidebarLayout from '/@src/layouts/SidebarLayout.vue'
useHead({
  title: 'Home',
})
</script>

<template>
  <SidebarLayout theme="labels-hover">
    <div class="page-content-inner">
      <RouterView v-slot="{ Component }" :key="currentDomain">
        <!-- <transition name="fade-slow" mode="out-in"> -->
        <component :is="Component" />
        <!-- </transition> -->
      </RouterView>
    </div>
  </SidebarLayout>
</template>
