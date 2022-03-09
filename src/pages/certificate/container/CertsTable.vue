<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { columnDefaults } from '../data/column_selector_data'
import { columnBuilder } from '/@src/utils/table-column-builder'
import { _deleteData } from '/@src/api/esdata'
import useNotyf from '/@src/composable/useNotyf'

import {
  formInputs,
  refUpdater,
  renderValues,
  renderSubmitValues,
  formReferences,
} from '../data/edit_certs_data'
import CertsForm from './CertsForm.vue'

const { locale, t } = useI18n()
const notif = useNotyf()
const props = defineProps({
  activeTab: {
    type: String,
    default: () => '',
  },
  appliedSelectedColumn: {
    type: Object,
    default: () => {},
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
  filters: {
    type: Object,
    default: () => {},
  },
})

const isDeleteModalShow = ref(false)
const showFormCertsModal = ref(false)
const itemDeleted = ref({})

const pageSizeNow = computed({
  get: () => props.pageSize,
  set: (x) => emit('update:pageSize', x),
})

const pageCurrentNow = computed({
  get: () => props.pageCurrent,
  set: (x) => emit('update:pageCurrent', x),
})

const deleteIconClicked = (item) => {
  isDeleteModalShow.value = true
  itemDeleted.value = item
}

const deleteItem = async () => {
  _deleteData('rcm-certpems', itemDeleted.value).then((res) => {
    if (res.data.taskNo == '') {
      notif.error('Failed to delete. Please try again')
    } else if (res.data.taskNo.length > 0 && res.data.success) {
      notif.success('Delete Successful')
    }
  })
  isDeleteModalShow.value = false
  await new Promise((resolve) => setTimeout(resolve, 10000)) // 3 sec
  getData()
}

// download handler

const downloadData = (item: Object, fileType: String) => {
  let blob
  if (fileType === 'key') {
    blob = new Blob([item.certkeyRaw])
  } else if (fileType === 'pem') {
    blob = new Blob([item.certpemRaw])
  }
  let blobUrl = window.URL.createObjectURL(blob)
  let link = document.createElement('a')
  link.href = blobUrl
  link.download =
    fileType === 'key' ? `${item.keypairname}.key` : `${item.keypairname}.pem`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const certsData = ref([])
const showFormCerts = (value: boolean, data = null) => {
  showFormCertsModal.value = value
  if (data) {
    certsData.value = data
  }
}

// table listing and pagination

const firstItemCurrent = computed(() => {
  return pageCurrentNow.value > 1 ? pageSizeNow.value * (pageCurrentNow.value - 1) + 1 : 1
})

const emit = defineEmits(['getData', 'update:pageSize', 'update:pageCurrent'])

const getData = () => {
  const pageDetail = ref({
    pageSize: pageSizeNow.value,
    pageCurrent: pageCurrentNow.value,
  })
  emit('getData', pageDetail)
}

const tab = ref(props.activeTab)

// build table columns

const buildColumns = () => {
  return columnBuilder(props.appliedSelectedColumn, columnDefaults, t)
}

const columns = ref(buildColumns())

watch(
  () => [props.appliedSelectedColumn, locale.value],
  () => {
    columns.value = buildColumns()
  }
)

watch(
  () => pageCurrentNow.value,
  () => {
    pageCurrentNow.value = props.pageCurrent
  }
)
</script>

<template>
  <div>
    <div class="flex-list-wrapper flex-list-v2">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        v-if="tab === 'active' && filteredData.length === 0"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-4.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <!--Active Tab-->
      <VFlexTable
        v-if="filteredData.length"
        class="certs-table"
        :data="filteredData"
        :columns="columns"
        rounded
      >
        <template #body>
          <TransitionGroup name="list" tag="div" class="flex-list-inner">
            <!--Table item-->
            <div v-for="item in filteredData" :key="item.id" class="flex-table-item">
              <VFlexTableCell v-if="columns.keypairname" :datath="columns.keypairname">
                <span class="item-name dark-inverted">{{ item.keypairname }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.commonName" :datath="columns.commonName">
                <span class="light-text">{{ item.commonName }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.expiredDays" :datath="columns.expiredDays">
                <span class="success-text">{{ item.expiredDays }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.certpemRaw" :datath="columns.certpemRaw">
                <span class="light-text">
                  <span
                    v-if="item.certpemRaw"
                    class="light-text"
                    @click="downloadData(item, 'pem')"
                    @keydown="downloadData(item, 'pem')"
                  >
                    <i class="iconify" data-icon="feather:download"></i> </span
                ></span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.certkeyRaw" :datath="columns.certkeyRaw">
                <span class="light-text">
                  <span
                    v-if="item.certkeyRaw"
                    class="light-text"
                    @click="downloadData(item, 'key')"
                    @keydown="downloadData(item, 'key')"
                  >
                    <i class="iconify" data-icon="feather:download"></i> </span
                ></span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.status" :datath="columns.status">
                <span class="light-text">{{ item.status }}</span>
              </VFlexTableCell>

              <!-- vertical dots icon for more options -->
              <VFlexTableCell
                v-if="columns.actions"
                :datath="columns.actions.value"
                :column="{ align: 'end' }"
              >
                <VDropdown class="end-action" icon="feather:more-vertical" spaced right>
                  <template #content>
                    <a
                      v-if="!props.btnExist"
                      class="dropdown-item is-media"
                      @click="showFormCerts(true, item)"
                      @keydown="showFormCerts(true, item)"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-pencil"></i>
                      </div>
                      <div class="meta">
                        <span>{{ t('main.editText') }}</span>
                      </div>
                    </a>
                    <hr class="dropdown-divider" />

                    <a
                      role="menuitem"
                      href="#"
                      class="dropdown-item is-media"
                      @click="deleteIconClicked(item)"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-trash"></i>
                      </div>
                      <div class="meta">
                        <span>{{ t('main.deleteText') }}</span>
                      </div>
                    </a>
                  </template>
                </VDropdown>
              </VFlexTableCell>
            </div>
          </TransitionGroup>
        </template>
      </VFlexTable>

      <!--Table Pagination-->
      <ListPagination
        v-if="filteredData.length > 0"
        v-model:current-page="pageCurrentNow"
        v-model:item-per-page="pageSizeNow"
        :total-items="filteredDataTotal"
        :max-item="filteredDataTotal"
        :max-links-displayed="6"
        :item-start-from="firstItemCurrent"
        no-router
        @get-data="getData"
      />

      <CertsForm
        :show-form-certs-modal="showFormCertsModal"
        :form-inputs="formInputs"
        :certs-data="certsData"
        :render-values="renderValues"
        :render-submit-values="renderSubmitValues"
        :form-references="formReferences"
        :ref-updater="refUpdater"
        action="edit"
        @show-form-certs="showFormCerts"
        @get-data="getData"
      />

      <VModal
        :open="isDeleteModalShow"
        :title="itemDeleted ? `${t('main.removeText')} entry` : t('main.removeText')"
        size="small"
        actions="right"
        @close="isDeleteModalShow = false"
      >
        <template #content>
          <div class="delete-modal-content">{{ t('main.delete_message') }}</div>
        </template>
        <template #action>
          <VButton color="primary" raised @click="deleteItem">
            {{ t('main.confirmText') }}
          </VButton>
        </template>
      </VModal>
    </div>
  </div>
</template>

<style lang="scss">
.iconify,
.eye {
  cursor: pointer;
  &:hover {
    color: $primary;
  }
}
.table-button {
  transition: all 0.4s;
  cursor: pointer;
  &:hover {
    color: #06d6a0;
  }
}

.certs-table {
  .flex-table-cell {
    word-break: break-all;
    white-space: unset;
  }
}

.delete-modal-content {
  padding-top: 20px;
}
</style>
