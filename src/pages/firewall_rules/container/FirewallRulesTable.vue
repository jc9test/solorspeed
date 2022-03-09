<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { columnDefaults } from '../data/column_selector_data'
import { columnBuilder } from '/@src/utils/table-column-builder'
import { _deleteData } from '/@src/api/esdata'

import FirewallRulesForm from '../container/FirewallRulesForm.vue'
import {
  formReferences,
  formInputs,
  refUpdater,
  renderSubmitValues,
  renderValues,
  inputAttributeUpdater,
} from '../data/edit_firewall_rule_data'

import ChangeLogModal from '../components/ChangeLogModal.vue'
import { _getObjectLog } from '/@src/api/rest'
import store from '/@src/stores/index'
import dayjs from 'dayjs'
import useNotyf from '/@src/composable/useNotyf'
// import { _deleteData } from '/@src/api/esdata'

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
})

const emit = defineEmits(['update:pageCurrent', 'update:pageSize', 'getData'])

const actionOptions = {
  '00': 'Allow',
  '01': 'Deny',
  '03': 'Gesture',
  // '04': 'Log',
  '05': 'Speed',
  '06': 'Redirect',
  '07': 'Cookie',
  '08': 'Period',
  '09': 'Request Headers',
  '10': 'Response Headers',
  // '11': 'Log Only',
  '12': 'Custom Page',
  '13': 'OriginPolicy',
  '14': 'Smart Captcha',
}

const isDeleteModalShow = ref(false)
const isChangeLogShow = ref(false)
const itemDeleted = ref({})

const pageSizeNow = computed({
  get: () => props.pageSize,
  set: (x) => emit('update:pageSize', x),
})

const pageCurrentNow = computed({
  get: () => props.pageCurrent,
  set: (x) => emit('update:pageCurrent', x),
})

// object log modal

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

const showFormRulesModal = ref(false)

const firewallRulesData = ref()
const showFormRules = (value: boolean, data = null) => {
  showFormRulesModal.value = value
  if (data) {
    firewallRulesData.value = data
  }
}

// table listing and pagination

const firstItemCurrent = computed(() => {
  return pageCurrentNow.value > 1 ? pageSizeNow.value * (pageCurrentNow.value - 1) + 1 : 1
})

const getData = () => {
  emit('getData')
}

const tab = ref(props.activeTab)

// build table columns

const buildColumns = () => {
  return columnBuilder(props.appliedSelectedColumn, columnDefaults, t)
}

const deleteIconClicked = (item: object) => {
  isDeleteModalShow.value = true
  itemDeleted.value = item
}

const deleteItem = async () => {
  _deleteData('rcm-wafrules', itemDeleted.value).then((res) => {
    if (res.data.taskNo == '') {
      notif.error('Failed to delete. Please try again')
    } else if (res.data.taskNo.length > 0 && res.data.success) {
      notif.success('Delete Successful')
    }
  })
  isDeleteModalShow.value = false
  await new Promise((resolve) => setTimeout(resolve, 10000)) // 3 sec ???
  getData()
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
        class="firewall-rules-table"
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
              <VFlexTableCell v-if="columns.ruleName" :datath="columns.ruleName">
                <span class="light-text">{{ item.ruleName }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.wafAction" :datath="columns.wafAction">
                <span class="light-text">{{ actionOptions[item.wafAction] }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.wafIp"
                :datath="columns.wafIp"
                style="flex: 2 0"
              >
                <span class="light-text">{{ item.wafIp }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.wafRate" :datath="columns.wafRate">
                <span class="light-text">{{ item.wafRate }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.wafIpExclude"
                :datath="columns.wafIpExclude"
                style="flex: 2 0"
              >
                <span class="light-text">{{ item.wafIpExclude }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.usedByFQDNConfigLength"
                :datath="columns.usedByFQDNConfigLength"
              >
                <span class="light-text">{{ item.usedByFQDNConfigLength }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.description" :datath="columns.description">
                <span class="light-text">{{ item.description }} </span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.status" :datath="columns.status">
                <span class="light-text">{{ item.status }}</span>
              </VFlexTableCell>

              <!-- eye icon for getting change log -->
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
                      @click="showFormRules(true, item)"
                      @keydown="showFormRules(true, item)"
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

      <FirewallRulesForm
        :show-form-rules-modal="showFormRulesModal"
        :form-inputs="formInputs"
        :firewall-rules-data="firewallRulesData"
        :ref-updater="refUpdater"
        :attribute-updater="inputAttributeUpdater"
        :render-values="renderValues"
        :render-submit-values="renderSubmitValues"
        :form-references="formReferences"
        action="edit"
        @show-form-rules="showFormRules"
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
.table-button {
  transition: all 0.4s;
  cursor: pointer;
  &:hover {
    color: #06d6a0;
  }
}

.firewall-rules-table {
  .flex-table-cell {
    word-break: break-all;
    white-space: unset;
  }

  .flex-table-header {
    span {
      &:nth-child(4) {
        flex: 2 0;
      }
      &:nth-child(6) {
        flex: 2 0;
      }
    }
  }
}

.delete-modal-content {
  padding-top: 20px;
}

@media (max-width: 969px) {
  .firewall-rules-table {
    .flex-table-header {
      display: none;
    }

    .flex-table-item {
      flex-direction: column;
      justify-content: center;
      width: 100% !important;
      padding: 20px;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      > div {
        border: none !important;
      }
    }

    &:not(.sub-table) {
      .flex-table-item {
        .flex-table-cell {
          > span,
          > small,
          > strong,
          > p,
          > div,
          > .is-pushed-mobile,
          > .text {
            margin-left: auto;

            &.no-push {
              margin-left: 0 !important;
            }
          }

          &[data-th] {
            &::before {
              content: attr(data-th);
              font-size: 0.9rem;
              text-transform: uppercase;
              font-weight: 500;
              color: var(--muted-grey);
            }
          }
        }
      }
      .flex-table-cell {
        position: relative;
        margin-bottom: 12px;

        &.no-label-mobile {
          &::before {
            display: none !important;
          }
        }

        &.cell-end {
          justify-content: flex-start !important;

          .btn-group {
            margin-left: auto;
          }
        }

        &.is-user,
        &.is-media {
          padding-left: 10px;

          span,
          .text {
            font-size: 1.2rem;
          }
        }
      }
    }
  }
}
</style>
