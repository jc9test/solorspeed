<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { currentDomain, domainList, refDomainList } from '/@src/state/domainState'
import store from '/@src/stores/index'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  located: {
    type: String,
    default: () => '',
  },
})

const domainListModal = ref(false)
const located = computed(() => props.located)

function changeDomain(index: Number) {
  currentDomain.value = domainList[index]
  store.commit('SET_QUERY_GROUPNAME', currentDomain.value)

  domainListModal.value = false
  router.push(`"/home?groupName=${currentDomain.value}"`)
}
</script>

<template>
  <!-- trigger button -->
  <div v-if="located === 'header'">
    <div
      class="domain-outer-box header"
      @click="domainListModal = true"
      @keypress="domainListModal = true"
    >
      <div>{{ currentDomain }}</div>
      <div class="base-caret">
        <VIcon v-if="!dropdown?.isOpen" icon="fa:angle-down" />
        <VIcon v-else icon="fa:angle-up" />
      </div>
    </div>
  </div>

  <div v-if="located === 'sidebar'">
    <div
      class="domain-outer-box sidebar"
      @click="domainListModal = true"
      @keypress="domainListModal = true"
    >
      <div>{{ currentDomain }}</div>
      <div class="base-caret">
        <VIcon v-if="!dropdown?.isOpen" icon="fa:angle-down" />
        <VIcon v-else icon="fa:angle-up" />
      </div>
    </div>
  </div>

  <VModal
    :open="domainListModal"
    :title="`${t('domain.group')}`"
    size="medium"
    actions="right"
    @close="domainListModal = false"
  >
    <template #content>
      <div class="card-grid card-grid-v3">
        <div class="columns is-multiline">
          <div
            v-for="(domain, index) in refDomainList"
            :key="domain + index"
            class="column is-4"
          >
            <a @click="changeDomain(index)" @keypress="bar">
              <div class="card-grid-item">
                <div class="card-grid-item-body">
                  <div class="text-center">{{ domain }}</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </template>
    <template #action></template>
  </VModal>
</template>
