import { ref, computed } from 'vue'
import store from '/@src/stores/index'

export const columnDefaults = [
  {
    name: 'req_id',
    value: 'eventLog.req_id',
  },
  {
    name: 'server_name',
    value: 'eventLog.domain',
  },
  {
    name: 'timestamp',
    value: 'eventLog.timestamp',
  },
  {
    name: 'group',
    value: 'eventLog.group',
  },
  {
    name: 'servicegroup',
    value: 'eventLog.customer_package',
  },
  {
    name: 'host',
    value: 'eventLog.host',
  },
  {
    name: 'tb_action',
    value: 'eventLog.tb_action',
  },
  {
    name: 'tb_type',
    value: 'eventLog.tb_type',
  },
  {
    name: 'tb_rule',
    value: 'eventLog.tb_rule',
  },
  {
    name: 'tb_reason',
    value: 'eventLog.tb_reason',
  },
  {
    name: 'cus_realy_addr',
    value: 'eventLog.cus_realy_addr',
  },
  {
    name: 'country',
    value: 'eventLog.country',
  },
  {
    name: 'request_method',
    value: 'eventLog.request_method',
  },
  {
    name: 'status',
    value: 'eventLog.status',
  },
  {
    name: 'scheme',
    value: 'eventLog.scheme',
  },
  {
    name: 'server_port',
    value: 'eventLog.server_port',
  },
  {
    name: 'uri',
    value: 'eventLog.uri',
  },
  {
    name: 'args',
    value: 'eventLog.args',
  },
  {
    name: 'request_url',
    value: 'eventLog.request_url',
  },
  {
    name: 'req_headers',
    value: 'eventLog.req_headers',
  },
  {
    name: 'request_time',
    value: 'eventLog.request_time',
  },
  {
    name: 'upstream_response_time',
    value: 'eventLog.upstream_response_time',
  },
  {
    name: 'upstream_status',
    value: 'eventLog.upstream_status',
  },
  {
    name: 'server_protocol',
    value: 'eventLog.serverProtocol',
  },
  {
    name: 'proxyType',
    value: 'eventLog.wafProxyType',
  },
  {
    name: 'isp',
    value: 'eventLog.wafIsp',
  },
  {
    name: 'originHostResolve',
    value: 'eventLog.originHostResolve',
  },
]

const savedSelectedColumn = ref(store.getters.getEventLogColumnSelection)
export const appliedSelectedColumn = ref(
  savedSelectedColumn.value.length > 0
    ? savedSelectedColumn
    : [
        'req_id',
        'server_name',
        'timestamp',
        'action',
        'tb_type',
        'tb_reason',
        'cus_realy_addr',
        'country',
        'isp',
        'headers',
        'upstream_response_time',
      ]
)

// interface formInput {
//   title: string
//   key: string
//   type: string
//   value: any
//   required: Boolean
//   disabled: Boolean
//   radioOptions: Array<Object>
//   options: Array<Object>
//   label: string
//   ref: any
//   visibility: Boolean
// }

// interface formInputs extends Array<formInput> {}

export const formInputs = computed(() => {
  return [
    {
      title: 'Req ID',
      key: 'req_id',
      type: 'checkbox',
      value: 'req_id',
      required: false,
      disabled: false,
      label: 'eventLog.req_id',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Server Name',
      key: 'server_name',
      type: 'checkbox',
      value: 'server_name',
      required: false,
      disabled: false,
      label: 'eventLog.domain',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Timestamp',
      key: 'timestamp',
      type: 'checkbox',
      value: 'timestamp',
      required: false,
      disabled: false,
      label: 'eventLog.timestamp',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Group Name',
      key: 'group',
      type: 'checkbox',
      value: 'group',
      required: false,
      disabled: false,
      label: 'eventLog.group',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Service Group',
      key: 'servicegroup',
      type: 'checkbox',
      value: 'servicegroup',
      required: false,
      disabled: false,
      label: 'eventLog.servicegroup',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Host',
      key: 'host',
      type: 'checkbox',
      value: 'host',
      required: false,
      disabled: false,
      label: 'eventLog.host',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Action',
      key: 'tb_action',
      type: 'checkbox',
      value: 'tb_action',
      required: false,
      disabled: false,
      label: 'eventLog.tb_action',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Type',
      key: 'tb_type',
      type: 'checkbox',
      value: 'tb_type',
      required: false,
      disabled: false,
      label: 'eventLog.tb_type',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Rule',
      key: 'tb_rule',
      type: 'checkbox',
      value: 'tb_rule',
      required: false,
      disabled: false,
      label: 'eventLog.tb_rule',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Reason',
      key: 'tb_reason',
      type: 'checkbox',
      value: 'tb_reason',
      required: false,
      disabled: false,
      label: 'eventLog.tb_reason',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Cur Realy Addr',
      key: 'cus_realy_addr',
      type: 'checkbox',
      value: 'cus_realy_addr',
      required: false,
      disabled: false,
      label: 'eventLog.cus_realy_addr',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Country',
      key: 'country',
      type: 'checkbox',
      value: 'country',
      required: false,
      disabled: false,
      label: 'eventLog.country',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Request Method',
      key: 'request_method',
      type: 'checkbox',
      value: 'request_method',
      required: false,
      disabled: false,
      label: 'eventLog.request_method',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Status',
      key: 'status',
      type: 'checkbox',
      value: 'status',
      required: false,
      disabled: false,
      label: 'eventLog.status',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Scheme',
      key: 'scheme',
      type: 'checkbox',
      value: 'scheme',
      required: false,
      disabled: false,
      label: 'eventLog.scheme',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Server Port',
      key: 'server_port',
      type: 'checkbox',
      value: 'server_port',
      required: false,
      disabled: false,
      label: 'eventLog.server_port',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'URI',
      key: 'uri',
      type: 'checkbox',
      value: 'uri',
      required: false,
      disabled: false,
      label: 'eventLog.uri',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Args',
      key: 'args',
      type: 'checkbox',
      value: 'args',
      required: false,
      disabled: false,
      label: 'eventLog.args',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Req Headers',
      key: 'req_headers',
      type: 'checkbox',
      value: 'req_headers',
      required: false,
      disabled: false,
      label: 'eventLog.req_headers',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Request Time',
      key: 'request_time',
      type: 'checkbox',
      value: 'request_time',
      required: false,
      disabled: false,
      label: 'eventLog.request_time',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Upstream Response Time',
      key: 'upstream_response_time',
      type: 'checkbox',
      value: 'upstream_response_time',
      required: false,
      disabled: false,
      label: 'eventLog.upstream_response_time',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Upstream Status',
      key: 'upstream_status',
      type: 'checkbox',
      value: 'upstream_status',
      required: false,
      disabled: false,
      label: 'eventLog.upstream_status',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Server Protocol',
      key: 'server_protocol',
      type: 'checkbox',
      value: 'server_protocol',
      required: false,
      disabled: false,
      label: 'eventLog.serverProtocol',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Proxy Type',
      key: 'proxyType',
      type: 'checkbox',
      value: 'proxyType',
      required: false,
      disabled: false,
      label: 'eventLog.wafProxyType',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'ISP',
      key: 'isp',
      type: 'checkbox',
      value: 'isp',
      required: false,
      disabled: false,
      label: 'eventLog.wafIsp',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      title: 'Origin Host Resolve',
      key: 'originHostResolve',
      type: 'checkbox',
      value: 'originHostResolve',
      required: false,
      disabled: false,
      label: 'eventLog.originHostResolve',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
  ]
})
