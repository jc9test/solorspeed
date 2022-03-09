<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import store from '/@src/stores/index'
import { _purgeCache } from '/@src/api/edges'
import { _deleteData } from '/@src/api/esdata'
import ServiceLineSingle from '/@src/pages/services/components/ServiceLineSingle.vue'

const { t } = useI18n()
const notif = useNotyf()
const emit = defineEmits(['getData'])
const props = defineProps({
  activeTab: {
    type: String,
    default: () => 'closed',
  },
  filteredData: {
    type: Object,
    default: () => {},
  },
  filteredDataTotal: {
    type: Number,
    default: () => 0,
  },
  pageSize: {
    type: Number,
    default: () => 0,
  },
  pageCurrent: {
    type: Number,
    default: () => 0,
  },
})

const clearCacheItem = ref()
const deleteServiceItem = ref()
const inputCachePath = ref()
const isLoading = ref(false)
const isClearCacheModalShow = ref(false)
const isDeleteModalShow = ref(false)
var tab = ref(props.activeTab)
const pageSize = ref(props.pageSize)
const pageCurrent = ref(props.pageCurrent)

const firstItemCurrent = computed(() => {
  return pageCurrent.value > 1 ? pageSize.value * (pageCurrent.value - 1) + 1 : 1
})

const getData = () => {
  const pageDetail = ref({
    pageSize: pageSize.value,
    pageCurrent: pageCurrent.value,
  })
  emit('getData', pageDetail)
}

const onHandleClearCache = (item: any) => {
  isClearCacheModalShow.value = true
  clearCacheItem.value = item
}

const onHandleDeleteService = (item: Object) => {
  isDeleteModalShow.value = true
  deleteServiceItem.value = item
}

async function clearCache() {
  isLoading.value = true
  let purgeItems = [
    {
      fqdnConfig: clearCacheItem.value.appProfileName,
      key: inputCachePath.value || '',
    },
  ]
  let purgeData = {
    groupName: store.state.queryGroupName,
    isAppProfile: clearCacheItem.value.isAppProfile,
    purgeItems: purgeItems,
  }
  await _purgeCache(purgeData)
    .then(async (res) => {
      notif.success('Clear Successful')
      console.log({ 'purgeCache - success': res })
    })
    .catch((err) => {
      notif.error('Clear Fail')
      console.log({ 'purgeCache - error': err })
    })
  isLoading.value = false
  isClearCacheModalShow.value = false
}

async function deleteService() {
  isLoading.value = true
  await _deleteData('rcm-app-profiles', deleteServiceItem.value)
    .then(async (res) => {
      if (res?.data?.taskNo) {
        notif.success(t('service.notif.delete_success'))
      } else {
        notif.error(t('service.notif.delete_fail'))
      }
    })
    .catch((err) => {
      notif.error('Delete Fail')
      console.log({ 'deleteService - error': err })
    })
  isLoading.value = false
  isDeleteModalShow.value = false
}
</script>

<template>
  <div class="page-content-inner">
    <!--List Empty Search Placeholder -->

    <div class="list-view list-view-v1">
      <div class="list-view-inner">
        <div v-if="tab === 'active'">
          <transition-group name="list" tag="div" class="list-view-column-container">
            <div
              v-for="(result, index) in filteredData"
              :key="index"
              class="list-view-column"
            >
              <ServiceLineSingle
                :results="result"
                @on-handle-delete-service="onHandleDeleteService"
                @on-handle-clear-cache="onHandleClearCache"
              />
            </div>
          </transition-group>
        </div>
        <!-- Empty Placeholder -->
        <div v-else>
          <transition-group name="list" tag="div" class="list-view-column-container">
            <div v-for="index in 10" :key="index" class="list-view-column">
              <VPlaceholderList />
            </div>
          </transition-group>
        </div>

        <!--Table Pagination-->
        <ListPagination
          v-if="filteredData.length > 5"
          v-model:current-page="pageCurrent"
          v-model:item-per-page="pageSize"
          :total-items="filteredDataTotal"
          :max-item="filteredDataTotal"
          :max-links-displayed="6"
          :item-start-from="firstItemCurrent"
          no-router
          @get-data="getData"
        />
      </div>
    </div>
  </div>

  <!-- Clear Cache Modal -->
  <VModal
    :open="isClearCacheModalShow"
    :title="
      clearCacheItem
        ? `${t('domain.clear_cache')} ${clearCacheItem.appProfileName}`
        : `${t('service.clear_cache')}`
    "
    size="small"
    actions="right"
    @close="isClearCacheModalShow = false"
  >
    <template #content>
      <div class="columns is-multiline">
        <div class="column is-12">
          <VField>
            <VControl>
              <input
                v-model="inputCachePath"
                type="text"
                class="input"
                placeholder="指定清除路徑, 空白全部清除. 例如: /assets/template/"
              />
            </VControl>
          </VField>
        </div>
      </div>
    </template>
    <template #action>
      <VButton color="primary" raised :loading="isLoading" @click="clearCache()">
        {{ t('domain.clear_cache') }}
      </VButton>
    </template>
  </VModal>

  <!-- Delete Service -->
  <V-Modal
    :open="isDeleteModalShow"
    :title="
      deleteServiceItem
        ? `${t('service.removeText')} ${deleteServiceItem.appProfileName}`
        : `${t('service.removeText')}`
    "
    size="small"
    actions="right"
    @close="isDeleteModalShow = false"
  >
    <template #content>
      <div>{{ t('service.message.delete') }}</div>
    </template>
    <template #action>
      <VButton color="primary" raised @click="deleteService">
        {{ t('service.confirmText') }}
      </VButton>
    </template>
  </V-Modal>
</template>
