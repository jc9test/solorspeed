<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { columnDefaults } from '../data/column_selector_data'
import { eventLogColumnBuilder as columnBuilder } from '/@src/utils/table-column-builder'

import RequestHeadersModal from '../components/RequestHeadersModal.vue'

const { locale, t } = useI18n()

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

const emit = defineEmits(['update:pageSize', 'update:pageCurrent', 'getData'])

const actionOptions = {
  '00': 'Allow',
  '01': 'Deny',
  '03': 'Gesture',
  '04': 'Log',
  '05': 'Speed',
  '06': 'Redirect',
  '07': 'Cookie',
  '08': 'Period',
  '09': 'Request Headers',
  '10': 'Response Headers',
  '11': 'Log Only',
  '12': 'Custom Page',
  '13': 'OriginPolicy',
  '14': 'Smart Captcha',
}

const isDeleteModalShow = ref(false)
const requestHeaderShow = ref(false)
const reqHeaderData = ref()
const itemDeleted = ref({})

const pageSizeNow = computed({
  get: () => props.pageSize,
  set: (x) => emit('update:pageSize', x),
})

const pageCurrentNow = computed({
  get: () => props.pageCurrent,
  set: (x) => emit('update:pageCurrent', x),
})

const openReqHeaderModal = (item: any) => {
  reqHeaderData.value = item
  requestHeaderShow.value = true
}

const closeReqHeaderModal = () => {
  requestHeaderShow.value = false
}

//pagination
const firstItemCurrent = computed(() => {
  return pageCurrentNow.value > 1 ? pageSizeNow.value * (pageCurrentNow.value - 1) + 1 : 1
})

const getData = () => {
  const pageDetail = ref({
    pageSize: pageSizeNow.value,
    pageCurrent: pageCurrentNow.value,
  })
  emit('getData', pageDetail)
}

const tab = ref(props.activeTab)

const collator = new Intl.Collator('en')

const router = useRoute()

const filteredData = computed(() => {
  const tempData = ref(props.filteredData)
  switch (router.query.sort) {
    case 'req_id:asc': {
      return [...tempData.value].sort((a, b) => collator.compare(a.req_id, b.req_id))
    }
    case 'req_id:desc': {
      return [...tempData.value].sort((a, b) => collator.compare(b.req_id, a.req_id))
    }
    default: {
      if (router.query.sort) {
        const key = router.query.sort.split(':')[0]
        return [...tempData.value].sort((a, b) => collator.compare(b[key], a[key]))
      } else {
        return tempData.value
      }
    }
  }
})

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
        class="event-logs-table"
        :header-class="
          props.appliedSelectedColumn.length <= 10
            ? 'auto-width-header'
            : 'max-content-header'
        "
        :data="filteredData"
        :columns="columns"
        rounded
      >
        <template #body>
          <TransitionGroup name="list" tag="div" class="flex-list-inner">
            <!--Table item-->
            <div
              v-for="item in filteredData"
              :key="item.id"
              :class="
                props.appliedSelectedColumn.length <= 10
                  ? 'flex-table-item'
                  : 'flex-table-item max-content-table-item'
              "
            >
              <VFlexTableCell v-if="columns.req_id" :datath="columns.req_id.label">
                <span class="item-name dark-inverted">{{ item.req_id }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.server_name"
                :datath="columns.server_name.label"
              >
                <span class="light-text">{{ item.server_name }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.timestamp" :datath="columns.timestamp.label">
                <span class="light-text">{{ item.timestamp }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.group" :datath="columns.group.label">
                <span class="light-text">{{ item.group }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.servicegroup"
                :datath="columns.servicegroup.label"
              >
                <span class="light-text">{{ item.servicegroup }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.host" :datath="columns.host.label">
                <span class="light-text">{{ item.host }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.tb_action" :datath="columns.tb_action.label">
                <span class="light-text">{{ actionOptions[item.tb_action] }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.tb_type" :datath="columns.tb_type.label">
                <span class="light-text">{{ item.tb_type }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.tb_rule" :datath="columns.tb_rule.label">
                <span class="light-text">{{ item.tb_rule }} </span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.tb_reason" :datath="columns.tb_reason.label">
                <span class="light-text">{{ item.tb_reason }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.cus_realy_addr"
                :datath="columns.cus_realy_addr.label"
              >
                <span class="light-text">{{ item.cus_realy_addr }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.country" :datath="columns.country.label">
                <span class="light-text">{{ item.country }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.request_method"
                :datath="columns.request_method.label"
              >
                <span class="light-text">{{ item.request_method }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.status" :datath="columns.status.label">
                <span class="light-text">{{ item.status }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.scheme" :datath="columns.scheme.label">
                <span class="light-text">{{ item.scheme }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.server_port"
                :datath="columns.server_port.label"
              >
                <span class="light-text">{{ item.server_port }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.uri" :datath="columns.uri.label">
                <span class="light-text">{{ item.uri }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.args" :datath="columns.args.label">
                <span class="light-text">{{ item.args }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.req_headers"
                :datath="columns.req_headers.label"
              >
                <span class="light-text">
                  <span
                    class="light-text table-button"
                    @click="openReqHeaderModal(item.req_headers)"
                    @keydown="openReqHeaderModal(item.req_headers)"
                  >
                    <i class="iconify" data-icon="feather:eye"></i>
                  </span>
                </span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.request_time"
                :datath="columns.request_time.label"
              >
                <span class="light-text">{{ item.request_time }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.upstream_response_time"
                :datath="columns.upstream_response_time.label"
              >
                <span class="light-text">{{ item.upstream_response_time }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.upstream_status"
                :datath="columns.upstream_status.label"
              >
                <span class="light-text">{{ item.upstream_status }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.server_protocol"
                :datath="columns.server_protocol.label"
              >
                <span class="light-text">{{ item.server_protocol }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.proxyType" :datath="columns.proxyType.label">
                <span class="light-text">{{ item.proxyType }}</span>
              </VFlexTableCell>
              <VFlexTableCell v-if="columns.isp" :datath="columns.isp.label">
                <span class="light-text">{{ item.isp }}</span>
              </VFlexTableCell>
              <VFlexTableCell
                v-if="columns.originHostResolve"
                :datath="columns.originHostResolve.label"
              >
                <span class="light-text">{{ item.originHostResolve }}</span>
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
        :max-item="filteredDataTotal < 10000 ? filteredDataTotal : 10000"
        :max-links-displayed="6"
        :item-start-from="firstItemCurrent"
        no-router
        @get-data="getData"
      />

      <RequestHeadersModal
        :is-request-header-show="requestHeaderShow"
        :content-json="reqHeaderData"
        @close-log-records="closeReqHeaderModal"
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
.router-link-active {
  display: flex;
  align-items: center;
}

.table-button {
  transition: all 0.4s;
  cursor: pointer;
  &:hover {
    color: #06d6a0;
  }
}

.event-logs-table {
  overflow-x: auto;
  .flex-table-cell {
    word-break: break-all;
    white-space: unset;
    span {
      width: 120px;
    }
  }

  .flex-table-header {
    span {
      .is-inline {
        padding: 0px !important;
      }
    }
  }
  .flex-table-header > div {
    cursor: pointer;
    &:hover span {
      color: $primary !important;
    }
  }
  .flex-table-header > * {
    display: flex;
    justify-content: space-between;
    padding: 0 0px 0px 0px;
    .fas {
      padding-right: 5px;
      font-size: 16px;
    }
  }
  .max-content-header {
    width: max-content;

    & > * {
      width: 140px;
    }
  }
  .auto-width-header > * {
    flex: 1 1 0;
  }
  .max-content-table-item {
    width: max-content;
  }
  .flex-table-item {
    button {
      background: transparent;
      border-radius: 20px;
      border: 1px solid #fff;
      margin-left: 7px;
      cursor: pointer;
    }

    button:hover {
      border: 1px solid $primary;
    }

    .no-data {
      justify-content: center;
    }
  }
}

.delete-modal-content {
  padding-top: 20px;
}

@media only screen and (max-width: 767px) {
  .event-logs-table {
    .flex-table-item {
      .flex-table-cell.cell-end {
        justify-content: space-between;
      }

      .flex-table-cell.no-data {
        margin-bottom: 0;
        span {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
