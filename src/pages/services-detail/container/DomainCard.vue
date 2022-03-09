<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'

import { _purgeCache } from '/@src/api/edges'
import { getEsData, _createData, _updateData, _deleteData } from '/@src/api/esdata'
import store from '/@src/stores/index'

import DomainFormModal from '/@src/pages/services-detail/container/DomainFormModal.vue'

const { t } = useI18n()
const notif = useNotyf()
const emit = defineEmits(['clickDropdown', 'submitData'])
const props = defineProps({
  overviewData: {
    type: Object,
    default: () => {},
  },
  domainsDropdown: {
    type: Boolean,
    default: () => false,
  },
})

// Pagination
const pageCurrent = ref(1)
const pageSize = ref(10)
const firstItemCurrent = computed(() => {
  return pageCurrent.value > 1 ? pageSize.value * (pageCurrent.value - 1) + 1 : 1
})
const currentTableData = ref(0)
const modalPageCurrent = ref(1)
const modalPageSize = ref(10)
const modalFirstItemCurrent = computed(() => {
  return modalPageCurrent.value > 1
    ? modalPageSize.value * (modalPageCurrent.value - 1) + 1
    : 1
})

// Modal PopUp
const showAddEditDomainModal = ref(false)
const showDomainDetailModal = ref(false)
const showAllDomainModel = ref(false)
const showDeleteModal = ref(false)
const showClearCacheModal = ref(false)

const isLoading = ref(false)
const domainFormData = ref([])
const domainSelected = ref(null)
const cachePathInput = ref('')
const searchDomainNameInput = ref('')
const addEditFormType = ref('add')

const groupName = ref(store.state.queryGroupName)
const overviewData = computed(() => {
  return props.overviewData
})
const domainsDropdown = computed(() => {
  return props.domainsDropdown
})
const totalTableData = ref(0)
const modalTableData = ref([])
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

// Get Data
const domainFilters = computed(() => [
  { key: 'groupName', type: 'string', value: store.state.queryGroupName },
  { key: 'appProfileName', type: 'string', value: overviewData.value?.appProfileName },
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
const modalSearchOptions = computed(() => {
  const options = {
    isFuzzySearch: true,
    esIndex: 'rcm-nginxconfigs',
    from:
      modalPageCurrent.value > 1 ? modalPageSize.value * (modalPageCurrent.value - 1) : 0,
    size: modalPageSize.value,
    sort: [{ modifiedDate: { order: 'desc' } }],
    filters: domainFilters.value,
    searchView: 'ProfileDomain',
  }
  return options
})
const getTableData = async () => {
  await getEsData(searchOptions.value)
    .then((res) => {
      domainFormData.value = res.data.mapData
      modalTableData.value = res.data.mapData
      currentTableData.value = res.data.total
      console.log({ 'Domain - domainFormData': res.data })
    })
    .catch((err) => {
      domainFormData.value = []
      console.log({ 'DomainsCard - getTableData - error': err })
    })
}
const getModalTableData = async (input: Boolean) => {
  let searchOption = ''
  if (input) {
    searchOption = modalSearchInput.value
  } else {
    searchOption = modalSearchOptions.value
  }
  await getEsData(searchOption)
    .then((res) => {
      currentTableData.value = res.data.total
      if (totalTableData.value > 0 && res.data.total > totalTableData.value) {
        totalTableData.value = res.data.total
      }
      modalTableData.value = res.data.mapData
      console.log({ 'Domain - getModalTableData': res.data })
    })
    .catch((err) => {
      modalTableData.value = []
      console.log({ 'DomainsCard - getModalTableData - error': err })
    })

  domainFilters.value = [
    { key: 'groupName', type: 'string', value: store.state.queryGroupName },
    {
      key: 'appProfileName',
      type: 'string',
      value: overviewData.value?.appProfileName,
    },
  ]
}

// On Click Action
const clickDropdown = async () => {
  emit('clickDropdown')
  // domainsDropdown.value = !domainsDropdown.value

  if (domainsDropdown.value === false) {
    pageCurrent.value = 1
    pageSize.value = 10
    await getTableData()
  }
}
const onClickShowDetail = (domain) => {
  showDomainDetailModal.value = true
  domainSelected.value = domain

  // description.value = domainSelected.value.description
  // tags.value = domainSelected.value.tags
  // useSystemCert.value = domainSelected.value.useSystemCert
  // keypairname.value = domainSelected.value.keypairname
}
const onClickAddEditModal = ({ type = 'add', domain = {} }) => {
  addEditFormType.value = type
  showAddEditDomainModal.value = !showAddEditDomainModal.value
  showAllDomainModel.value = false
  switch (type) {
    case 'add':
      domainSelected.value = null
      break
    case 'edit':
      showDomainDetailModal.value = false
      if (domain && domainSelected.value == null) {
        domainSelected.value = domain
      }
      break
  }
}
const onClickAllDomainModal = () => {
  showAllDomainModel.value = !showAllDomainModel.value
  if (showAllDomainModel.value) {
    getModalTableData(false)
  }
}
const onClickClearCacheModal = (data) => {
  showClearCacheModal.value = !showClearCacheModal.value
  if (showClearCacheModal.value) {
    if (data) {
      domainSelected.value = data
    }
  } else {
    domainSelected.value = null
  }
}
const onClickDeleteDomainModal = (data) => {
  showDeleteModal.value = !showDeleteModal.value
  if (showDeleteModal.value) {
    if (data) {
      domainSelected.value = data
    }
  }
}

// Function
const searchDomain = () => {
  if (searchDomainNameInput.value) {
    let dataFilter = domainFilters.value
    modalSearchInput.value.esIndex = 'rcm-nginxconfigs'
    dataFilter.push({
      key: 'servername',
      type: 'string',
      value: searchDomainNameInput.value,
    })
    modalSearchInput.value.filters = dataFilter
  } else {
    modalSearchInput.value.filters = domainFilters.value
  }
  getModalTableData(true)
}

// Submit
const submitDeleteDomain = async (domain) => {
  isLoading.value = true
  // domainFormData.value.filter((item) => item.servername !== domain.servername)
  // console.log({ domain: domain })
  try {
    await _deleteData('rcm-nginxconfigs', domain).then(async (res) => {
      if (res?.data?.taskNo) {
        domainFormData.value = domainFormData.value.filter((item) => {
          return item.servername !== domain.servername
        })
        notif.success('Delete Successful')
      } else {
        notif.error('Failed to delete. Please try again.')
      }
      console.log({
        API_Delete_Domain_Data: {
          result: res,
          taskNo: res.data.taskNo,
          domainFormData: domainFormData.value,
          domain: domain,
        },
      })
    })
  } catch (err) {
    console.log({ 'Domain - _deleteData - error': err })
  }
  onClickDeleteDomainModal()
  isLoading.value = false
  await new Promise((resolve) => setTimeout(resolve, 10000)) // 10 sec
}
const submitClearCache = async (domain) => {
  isLoading.value = true

  let purgeData = {
    groupName: domain.groupName,
    isAppProfile: domain.isAppProfile,
    purgeItems: [
      {
        fqdnConfig: domain.servername,
        key: cachePathInput.value || '',
      },
    ],
  }

  try {
    await _purgeCache(purgeData).then(async (res) => {
      if (res?.data?.success) {
        notif.success('Clear Successful')
      } else {
        notif.error('Clear Fail')
      }
    })
  } catch (err) {
    console.log({ 'Domain - _purgeCache - error': err })
  }

  onClickClearCacheModal()
  isLoading.value = false

  await new Promise((resolve) => setTimeout(resolve, 3000)) // 3 sec
}
const submitDomainModal = async ({ type, data }) => {
  console.log({ submitDomainModal: { type: type, data: data } })
  try {
    switch (type) {
      case 'add':
        await _createData('rcm-nginxconfigs', data).then((res) => {
          if (res?.data?.taskNo) {
            // tableData.value = data
            domainFormData.value.unshift(data)
            // getTableData()
            // onClickAddEditModal({})
            notif.success('Verification Successful')
            emit('clickDropdown')
          } else {
            notif.error('Failed to create. Please try again.')
          }
          console.log({
            API_Create_Domain_Data: {
              result: res,
              taskNo: res.data.taskNo,
            },
          })
        })
        break
      case 'edit':
        notif.success('test')
        await _updateData('rcm-nginxconfigs', data)
          .then((res) => {
            if (res?.data?.taskNo) {
              // tableData.value = data
              // onClickAddEditModal({})
              notif.success('Verification Successful')
            } else {
              notif.error('Failed to edit. Please try again.')
            }
            console.log({
              API_Edit_Domain_Data: {
                result: res,
                taskNo: res.data.taskNo,
              },
            })
          })
          .catch((err) => {
            console.log({ 'Domain - error2': err })
          })
        break
    }
  } catch (err) {
    console.log({ 'Domain - error': err })
  }
}

watch(overviewData, async () => {
  await getTableData()
})
</script>

<template>
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
        <!-- Display Value -->
        <div class="column is-9">
          <div class="columns container">
            <div class="column meta is-12">
              <div class="d-flex align-center m-b-15">
                <span class="dark-inverted m-r-10" style="color: gray">
                  {{ t('domain.domain') }}
                </span>

                <VIconButton
                  v-if="domainsDropdown"
                  :outlined="true"
                  color="primary"
                  circle
                  icon="feather:plus"
                  class="setting-btn add-btn"
                  @click="onClickAddEditModal({ type: 'add' })"
                ></VIconButton>
                <VTag
                  v-if="domainFormData.length"
                  color="primary"
                  class="setting-btn"
                  label="View more"
                  @click="onClickAllDomainModal"
                />
              </div>

              <div class="domains">
                <div
                  v-for="item in domainFormData"
                  :key="item._id"
                  @click="onClickShowDetail(item)"
                  @keypress="onClickShowDetail(item)"
                >
                  <VTag
                    rounded
                    color="primary"
                    class="setting-btn"
                    :label="item.servername"
                  />
                </div>
              </div>
              <div v-if="domainsDropdown">
                <div v-if="domainFormData.length > 0" class="pagination">
                  <ListPagination
                    v-model:current-page="pageCurrent"
                    v-model:item-per-page="pageSize"
                    :total-items="props.overviewData?.appProfileDomainsLength"
                    :max-links-displayed="4"
                    :max-item="props.overviewData?.appProfileDomainsLength"
                    :item-start-from="firstItemCurrent"
                    @get-data="getTableData"
                  />
                </div>
                <span v-else style="color: grey">No Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-edit">
        <div
          class="is-trigger dropdown-trigger"
          style="display: flex; justify-content: space-evenly"
          @click="clickDropdown()"
          @keypress="clickDropdown()"
        >
          <!-- @click="domainsDropdown = !domainsDropdown" -->
          <VIcon icon="feather:settings" class="setting-btn" />
        </div>
      </div>
    </div>
  </div>

  <!-- Add Edit Domain Modal-->
  <DomainFormModal
    :show-edit-domain-modal="showAddEditDomainModal"
    :domain-selected="domainSelected"
    :overview-data="overviewData"
    :form-type="addEditFormType"
    @on-click-close="() => onClickAddEditModal({})"
    @submit-data="(e) => submitDomainModal(e)"
  />

  <!-- show domain detail -->
  <VModal
    v-if="domainSelected"
    :open="showDomainDetailModal"
    :title="`${domainSelected.appProfileName}`"
    size="big"
    actions="right"
    noscroll
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
            </div>
          </transition-group>
        </div>
      </div>
    </template>

    <template #action>
      <VButton raised color="primary" @click="onClickAddEditModal({ type: 'edit' })">
        {{ t('service.edit') }}
      </VButton>
      <VButton raised color="danger" @click="onClickDeleteDomainModal()">
        {{ t('service.deleteText') }}
      </VButton>
      <VButton raised color="warning" @click="onClickClearCacheModal()">
        {{ t('domain.clear_cache') }}
      </VButton>
    </template>
  </VModal>

  <!-- show all domain -->
  <VModal
    v-if="showAllDomainModel"
    :open="showAllDomainModel"
    :title="`
        ${t('domain.list')} / ${t('domain.group')}
          : ${groupName} / ${t('domain.service_name')}
          : ${overviewData?.appProfileName} 
        `"
    size="big"
    actions="right"
    noscroll
    @close="onClickAllDomainModal"
  >
    <template #content>
      <div class="search-domain-input">
        <VField>
          <VControl icon="feather:search">
            <input
              v-model="searchDomainNameInput"
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
                                  @click="
                                    onClickAddEditModal({
                                      type: 'edit',
                                      domain: results,
                                    })
                                  "
                                >
                                  <div class="icon">
                                    <i aria-hidden="true" class="lnil lnil-pencil"></i>
                                  </div>
                                  <span>{{ t('domain.edit') }}</span>
                                </a>
                                <a
                                  href="javascript:void(0);"
                                  class="dropdown-item is-media"
                                  @click="onClickDeleteDomainModal(results)"
                                >
                                  <div class="icon">
                                    <i aria-hidden="true" class="lnil lnil-trash"></i>
                                  </div>
                                  <span>{{ t('domain.delete') }}</span>
                                </a>
                                <a
                                  href="javascript:void(0);"
                                  class="dropdown-item is-media"
                                  @click="onClickClearCacheModal(results)"
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
            :total-items="overviewData?.appProfileDomainsLength"
            :max-links-displayed="2"
            :max-item="overviewData?.appProfileDomainsLength"
            :item-start-from="modalFirstItemCurrent"
            @get-data="getModalTableData(false)"
          />
        </div>
      </div>
    </template>
    <template #action>
      <VButton raised color="primary" @click="onClickAddEditModal({ type: 'add' })">
        {{ t('service.add') }}
      </VButton>
    </template>
  </VModal>

  <!-- delete modal -->
  <VModal
    v-if="domainSelected"
    :open="showDeleteModal"
    :title="`Remove ${domainSelected.servername}`"
    size="small"
    actions="right"
    noscroll
    @close="onClickDeleteDomainModal"
  >
    <template #content>
      <div>{{ t('service.message.delete') }}</div>
    </template>
    <template #action>
      <VButton
        color="primary"
        raised
        :loading="isLoading"
        @click="submitDeleteDomain(domainSelected)"
      >
        {{ t('domain.delete') }}
      </VButton>
    </template>
  </VModal>

  <!-- clear cache modal -->
  <VModal
    v-if="domainSelected"
    :open="showClearCacheModal"
    :title="`Clear Cache ${domainSelected.servername}`"
    size="small"
    actions="right"
    noscroll
    @close="onClickClearCacheModal"
  >
    <template #content>
      <div class="columns is-multiline">
        <div class="column is-12">
          <VField>
            <VControl>
              <input
                v-model="cachePathInput"
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
        @click="submitClearCache(domainSelected)"
      >
        {{ t('domain.clear_cache') }}
      </VButton>
    </template>
  </VModal>
</template>
