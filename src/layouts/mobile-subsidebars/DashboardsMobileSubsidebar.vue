<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onUpdated, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
// import { currentDomain, domainList, refDomainList } from '/@src/state/domainState'

const { t } = useI18n()
const route = useRoute()
const typeSubsidebar = ref('dashboard')
// const domainDropdown = ref()
// const props = defineProps({
//   type: {
//     type: String as PropType<SidebarType>,
//     default: 'dashboard',
//   },
// })

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
  } else if (route.name.indexOf('service.') !== -1) {
    typeSubsidebar.value = 'lines'
  } else if (route.name.indexOf('home') !== -1) {
    typeSubsidebar.value = 'home'
  }
}
// function changeDomain(index: Number) {
//   currentDomain.value = domainList[index]
//   if (domainDropdown.value) {
//     domainDropdown.value.close?.()
//   }
// }
onUpdated(() => {
  getTypeSubsidebar()
})
onMounted(() => {
  getTypeSubsidebar()
})
</script>

<template>
  <div class="mobile-subsidebar">
    <div class="inner">
      <!-- <V-Dropdown
        ref="domainDropdown"
        modern
        :title="currentDomain"
        style="padding-left: 1rem; padding-top: 1rem"
        class="domain-dropdown"
      >
        <template #content>
          <div v-for="(domain, index) in refDomainList" :key="domain + index">
            <a
              class="dropdown-item"
              @click="changeDomain(index)"
              @keypress="changeDomain(index)"
              >{{ domain }}</a
            >
            <hr v-if="index !== refDomainList.length - 1" class="dropdown-divider" />
          </div>
        </template>
      </V-Dropdown> -->
      <div v-if="typeSubsidebar === 'lines'">
        <div class="sidebar-title">
          <h3>{{ t('service.service_setting') }}</h3>
        </div>

        <ul class="submenu" data-simplebar>
          <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: 'service.overview' }" class="parent-link">
                {{ t('service.overview') }}
              </RouterLink>
            </div>
          </li>
          <!-- <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: '' }" class="parent-link">
                {{ t('service.origin') }}
              </RouterLink>
            </div>
          </li>
          <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: '' }" class="parent-link">
                {{ t('service.waf_rules') }}
              </RouterLink>
            </div>
          </li>
          <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: '' }" class="parent-link">
                {{ t('service.cache_rules') }}
              </RouterLink>
            </div>
          </li> -->
        </ul>
      </div>
      <div v-else-if="typeSubsidebar === 'home'">
        <div class="sidebar-title">
          <h3>{{ t('dashboard.dashboard') }}</h3>
        </div>

        <ul class="submenu" data-simplebar>
          <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: 'home' }" class="parent-link">
                {{ t('dashboard.overview') }}
              </RouterLink>
            </div>
          </li>

          <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: 'home.data-usage' }" class="parent-link">
                {{ t('dashboard.data_usage') }}
              </RouterLink>
            </div>
          </li>

          <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: 'home.firewall' }" class="parent-link">
                {{ t('dashboard.web_protection') }}
              </RouterLink>
            </div>
          </li>

          <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: 'home.acceleration' }" class="parent-link">
                {{ t('dashboard.acceleration') }}
              </RouterLink>
            </div>
          </li>
        </ul>
      </div>
      <!-- <div v-else-if="typeSubsidebar === 'waf'">
        <div class="sidebar-title">
          <h3>WAF</h3>
        </div>

        <ul class="submenu" data-simplebar>
          <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: 'waf' }" class="parent-link">
                Create WAF Rules
              </RouterLink>
            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="typeSubsidebar === 'cache'">
        <div class="sidebar-title">
          <h3>Cache Control</h3>
        </div>

        <ul class="submenu" data-simplebar>
          <li>
            <div class="collapse-wrap">
              <a href="/cache#cacheRules" class="parent-link"> Cache Rules </a>
            </div>
          </li>
          <li>
            <div class="collapse-wrap">
              <a href="/cache#noCacheRules" class="parent-link">
                No-Cache Rules
              </a>
            </div>
          </li>
          <li>
            <div class="collapse-wrap">
              <a href="/cache#purgeCache" class="parent-link"> Purge Cache </a>
            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="typeSubsidebar === 'event'">
        <div class="sidebar-title">
          <h3>Event Logs</h3>
        </div>

        <ul class="submenu" data-simplebar>
          <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: 'event-logs' }" class="parent-link">
                Event Logs
              </RouterLink>
            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="typeSubsidebar === 'certs'">
        <div class="sidebar-title">
          <h3>Certs</h3>
        </div>

        <ul class="submenu" data-simplebar>
          <li>
            <div class="collapse-wrap">
              <RouterLink :to="{ name: 'event-logs' }" class="parent-link">
                Event Logs
              </RouterLink>
            </div>
            <div class="collapse-wrap">
              <a href="/certs#create" class="parent-link">
                Create Certificate
              </a>
            </div>
          </li>
        </ul>
      </div> -->
    </div>
  </div>
</template>
