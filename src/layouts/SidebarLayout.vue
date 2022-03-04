<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted, onUnmounted, watchPostEffect, watch, onUpdated } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
// import { activePanel } from '/@src/state/activePanelState'
import { pageTitle } from '/@src/state/sidebarLayoutState'

import SelectDomain from '/@src/components/SelectDomain.vue'
import { currentDomain } from '/@src/state/domainState'
// import { tryOnMounted } from '@vueuse/shared'
// import { initUserSession } from '../composable/useUserSession'

// import store from '/@src/stores/index'

type SidebarTheme =
  | 'default'
  | 'color'
  | 'color-curved'
  | 'curved'
  | 'float'
  | 'labels'
  | 'labels-hover'

const { t } = useI18n()
const props = defineProps({
  theme: {
    type: String as PropType<SidebarTheme>,
    default: 'default',
  },
  defaultSidebar: {
    type: String,
    default: 'dashboard',
  },
  closeOnChange: {
    type: Boolean,
    default: false,
  },
  openOnMounted: {
    type: Boolean,
    default: false,
  },
  nowrap: {
    type: Boolean,
    default: false,
  },
})
const title = ref('dashboard')
const initialOpenSidebar = ref(false)
const route = useRoute()
// const router = useRouter()
const isMobileSidebarOpen = ref(false)
const isDesktopSidebarOpen = ref(props.openOnMounted)
const activeMobileSubsidebar = ref(props.defaultSidebar)
const currentPath = ref(route.name)
const windowWidth = ref(import.meta.server ? 0 : window.innerWidth)

const typeSubsidebar = ref('dashboard')

const switchSidebar = (open: Boolean, path: String) => {
  if (open !== null) {
    if (route.name.indexOf('service') !== -1) {
      isDesktopSidebarOpen.value = open
    } else if (route.name.indexOf('home') !== -1) {
      isDesktopSidebarOpen.value = open
    }
  }

  currentPath.value = path
  // let navList = document.querySelectorAll('.icon-menu li a')
  // console.log('nav list ', navList)

  // navList.forEach((val, index) => {
  //   if (val.classList.contains(path)) {
  //     console.log('val match', val)
  //     val.classList.add('activated')
  //   }
  // })

  // if (open ==) {
  //   isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value
  // } else {
  //   isDesktopSidebarOpen.value = false
  //   activeMobileSubsidebar.value = id
  // }
}

const getTypeSubsidebar = () => {
  if (route.name.indexOf('service.') !== -1) {
    if (initialOpenSidebar.value == false) {
      isDesktopSidebarOpen.value = true
      initialOpenSidebar.value = true
      if (windowWidth.value < 767) {
        // isMobileSidebarOpen.value = true
      }
    }
  } else if (route.name.indexOf('home') !== -1) {
    if (initialOpenSidebar.value == false) {
      if (initialOpenSidebar.value == false) {
        isDesktopSidebarOpen.value = false
        initialOpenSidebar.value = true
      }
    }
  } else {
    initialOpenSidebar.value = false
    isDesktopSidebarOpen.value = false
  }
}
function onResize() {
  windowWidth.value = import.meta.server ? 0 : window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  title.value = pageTitle.value
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
onUpdated(() => {
  getTypeSubsidebar()
  title.value = pageTitle.value
})

/**
 * watchPostEffect callback will be executed each time dependent reactive values has changed
 */
watchPostEffect(() => {
  var isOpen = isDesktopSidebarOpen.value
  const wrappers = document.querySelectorAll('.view-wrapper')
  wrappers.forEach((wrapper) => {
    if (windowWidth.value < 1024) {
      isOpen = false
      if (wrapper.classList.contains('is-pushed-full')) {
        wrapper.classList.remove('is-pushed-full')
      }
    } else {
      if (isOpen === true) {
        wrapper.classList.add('is-pushed-full')
      }
    }
    if (isOpen === false) {
      wrapper.classList.remove('is-pushed-full')
    } else if (!wrapper.classList.contains('is-pushed-full')) {
      if (windowWidth.value > 1024) {
        wrapper.classList.add('is-pushed-full')
      } else {
        wrapper.classList.remove('is-pushed-full')
      }
    }
  })
})

watch(
  () => currentDomain.value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (to, from) => {
    // store.commit('SET_QUERY_GROUPNAME', currentDomain.value)
    // console.log({ 'watch - groupName': currentDomain.value })
    // router.push(`"/${router.currentRoute.value.path}?groupName=${currentDomain.value}"`)
    // router.push({ query: { groupName: currentDomain.value } })
  }
)
watch(
  () => windowWidth,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (newWidth, oldWidth) => {
    const wrappers = document.querySelectorAll('.view-wrapper')
    if (newWidth < 866) {
      wrappers.forEach((wrapper) => {
        if (wrapper.classList.contains('is-pushed-full')) {
          wrapper.classList.remove('is-pushed-full')
        }
      })
    } else {
      if (route.name.indexOf('service.') === -1) {
        isDesktopSidebarOpen.value = false
      }
    }
  },
  { immediate: true }
)
watch(
  () => route.fullPath,
  () => {
    isMobileSidebarOpen.value = false

    if (props.closeOnChange && isDesktopSidebarOpen.value) {
      isDesktopSidebarOpen.value = false
    }
  }
)
// console.log({ queryGroupName: store.state.queryGroupName })
</script>

<template>
  <div class="sidebar-layout">
    <div class="app-overlay"></div>

    <MobileNavbar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #brand>
        <!-- <RouterLink :to="{ name: 'home' }">
          <img src="/images/auth/logo-solarspeed.svg" alt="logo" class="logo" />
        </RouterLink> -->

        <!-- <RouterLink :to="{ name: 'home' }" class="navbar-item is-brand">
          <img src="/images/auth/logo-solarspeed.svg" alt="" style="margin-left: 2rem" />
        </RouterLink> -->

        <div class="brand-flex-center">
          <SelectDomain :located="'header'" />

          <div class="brand-end">
            <!-- <NotificationsMobileDropdown /> -->
            <UserProfileDropdown />
          </div>
        </div>
      </template>
    </MobileNavbar>

    <!-- Mobile sidebar links -->
    <MobileSidebar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #links>
        <li>
          <RouterLink
            :to="{ name: 'home' }"
            :class="{ activated: currentPath.includes('home') }"
            class="dashboard"
            @click="switchSidebar(null, 'home')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:activity"
            ></i>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'lines' }"
            data-content="Dashboards"
            :class="{ activated: currentPath.includes('service') }"
            class="lines"
            @click="switchSidebar('dashboard', 'lines')"
          >
            <!-- :class="{ activated: currentPath === 'lines' }" -->
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:server"
            ></i>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'origin_policy' }"
            :class="{ activated: currentPath === 'origin_policy' }"
            class="origin_policy"
            @click="switchSidebar(null, 'origin_policy')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="clarity:cloud-traffic-line"
            ></i>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'firewall_rules' }"
            :class="{ activated: currentPath === 'firewall_rules' }"
            class="firewall_rules"
            @click="switchSidebar(null, 'firewall_rules')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="icon-park-outline:shield"
            ></i>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'html' }"
            :class="{ activated: currentPath === 'html' }"
            class="html"
            @click="switchSidebar(null, 'html')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="bx:bxs-file-html"
            ></i>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'certs' }"
            :class="{ activated: currentPath === 'certs' }"
            class="certs"
            @click="switchSidebar(null, 'certs')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="teenyicons:certificate-outline"
            ></i>
          </RouterLink>
        </li>
        <!-- <li>
          <RouterLink :to="{ name: 'cache' }">
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="ic:baseline-cached"
            ></i>
          </RouterLink>
        </li> -->
        <li>
          <RouterLink
            :to="{ name: 'event-logs' }"
            :class="{ activated: currentPath === 'event-logs' }"
            class="event-logs"
            @click="switchSidebar(null, 'event-logs')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="fluent:text-bullet-list-ltr-16-filled"
            ></i>
          </RouterLink>
        </li>
      </template>
    </MobileSidebar>

    <!-- Mobile subsidebar links -->

    <transition name="slide-x">
      <DashboardsMobileSubsidebar
        v-if="isMobileSidebarOpen && route.name.indexOf('service.') !== -1"
        :type="typeSubsidebar.value"
      />
    </transition>

    <transition name="slide-x">
      <DashboardsMobileSubsidebar
        v-if="isMobileSidebarOpen && route.name.indexOf('home') !== -1"
        :type="typeSubsidebar.value"
      />
    </transition>

    <!-- Desktop navigation -->
    <!-- <CircularMenu /> -->

    <Sidebar :theme="props.theme" :is-open="isDesktopSidebarOpen">
      <template #links>
        <li v-tooltip.rightOnly="`${t('main.dashboard')}`" class="hint--right">
          <RouterLink
            :to="{ name: 'home' }"
            :class="{ activated: currentPath.includes('home') }"
            class="dashboard"
            @click="switchSidebar(false, 'home')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:activity"
            ></i>
          </RouterLink>
        </li>
        <li v-tooltip.rightOnly="`${t('main.serviceLines')}`" class="hint--right">
          <RouterLink
            :to="{ name: 'lines' }"
            data-content="Dashboards"
            :class="{ activated: currentPath === 'lines' }"
            class="lines"
            @click="switchSidebar(false, 'lines')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:server"
            ></i>
          </RouterLink>
        </li>
        <li v-tooltip.rightOnly="`${t('main.originPolicy')}`" class="hint--right">
          <RouterLink
            :to="{ name: 'origin_policy' }"
            :class="{ activated: currentPath === 'origin_policy' }"
            @click="switchSidebar(null, 'origin_policy')"
          >
            <!-- <img src="/icons/thick-cloud-2.svg" alt="" style="width: 30px" /> -->
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="bi:cloud-haze2"
              style="font-weight: 700"
            ></i>
            <!-- <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="clarity:cloud-traffic-fill"
              style="font-weight: 700"
            ></i> -->
          </RouterLink>
        </li>
        <li v-tooltip.rightOnly="`${t('main.wafRules')}`" class="hint--right">
          <RouterLink
            :to="{ name: 'firewall_rules' }"
            :class="{ activated: currentPath === 'firewall_rules' }"
            class="firewall_rules"
            @click="switchSidebar(null, 'firewall_rules')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="icon-park-outline:shield"
            ></i>
          </RouterLink>
        </li>
        <li v-tooltip.rightOnly="`${t('main.htmlPages')}`" class="hint--right">
          <RouterLink
            :to="{ name: 'html' }"
            :class="{ activated: currentPath === 'html' }"
            class="html"
            @click="switchSidebar(null, 'html')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="bx:bxs-file-html"
            ></i>
          </RouterLink>
        </li>
        <li v-tooltip.rightOnly="`${t('main.certs')}`" class="hint--right">
          <RouterLink
            :to="{ name: 'certs' }"
            :class="{ activated: currentPath === 'certs' }"
            class="certs"
            @click="switchSidebar(false, 'certs')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="teenyicons:certificate-outline"
            ></i>
          </RouterLink>
        </li>
        <li v-tooltip.rightOnly="`${t('main.eventLogs')}`" class="hint--right">
          <RouterLink
            :to="{ name: 'event-logs' }"
            :class="{ activated: currentPath === 'event-logs' }"
            class="event-logs"
            @click="switchSidebar(false, 'event-logs')"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="fluent:text-bullet-list-ltr-16-filled"
            ></i>
          </RouterLink>
        </li>
      </template>

      <template #bottom-links>
        <!-- Settings -->
        <!-- <li>
          <RouterLink
            id="open-settings"
            :to="{ name: 'settings' }"
            data-content="Settings"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:settings"
            ></i>
          </RouterLink>
        </li> -->

        <!-- Profile Dropdown -->
        <li>
          <UserProfileDropdown up />
        </li>
      </template>
    </Sidebar>

    <transition name="slide-x">
      <DashboardsSubsidebar
        v-if="isDesktopSidebarOpen && activeMobileSubsidebar === 'dashboard'"
        :type="typeSubsidebar.value"
        @close="isDesktopSidebarOpen = false"
      />
    </transition>

    <transition name="slide-x">
      <DashboardsSubsidebar
        v-if="isDesktopSidebarOpen && activeMobileSubsidebar === 'home'"
        :type="typeSubsidebar.value"
        @close="isDesktopSidebarOpen = false"
      />
    </transition>

    <LanguagesPanel />
    <!-- <ActivityPanel /> -->
    <!-- <SearchPanel /> -->
    <!-- <TaskPanel /> -->

    <div class="view-wrapper">
      <div class="page-content-wrapper">
        <template v-if="props.nowrap">
          <slot></slot>
        </template>
        <div v-else class="page-content is-relative">
          <div class="page-title has-text-centered">
            <!-- Sidebar Trigger -->
            <div
              v-if="route.name.indexOf('service.') !== -1"
              class="solarspeed-hamburger nav-trigger push-resize"
              @click="isDesktopSidebarOpen = !isDesktopSidebarOpen"
              @keypress="bar"
            >
              <span class="menu-toggle has-chevron">
                <span :class="[isDesktopSidebarOpen && 'active']" class="icon-box-toggle">
                  <span class="rotate">
                    <i aria-hidden="true" class="icon-line-top"></i>
                    <i aria-hidden="true" class="icon-line-center"></i>
                    <i aria-hidden="true" class="icon-line-bottom"></i>
                  </span>
                </span>
              </span>
            </div>

            <div
              v-if="route.name.indexOf('service.') !== -1"
              class="title-wrap"
              :style="route.name.indexOf('service.') ? 'margin-left: 0;' : ''"
            >
              <h1 class="title is-4">
                {{ t(`service.${title}`) }}
              </h1>
            </div>

            <div v-else class="title-wrap" :style="'margin-left: 0;'">
              <h1 class="title is-4">
                {{ t(`main.${title}`) }}
              </h1>
            </div>

            <!-- Domain Dropdown -->
            <div class="h-hidden-mobile h-hidden-tablet-p">
              <SelectDomain :located="'header'" />
            </div>

            <Toolbar class="desktop-toolbar">
              <!-- <ToolbarNotification /> -->

              <!-- <a
                class="toolbar-link right-panel-trigger"
                @click="activePanel = 'activity'"
              >
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:grid"
                ></i>
              </a> -->
            </Toolbar>
          </div>

          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@media only screen and (max-width: 767px) {
  .domain-dropdown {
    display: none;
  }
  .mobile-domain-dropdown {
    display: block;
    padding-bottom: 1rem;
  }
}
@media only screen and (min-width: 768px) {
  .domain-dropdown {
    display: block;
  }
  .mobile-domain-dropdown {
    display: none;
  }
}
a {
  &.dashboard,
  &.lines,
  &.html,
  &.certs,
  &.firewall_rules,
  &.waf,
  &.event-logs {
    padding: 15px 20px;
  }
}

.hint--right::after {
  min-width: unset;
  width: max-content;
}
</style>
