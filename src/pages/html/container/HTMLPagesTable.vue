<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import { columnDefaults } from '../data/column_selector_data'
import {
  formInputs,
  refUpdater,
  renderValues,
  renderSubmitValues,
} from '../data/edit_html_pages_data'
import HTMLPagesForm from './HTMLPagesForm.vue'

import ChangeLogModal from '../components/ChangeLogModal.vue'
import { _getObjectLog } from '/@src/api/rest'
import store from '/@src/stores/index'
import dayjs from 'dayjs'
// import useNotyf from '/@src/composable/useNotyf'
import { _deleteData } from '/@src/api/esdata'

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

const pageSizeNow = ref(props.pageSize)
const pageCurrentNow = ref(props.pageCurrent)
const isDeleteModalShow = ref(false)
const isChangeLogShow = ref(false)
const showFormHtmlModal = ref(false)
const itemDeleted = ref({})

const objectLogData = ref([])

const openLogRecords = (item: any) => {
  _getObjectLog(item._id, store.state.queryGroupName).then((res) => {
    if (res.data.data.length > 0) {
      objectLogData.value = res.data.data
      objectLogData.value = objectLogData.value.map((item) => {
        return {
          actionName: item.actionName,
          diffData: JSON.stringify(item.diffData, undefined, 2),
          submitTime: dayjs(item.submitTime).format('YYYY-MM-DD HH:mm:ss'),
          username: item.username,
        }
      })
    } else {
    }
  })

  isChangeLogShow.value = true
}

const closeLogRecords = () => {
  isChangeLogShow.value = false
  objectLogData.value = []
}

const deleteIconClicked = (item: object) => {
  isDeleteModalShow.value = true
  itemDeleted.value = item
}

const deleteItem = async () => {
  _deleteData('rcm-htmlpages', itemDeleted.value).then((res) => {
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

const htmlPagesData = ref([])
const showFormHtml = (value: boolean, data = null) => {
  showFormHtmlModal.value = value
  if (data) {
    htmlPagesData.value = data
  }
}

//pagination
const firstItemCurrent = computed(() => {
  return pageCurrentNow.value > 1 ? pageSizeNow.value * (pageCurrentNow.value - 1) + 1 : 1
})

const emit = defineEmits(['getData'])

const getData = () => {
  const pageDetail = ref({
    pageSize: pageSizeNow.value,
    pageCurrent: pageCurrentNow.value,
  })
  emit('getData', pageDetail)
}

const tab = ref(props.activeTab)

const columnBuilder = () => {
  let columns = {}
  for (let index = 0; index < columnDefaults.length; index++) {
    if (props.appliedSelectedColumn.includes(columnDefaults[index].name)) {
      if (typeof columnDefaults[index].value === 'string') {
        ;(columns as any)[columnDefaults[index].name] = t(columnDefaults[index].value)
      } else if (typeof columnDefaults[index].value === 'object') {
        ;(columns as any)[columnDefaults[index].name] = {
          ...(columnDefaults[index].value as any),
          value: t(columnDefaults[index].value.value),
        }
      }
    }
  }
  return columns
}

const columns = ref(columnBuilder())

watch(
  () => [props.appliedSelectedColumn, locale.value],
  () => {
    columns.value = columnBuilder()
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
              <VFlexTableCell v-if="columns.groupName" :datath="columns.groupName">
                <span class="item-name dark-inverted">{{ item.groupName }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.htmlPageName" :datath="columns.htmlPageName">
                <span class="item-name dark-inverted">{{ item.htmlPageName }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.status" :datath="columns.status">
                <span class="item-name dark-inverted">{{ item.status }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.log" :datath="columns.log">
                <span
                  class="light-text table-button"
                  @click="openLogRecords(item)"
                  @keydown="openLogRecords(item)"
                >
                  <i class="iconify" data-icon="feather:eye"></i>
                </span>
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
                      @click="showFormHtml(true, item)"
                      @keydown="showFormHtml(true, item)"
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

      <ChangeLogModal
        :is-change-log-show="isChangeLogShow"
        :object-log-data="objectLogData"
        @close-log-records="closeLogRecords"
      />

      <HTMLPagesForm
        :show-form-html-modal="showFormHtmlModal"
        :form-inputs="formInputs"
        :html-pages-data="htmlPagesData"
        :render-values="renderValues"
        :render-submit-values="renderSubmitValues"
        :ref-updater="refUpdater"
        action="edit"
        @show-form-html="showFormHtml"
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
