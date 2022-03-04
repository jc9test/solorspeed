<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// import { getEsData, _updateData, _purgeCache } from '/@src/api/esdata'
import { getEsData } from '/@src/api/esdata'
import store from '/@src/stores/index'
import { activeSidebar } from '/@src/state/overviewState'

import AddDomainModel from '/@src/pages/services-detail/container/AddDomainModel.vue'
import EditDomainModel from '/@src/pages/services-detail/container/EditDomainModel.vue'

const { t } = useI18n()

// const emit = defineEmits<{
//   (e: 'clickDropdown'): void
// }>()
const props = defineProps({
  serviceData: {
    type: Object,
    default: () => {},
  },
})

//pagination
const pageSize = ref(10)
const pageCurrent = ref(1)
const firstItemCurrent = computed(() => {
  return pageCurrent.value > 1 ? pageSize.value * (pageCurrent.value - 1) + 1 : 1
})

const modalPageSize = ref(10)
const modalPageCurrent = ref(1)
const modalFirstItemCurrent = computed(() => {
  return modalPageCurrent.value > 1
    ? modalPageSize.value * (modalPageCurrent.value - 1) + 1
    : 1
})

// setting dropdown
const domainsDropdown = ref(
  activeSidebar.value.filter((e) => e.name == 'domains')[0].open
)

// data
const tableData = ref([])
const domainFilters = ref([
  { key: 'groupName', type: 'string', value: store.state.queryGroupName },
  { key: 'appProfileName', type: 'string', value: props.serviceData?.appProfileName },
])

const searchOptions = computed(() => {
  const options = {
    isFuzzySearch: true,
    esIndex: 'rcm-nginxconfigs',
    from: pageCurrent.value > 1 ? pageSize.value * (pageCurrent.value - 1) : 0,
    size: pageSize.value,
    sort: [{ modifiedDate: { order: 'desc' } }],
    filters: domainFilters.value,
    searchView: 'ProfileDomain',
  }
  return options
})

const totalTableData = ref(0)
const currentTableData = ref(0)
const domainName = ref()
const modalSearchInput = computed(() => {
  const options = {
    isFuzzySearch: true,
    esIndex: 'rcm-nginxconfigs',
    from: Math.ceil(totalTableData.value / modalPageSize.value),
    size: modalPageSize.value,
    sort: [{ modifiedDate: { order: 'desc' } }],
    filters: domainFilters.value,
    searchView: 'ProfileDomain',
  }
  return options
})
const searchDomain = () => {
  if (domainName.value) {
    let dataFilter = domainFilters.value

    modalSearchInput.value.esIndex = 'rcm-nginxconfigs'
    dataFilter.push({
      key: 'servername',
      type: 'string',
      value: domainName.value,
    })
    modalSearchInput.value.filters = dataFilter
  } else {
    modalSearchInput.value.filters = domainFilters.value
  }

  getModalTableData(true)
}

const modalTableData = ref([])
// const modalSearchOptions = computed(() => {
//   const options = {
//     isFuzzySearch: true,
//     esIndex: 'rcm-nginxconfigs',
//     from:
//       modalPageCurrent.value > 1 ? modalPageSize.value * (modalPageCurrent.value - 1) : 0,
//     size: modalPageSize.value,
//     sort: [{ modifiedDate: { order: 'desc' } }],
//     filters: domainFilters.value,
//     searchView: 'ProfileDomain',
//   }
//   return options
// })

// const formItemList = computed(() => {
//   return {
//     appProfileName: appProfileName.value,
//     description: description.value,
//     groupName: groupName.value,
//     keypairname: keypairname.value,
//     originPort: originPort.value,
//     origins: origins.value,
//     originscheme: originscheme.value,
//     portMappingType: portMappingType.value,
//     servername: domain.value,
//     tags: tags.value,
//     useSystemCert: useSystemCert.value,
//   }
// })

// form and modal
// const isServerNameValid = ref(true)
// const tagOptions = ref()
// const keypairnameOptions = ref()
// const appProfileNameOptions = ref()
const domainSelected = ref()
const showCreateDomainModal = ref(false)
const showDomainDetailModal = ref(false)
const showEditDomainModal = ref(false)
const showDeleteModal = ref(false)
const showClearCacheModal = ref(false)
const showAllDomainModel = ref(false)
const isLoading = ref(false)
const cachePath = ref()

// form v-model
const groupName = ref(store.state.queryGroupName)
// const originPort = ref(props.serviceData.originPort)
// const originscheme = ref(props.serviceData.originscheme)
// const portMappingType = ref(props.serviceData.portMappingType)
const appProfileName = ref(props.serviceData?.appProfileName)
// const origins = ref([])
const domain = ref('')
const description = ref('')
const keypairname = ref('self-sign')
const tags = ref([])
const useSystemCert = ref(false)
const viewmore = ref('View more')
const fromAllDomain = ref(false)

// const isServerNameValidMsg = ref('')

async function clickDropdown() {
  // emit('clickDropdown')
  domainsDropdown.value = !domainsDropdown.value

  if (domainsDropdown.value === false) {
    pageCurrent.value = 1
    pageSize.value = 10
    await getTableData()
  }
}

function showCreateModal(fromDomainList) {
  fromAllDomain.value = fromDomainList
  if (fromDomainList) {
    showAllDomainModel.value = false
  }
  domain.value = ''
  description.value = ''
  tags.value = []
  useSystemCert.value = false
  keypairname.value = 'self-sign'

  showCreateDomainModal.value = true
}

const closeModal = (item: string) => {
  switch (item) {
    case 'add_domain':
      showCreateDomainModal.value = false
      if (fromAllDomain.value) {
        fromAllDomain.value = false
        showAllDomainModel.value = true
      }
      return
    case 'edit_domain':
      showEditDomainModal.value = false
      if (fromAllDomain.value) {
        fromAllDomain.value = false
        showAllDomainModel.value = true
      } else {
        showDomainDetailModal.value = true
      }
      return
  }
}

const getTableData = async () => {
  await getEsData(searchOptions.value)
    .then((res) => {
      tableData.value = res.data.mapData
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((err) => {
      tableData.value = []
    })
}

watch(activeSidebar.value, () => {
  domainsDropdown.value = activeSidebar.value.filter((e) => e.name == 'domains')[0].open
})

watch(showCreateDomainModal, () => {
  console.log({ showCreateDomainModal1: showCreateDomainModal })
})
</script>

<template>
  <!-- <div v-if="tableData != null" ref="domainRef" class="column is-12"> -->

  <div class="tile-grid-item service-detail-card-body">
    <div class="tile-grid-item-inner" style="display: block">
      <div class="columns" style="display: flex">
        <div class="column meta is-2">
          <span
            class="dark-inverted"
            style="
              font-size: 16px;
              vertical-align: -webkit-baseline-middle;
              vertical-align: text-top;
            "
          >
            {{ t('domain.domain') }}
          </span>
        </div>
        <div class="vertical-divider" />
        <div class="horizontal-divider" />

        <div v-if="!domainsDropdown" class="column is-9">
          <div class="columns container">
            <div class="column meta is-12">
              <div style="display: flex; align-items: center" class="m-b-10">
                <span class="dark-inverted" style="color: gray">
                  {{ t('domain.domain') }}
                </span>
                <VTag
                  v-if="modalTableData.length > 0"
                  color="primary"
                  class="m-l-10 setting-btn"
                  :label="viewmore"
                  @click="showAllDomainModel = true"
                />
              </div>

              <div class="domains">
                <template v-if="tableData.length > 0">
                  <div
                    v-for="item in tableData"
                    :key="item._id"
                    class="m-t-5 setting-btn"
                    @click="showDetail(item)"
                    @keypress="bar"
                  >
                    <VTag
                      rounded
                      color="primary"
                      class="m-r-5 setting-btn"
                      :label="item.servername"
                    />
                  </div>
                </template>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="column is-9">
          <div class="columns container">
            <div class="column meta is-12">
              <div style="display: flex; align-items: center" class="m-b-10">
                <span class="dark-inverted m-r-10" style="color: gray">
                  {{ t('domain.domain') }}
                </span>

                <VIconButton
                  :outlined="true"
                  color="primary"
                  circle
                  icon="feather:plus"
                  class="setting-btn add-btn"
                  @click="showCreateModal(false)"
                ></VIconButton>
                <VTag
                  v-if="modalTableData.length"
                  color="primary"
                  class="setting-btn"
                  :label="viewmore"
                  @click="showAllDomainModel = true"
                />
              </div>

              <div class="domains">
                <div
                  v-for="item in tableData"
                  :key="item._id"
                  class="m-t-5"
                  @click="showDetail(item)"
                  @keypress="bar"
                >
                  <VTag
                    rounded
                    color="primary"
                    class="m-r-5 setting-btn"
                    :label="item.servername"
                  />
                </div>
              </div>
              <div v-if="tableData.length > 0" class="pagination">
                <ListPagination
                  v-model:current-page="pageCurrent"
                  v-model:item-per-page="pageSize"
                  :total-items="props.serviceData?.appProfileDomainsLength"
                  :max-links-displayed="4"
                  :max-item="props.serviceData?.appProfileDomainsLength"
                  :item-start-from="firstItemCurrent"
                  @get-data="getTableData"
                />
              </div>
              <span v-else style="color: grey">No Data</span>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-edit">
        <div
          class="is-trigger dropdown-trigger"
          style="display: flex; justify-content: space-evenly"
          @click="clickDropdown()"
          @keypress="bar"
        >
          <!-- @click="domainsDropdown = !domainsDropdown" -->
          <VIcon icon="feather:settings" class="setting-btn" />
        </div>
      </div>
    </div>
  </div>

  <!-- Add Domain -->
  <AddDomainModel
    :show-create-domain-modal="showCreateDomainModal"
    :service-data="serviceData"
    @on-click-close="() => closeModal('add_domain')"
  />

  <!-- edit domain Modal-->
  <EditDomainModel
    :show-edit-domain-modal="showEditDomainModal"
    :domain-selected="domainSelected"
    :service-data="serviceData"
    @on-click-close="() => closeModal('edit_domain')"
  />

  <!-- get domain detail -->
  <div v-if="domainSelected">
    <VModal
      :open="showDomainDetailModal"
      :title="`${domainSelected.appProfileName}`"
      size="big"
      actions="right"
      @close="showDomainDetailModal = false"
    >
      <template #content>
        <div class="flex-table">
          <div class="flex-table-header">
            <span>{{ t('domain.group') }}</span>
            <span>{{ t('domain.service_name') }}</span>
            <span>{{ t('domain.domain') }}</span>
            <span>{{ t('domain.description') }}</span>
            <span>{{ t('domain.cname') }}</span>
            <span>{{ t('domain.status') }}</span>
            <!-- <span>Log</span> -->
          </div>

          <div class="flex-list-inner">
            <transition-group name="list" tag="div">
              <div :key="domainSelected" class="flex-table-item">
                <div class="flex-table-cell" data-th="Group">
                  <span class="light-text">{{ domainSelected.groupName }}</span>
                </div>

                <div class="flex-table-cell" data-th="Service Name">
                  <span class="light-text">{{ domainSelected.appProfileName }}</span>
                </div>

                <div class="flex-table-cell" data-th="Domain">
                  <span class="light-text">{{ domainSelected.servername }}</span>
                </div>

                <div class="flex-table-cell" data-th="Description">
                  <span class="light-text">{{ domainSelected.description }}</span>
                </div>

                <div class="flex-table-cell" data-th="Description">
                  <span class="light-text">{{ domainSelected.cnameto }}</span>
                </div>

                <div class="flex-table-cell" data-th="Status">
                  <span class="light-text">{{ domainSelected.status }}</span>
                </div>

                <!-- <div class="flex-table-cell" data-th="Log">
                  <span
                    class="light-text table-button"
                  >
                    <i class="iconify" data-icon="feather:eye"></i>
                  </span>
                </div> -->
              </div>
            </transition-group>
          </div>
        </div>
      </template>

      <template #action>
        <VButton raised color="primary" @click="showEditModal">
          {{ t('service.edit') }}
        </VButton>
        <VButton raised color="danger" @click="showDeleteModal = true">
          {{ t('service.deleteText') }}
        </VButton>
        <VButton raised color="warning" @click="showClearCacheModal = true">
          {{ t('domain.clear_cache') }}
        </VButton>
      </template>
    </VModal>
  </div>

  <!-- show all domain -->
  <div v-if="showAllDomainModel">
    <VModal
      :open="showAllDomainModel"
      :title="`${t('domain.list')} / ${t('domain.group')} : ${groupName} / ${t(
        'domain.service_name'
      )} : ${appProfileName} `"
      size="big"
      actions="right"
      noclose
      @close="showAllDomainModel = false"
    >
      <template #content>
        <div class="search-domain-input">
          <VField>
            <VControl icon="feather:search">
              <input
                v-model="domainName"
                class="input custom-text-filter"
                :placeholder="`${t('filter.searchText')}${t('service.domain_name')}`"
                @keyup.enter="searchDomain"
              />
            </VControl>
          </VField>
        </div>
        <div class="flex-table">
          <div class="flex-table-header">
            <span>{{ t('domain.domain') }}</span>
            <span>{{ t('domain.description') }}</span>
            <span>{{ t('domain.cname') }}</span>
            <span>{{ t('domain.status') }}</span>
          </div>

          <div class="page-content-inner">
            <!--List-->
            <div class="list-view list-view-v1">
              <div class="list-view-inner">
                <!--Item-->
                <transition-group name="list-complete" tag="div" class="is-multiline">
                  <!-- <div class="columns"> -->
                  <div v-if="modalTableData.length === 0" class="flex-table-item">
                    <div class="flex-table-cell" style="justify-content: center">
                      <span style="color: grey">No Data</span>
                    </div>
                  </div>
                  <div
                    v-for="(results, index) in modalTableData"
                    v-else
                    :key="index"
                    class="column is-12"
                  >
                    <div class="flex-list-inner">
                      <transition-group name="list" tag="div">
                        <div :key="results" class="flex-table-item">
                          <div class="flex-table-cell" data-th="Domain">
                            <span class="light-text">{{ results.servername }}</span>
                          </div>

                          <div class="flex-table-cell" data-th="Description">
                            <span class="light-text">{{ results.description }}</span>
                          </div>

                          <div class="flex-table-cell" data-th="Description">
                            <span class="light-text">{{ results.cnameto }}</span>
                          </div>

                          <div class="flex-table-cell" data-th="Status">
                            <span class="light-text">{{ results.status }}</span>
                          </div>
                          <div class="btn-edit">
                            <VDropdownEdit icon="feather:more-vertical" spaced right>
                              <template #content>
                                <div class="domain-dropdown">
                                  <a
                                    href="javascript:void(0);"
                                    class="dropdown-item is-media"
                                    @click="toggleEditModal(results)"
                                  >
                                    <div class="icon">
                                      <i aria-hidden="true" class="lnil lnil-pencil"></i>
                                    </div>
                                    <span>{{ t('domain.edit') }}</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    class="dropdown-item is-media"
                                    @click="toggleDeleteModal(results)"
                                  >
                                    <div class="icon">
                                      <i aria-hidden="true" class="lnil lnil-trash"></i>
                                    </div>
                                    <span>{{ t('domain.delete') }}</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    class="dropdown-item is-media"
                                    @click="toggleClearCacheModal(results)"
                                  >
                                    <div class="icon">
                                      <i aria-hidden="true" class="lnil lnil-brush"></i>
                                    </div>
                                    <span>{{ t('domain.clear_cache') }}</span>
                                  </a>
                                </div>
                              </template>
                            </VDropdownEdit>
                          </div>
                        </div>
                      </transition-group>
                    </div>
                  </div>
                  <!-- </div> -->
                </transition-group>
              </div>
            </div>
            <ListPagination
              v-if="currentTableData > 10"
              v-model:current-page="modalPageCurrent"
              v-model:item-per-page="modalPageSize"
              :total-items="props.serviceData?.appProfileDomainsLength"
              :max-links-displayed="2"
              :max-item="props.serviceData?.appProfileDomainsLength"
              :item-start-from="modalFirstItemCurrent"
              @get-data="getModalTableData(false)"
            />
          </div>
        </div>
      </template>
      <template #action>
        <VButton raised color="primary" @click="showCreateModal(true)">
          {{ t('service.add') }}
        </VButton>
      </template>
    </VModal>
  </div>

  <!-- delete modal -->
  <div v-if="domainSelected">
    <VModal
      :open="showDeleteModal"
      :title="`Remove ${domainSelected.servername}`"
      size="small"
      actions="right"
      @close="closeDeleteModal"
    >
      <template #content>
        <div>{{ t('service.message.delete') }}</div>
      </template>
      <template #action>
        <VButton
          color="primary"
          raised
          :loading="isLoading"
          @click="deleteDomain(domainSelected)"
        >
          {{ t('domain.delete') }}
        </VButton>
      </template>
    </VModal>
  </div>

  <!-- clear cache modal -->

  <VModal
    v-if="domainSelected"
    :open="showClearCacheModal"
    :title="`${domainSelected.servername}`"
    size="small"
    actions="right"
    @close="closeClearCacheModel"
  >
    <template #content>
      <div class="columns is-multiline">
        <div class="column is-12">
          <VField>
            <VControl>
              <input
                v-model="cachePath"
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
      <VButton
        color="primary"
        raised
        :loading="isLoading"
        @click="clearCache(domainSelected)"
      >
        {{ t('domain.clear_cache') }}
      </VButton>
    </template>
  </VModal>
</template>
