import { ref, watch } from 'vue'
import store from '/@src/stores/index'

//form v-model
const reqID = ref()
const serverName = ref()
const timestamp = ref()
const groupName = ref(store.state.queryGroupName)
const serviceGroup = ref()
const host = ref()
const tbAction = ref()
const tbType = ref()
const tbRule = ref()
const tbReason = ref()
const curRealyAddr = ref()
const country = ref()
const requestMethod = ref()
const status = ref()
const scheme = ref()
const serverPort = ref()
const uri = ref()
const args = ref()
const reqHeaders = ref()
const requestTime = ref()
const requestTimeGt = ref()
const requestTimeLt = ref()
const upstreamResponseTime = ref()
const upstreamResponseTimeGt = ref()
const upstreamResponseTimeLt = ref()
const upstreamStatus = ref()
const serverProtocol = ref()
const proxyType = ref()
const isp = ref()
const originHostResolve = ref()

export const formReferences = {
  reqID,
  serverName,
  timestamp,
  groupName,
  serviceGroup,
  host,
  tbAction,
  tbType,
  tbRule,
  tbReason,
  curRealyAddr,
  country,
  requestMethod,
  status,
  scheme,
  serverPort,
  uri,
  args,
  reqHeaders,
  requestTime,
  requestTimeGt,
  requestTimeLt,
  upstreamResponseTime,
  upstreamResponseTimeGt,
  upstreamResponseTimeLt,
  upstreamStatus,
  serverProtocol,
  proxyType,
  isp,
  originHostResolve,
}

interface formInput {
  title: string
  key: string
  type: string
  value: any
  required: Boolean
  disabled: Boolean
  radioOptions: Array<Object>
  options: Array<Object>
  label: string
  ref: any
  questionTooltip: Boolean
  tooltip: string
  placeholder: string
  visibility: Boolean
}

interface formInputs extends Array<formInput> {}

watch(
  () => store.state.queryGroupName,
  () => {
    groupName.value = store.state.queryGroupName
  }
)

export const formInputs: formInputs = [
  {
    title: 'Req_id',
    key: 'req_id',
    type: 'string',
    value: reqID,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.req_id',
    ref: reqID,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Domain',
    key: 'server_name',
    type: 'string',
    value: serverName,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.domain',
    ref: serverName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Timestamp',
    key: 'timestamp',
    type: 'date',
    value: timestamp,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.timestamp',
    ref: timestamp,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Group',
    key: 'group',
    type: 'multiselect',
    value: groupName,
    required: false,
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'eventLog.group',
    ref: groupName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Customer Package',
    key: 'servicegroup',
    type: 'string',
    value: serviceGroup,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.customer_package',
    ref: serviceGroup,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Host',
    key: 'host',
    type: 'string',
    value: host,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.host',
    ref: host,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Action',
    key: 'tb_action',
    type: 'multiselect',
    value: tbAction,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [
      { label: 'Allow', value: '00' },
      { label: 'Deny', value: '01' },
      { label: 'Gesture', value: '03' },
      { label: 'Log', value: '04' },
      { label: 'Speed', value: '05' },
      { label: 'Redirect', value: '06' },
      { label: 'Cookie', value: '07' },
      { label: 'Period', value: '08' },
      { label: 'Request Headers', value: '09' },
      { label: 'Response Headers', value: '10' },
      { label: 'Log Only', value: '11' },
      { label: 'Custom Page', value: '12' },
      { label: 'OriginPolicy', value: '13' },
      { label: 'Smart Captcha', value: '14' },
    ],
    label: 'eventLog.tb_action',
    ref: tbAction,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Type',
    key: 'tb_type',
    type: 'string',
    value: tbType,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.tb_type',
    ref: tbType,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Rule',
    key: 'tb_rule',
    type: 'string',
    value: tbRule,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.tb_rule',
    ref: tbRule,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Reason',
    key: 'tb_reason',
    type: 'string',
    value: tbReason,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.tb_reason',
    ref: tbReason,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Ip',
    key: 'cus_realy_addr',
    type: 'string',
    value: curRealyAddr,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.cus_realy_addr',
    ref: curRealyAddr,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Country',
    key: 'country',
    type: 'string',
    value: country,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.country',
    ref: country,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Method',
    key: 'request_method',
    type: 'string',
    value: requestMethod,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.request_method',
    ref: requestMethod,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'AF AX',
    visibility: true,
  },

  {
    title: 'Status',
    key: 'status',
    type: 'string',
    value: status,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.status',
    ref: status,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Scheme',
    key: 'scheme',
    type: 'string',
    value: scheme,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.scheme',
    ref: scheme,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Port',
    key: 'server_port',
    type: 'string',
    value: serverPort,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.server_port',
    ref: serverPort,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Uri',
    key: 'uri',
    type: 'string',
    value: uri,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.uri',
    ref: uri,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Args',
    key: 'args',
    type: 'string',
    value: args,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.args',
    ref: args,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Request Headers',
    key: 'req_headers',
    type: 'string',
    value: reqHeaders,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.req_headers',
    ref: reqHeaders,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Substitute',
    key: 'substitute',
    type: 'substitute',
    value: '',
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: '',
    ref: '',
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  // {
  //   title: 'Upstream Response Time',
  //   key: 'upstream_response_time',
  //   type: 'gtlt',
  //   value: [upstreamResponseTimeGt, upstreamResponseTimeLt],
  //   required: false,
  //   disabled: false,
  //   radioOptions: [],
  //   options: [],
  //   label: 'eventLog.upstream_response_time'),  //   ref: upstreamResponseTimeGt,
  //   questionTooltip: false,
  //   tooltip: '',
  //   placeholder: '',
  //   visibility: true,
  // },

  {
    title: 'Upstream Status',
    key: 'upstream_status',
    type: 'string',
    value: upstreamStatus,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.upstream_status',
    ref: upstreamStatus,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Server Protocol',
    key: 'server_protocol',
    type: 'string',
    value: serverProtocol,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.serverProtocol',
    ref: serverProtocol,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'Proxy Type',
    key: 'proxyType',
    type: 'string',
    value: proxyType,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.wafProxyType',
    ref: proxyType,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },

  {
    title: 'ISP',
    key: 'isp',
    type: 'string',
    value: isp,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.wafIsp',
    ref: isp,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Origin Host Resolve',
    key: 'originHostResolve',
    type: 'string',
    value: originHostResolve,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'eventLog.originHostResolve',
    ref: originHostResolve,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
]
