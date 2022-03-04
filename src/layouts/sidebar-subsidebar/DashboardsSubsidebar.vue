<script setup lang="ts">
import { ref, onUpdated, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { toggleSidebar } from '/@src/state/overviewState'

const { t } = useI18n()
const route = useRoute()
const emit = defineEmits(['close'])
const typeSubsidebar = ref('dashboard')
// type SidebarType = 'waf' | 'service' | 'cache' | 'certs' | 'event' | 'dashboard'
// const props = defineProps({
//   type: {
//     type: String as PropType<SidebarType>,
//     default: 'dashboard',
//   },
// })
// const type = ref(props.type)

const getTypeSubsidebar = () => {
  if (route.name.indexOf('waf') !== -1) {
    if (route.name.indexOf('wafRules') !== -1) {
      typeSubsidebar.value = 'lines'
    } else {
      typeSubsidebar.value = 'waf'
    }
  } else if (route.name.indexOf('cacheRules') !== -1) {
    typeSubsidebar.value = 'lines'
  } else if (route.name.indexOf('cache') !== -1) {
    typeSubsidebar.value = 'cache'
  } else if (route.name.indexOf('event') !== -1) {
    typeSubsidebar.value = 'event'
  } else if (route.name.indexOf('certs') !== -1) {
    typeSubsidebar.value = 'certs'
  } else if (route.name.indexOf('lines') !== -1) {
    typeSubsidebar.value = 'lines'
  } else if (route.name.indexOf('overview') !== -1) {
    typeSubsidebar.value = 'lines'
  } else if (route.name.indexOf('home') !== -1) {
    typeSubsidebar.value = 'home'
  }
}

const getTitle = () => {
  switch (typeSubsidebar.value) {
    // case 'lines':
    //   return 'serviceSettings'

    case 'lines':
      return 'serviceLines'
    case 'waf':
      return 'wafRules'
    case 'cache':
      return 'cache'
    case 'event':
      return 'eventLogs'
    case 'certs':
      return 'certs'
    case 'home':
      return 'dashboard'
  }
}

onUpdated(() => {
  getTypeSubsidebar()
})
onMounted(() => {
  getTypeSubsidebar()
})
</script>

<template>
  <!-- <div class="sidebar-panel is-generic">
    <div class="subpanel-header">
      <h3 class="no-mb">Dashboards</h3>
      <div
        class="panel-close"
        tabindex="0"
        @keydown.space.prevent="emit('close')"
        @click="emit('close')"
      >
        <i aria-hidden="true" class="iconify" data-icon="feather:x"></i>
      </div>
    </div>
    <div class="inner" data-simplebar>
      <ul>
        <li>
          <RouterLink :to="{ name: '' }">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Home
          </RouterLink>
        </li>
      </ul>
    </div>
  </div> -->
  <div class="sidebar-panel is-generic">
    <!-- <div class="subpanel-header"> -->
    <div class="subpanel-header-dropdown">
      <!-- Domain Dropdown -->
      <SelectDomain :located="'sidebar'" />
    </div>

    <div class="subpanel-header">
      <h3 class="no-mb">{{ t(`main.${getTitle()}`) }}</h3>
      <div class="panel-close" @click="emit('close')" @keypress="bar">
        <i aria-hidden="true" class="iconify" data-icon="feather:x"></i>
      </div>
    </div>
    <div v-if="typeSubsidebar === 'lines'" class="inner" data-simplebar>
      <ul>
        <li>
          <div class="collapse-wrap">
            <a
              class="overview-link"
              href="/service-lines"
              @click="toggleSidebar('service-list')"
            >
              <span>{{ t('service.service_line') }}</span>
            </a>
          </div>
        </li>
        <li>
          <div class="collapse-wrap">
            <div
              class="overview-link"
              @click="toggleSidebar('overview')"
              @keypress="toggleSidebar('overview')"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right"></i>
              <span>{{ t('service.overview') }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="collapse-wrap">
            <div
              class="overview-link"
              @click="toggleSidebar('origin')"
              @keypress="toggleSidebar('origin')"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right"></i>
              <span>{{ t('service.origin') }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="collapse-wrap">
            <div
              class="overview-link"
              @click="toggleSidebar('ssl')"
              @keypress="toggleSidebar('ssl')"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right"></i>
              <span>{{ t('service.ssl/tls') }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="collapse-wrap">
            <div
              class="overview-link"
              @click="toggleSidebar('firewall')"
              @keypress="toggleSidebar('firewall')"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right"></i>
              <span>{{ t('service.waf_rules') }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="collapse-wrap">
            <div
              class="overview-link"
              @click="toggleSidebar('cache')"
              @keypress="toggleSidebar('cache')"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right"></i>
              <span>{{ t('service.cache_rules') }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="collapse-wrap">
            <div
              class="overview-link"
              @click="toggleSidebar('advanced')"
              @keypress="toggleSidebar('advanced')"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right"></i>
              <span>{{ t('service.advanced_settings') }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="collapse-wrap">
            <div
              class="overview-link"
              @click="toggleSidebar('domains')"
              @keypress="toggleSidebar('domains')"
            >
              <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right"></i>
              <span> {{ t('service.domains') }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scpoed>
// @import '../../scss/layout/sidebar-panel';
.subpanel-header-dropdown {
  // margin-top: 30px;

  .domain-dropdown {
    .dropdown-trigger {
      width: 240px;
      height: 50px;
    }

    .dropdown-item {
      width: 240px;
      text-align: left;
      padding: 0.375rem 4rem;
    }
  }
}
a.overview-link {
  padding: 0 !important;
}
.overview-link {
  display: flex;
  align-items: center;
  margin-left: 1.25rem;
  color: #a2a5b9;
  .iconify {
    color: #a2a5b9;
  }
  &:hover {
    span,
    .iconify {
      color: #41b883 !important;
    }
  }
}
</style>
