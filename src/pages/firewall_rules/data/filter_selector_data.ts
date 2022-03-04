import { ref, watch } from 'vue'
import store from '/@src/stores/index'

//form v-model
const createBy = ref()
const groupName = ref(store.state.queryGroupName)
const ruleName = ref()
const wafAction = ref()
const wafRedirectHttpCode = ref()
const wafSetReqHeaders = ref()
const wafSetResHeaders = ref()
const wafIp = ref()
const wafUri = ref()
const wafHeaders = ref()
const wafHeadersNotExist = ref()
const wafCountry = ref()
const wafIsp = ref()
const wafHttpMethod = ref()
const wafRate = ref()
const wafOwasp = ref()
const wafIpExclude = ref()
const wafUriExclude = ref()
const wafHeadersExclude = ref()
const wafProxyType = ref()
const createdDate = ref()
const modifiedDate = ref()
const description = ref()
const status = ref()

export const formReferences = {
  createBy,
  groupName,
  ruleName,
  wafAction,
  wafRedirectHttpCode,
  wafSetReqHeaders,
  wafSetResHeaders,
  wafIp,
  wafUri,
  wafHeaders,
  wafHeadersNotExist,
  wafCountry,
  wafIsp,
  wafHttpMethod,
  wafRate,
  wafOwasp,
  wafIpExclude,
  wafUriExclude,
  wafHeadersExclude,
  wafProxyType,
  createdDate,
  modifiedDate,
  description,
  status,
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
    title: 'Create By',
    key: 'createBy',
    type: 'string',
    value: createBy,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.createBy',
    ref: createBy,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Group Name',
    key: 'groupName',
    type: 'multiselect',
    value: groupName,
    required: true,
    disabled: true,
    radioOptions: [{}],
    options: [],
    label: 'waf.groupName',
    ref: groupName,
    questionTooltip: true,
    tooltip: 'waf.tooltip.group_name',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Rule Name',
    key: 'ruleName',
    type: 'string',
    value: ruleName,
    required: true,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.ruleName',
    ref: ruleName,
    questionTooltip: true,
    tooltip: 'waf.tooltip.rule_name',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Action',
    key: 'wafAction',
    type: 'multiselect',
    value: wafAction,
    required: true,
    disabled: false,
    radioOptions: [],
    options: [
      { value: '00', label: 'Allow' },
      { value: '01', label: 'Deny' },
      { value: '03', label: 'Gesture' },
      { value: '04', label: 'Log' },
      { value: '05', label: 'Speed' },
      { value: '06', label: 'Redirect' },
      { value: '07', label: 'Cookie' },
      { value: '08', label: 'Period' },
      { value: '09', label: 'Request Headers' },
      { value: '10', label: 'Response Headers' },
      { value: '11', label: 'Log Only' },
      { value: '12', label: 'Custom Page' },
      { value: '13', label: 'OriginPolicy' },
      { value: '14', label: 'Smart Captcha' },
    ],
    label: 'waf.wafAction',
    ref: wafAction,
    questionTooltip: true,
    tooltip: 'waf.tooltip.waf_action',
    placeholder: 'filter.select_action',
    visibility: true,
  },
  {
    title: 'Redirect Http Code',
    key: 'wafRedirectHttpCode',
    type: 'string',
    value: wafRedirectHttpCode,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafRedirectHttpCode',
    ref: wafRedirectHttpCode,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Set Request Headers',
    key: 'wafSetReqHeaders',
    type: 'textarea',
    value: wafSetReqHeaders,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafSetReqHeaders',
    ref: wafSetReqHeaders,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'my-ip-header:$rip',
    visibility: true,
  },
  {
    title: 'Set Response Headers',
    key: 'wafSetResHeaders',
    type: 'textarea',
    value: wafSetResHeaders,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafSetResHeaders',
    ref: wafSetResHeaders,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'my-ip-header:$rip',
    visibility: true,
  },
  {
    title: 'Source IP',
    key: 'wafIp',
    type: 'textarea',
    value: wafIp,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafIp',
    ref: wafIp,
    questionTooltip: true,
    tooltip: 'waf.tooltip.wafIp',
    placeholder: 'A.B.C.D/netmask\nA.B.C.D/netmask',
    visibility: true,
  },
  {
    title: 'Request URI',
    key: 'wafUri',
    type: 'textarea',
    value: wafUri,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafUri',
    ref: wafUri,
    questionTooltip: true,
    tooltip: 'waf.tooltip.requestUrl',
    placeholder: '/api/secret$\n/assets$',
    visibility: true,
  },
  {
    title: 'Request headers',
    key: 'wafHeaders',
    type: 'textarea',
    value: wafHeaders,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafHeaders',
    ref: wafHeaders,
    questionTooltip: true,
    tooltip: 'waf.tooltip.requestHeader',
    placeholder: 'user-agent:Bad Agent$\nhost:mysite#.com$\nreferer:^(?!^mysite.com$)',
    visibility: true,
  },
  {
    title: 'Request Headers Not Exist',
    key: 'wafHeadersNotExist',
    type: 'textarea',
    value: wafHeadersNotExist,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafHeadersNotExist',
    ref: wafHeadersNotExist,
    questionTooltip: true,
    tooltip: 'waf.tooltip.requestHeaderNotExist',
    placeholder: 'user-agent:\nhost',
    visibility: true,
  },
  {
    title: 'Source Country',
    key: 'wafCountry',
    type: 'string',
    value: wafCountry,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafCountry',
    ref: wafCountry,
    questionTooltip: true,
    tooltip: 'waf.tooltip.sourceCountry',
    placeholder: 'AF AX',
    visibility: true,
  },
  {
    title: 'ISP',
    key: 'wafIsp',
    type: 'textarea',
    value: wafIsp,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafIsp',
    ref: wafIsp,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'Target Telecom Co.Ltd.\nMy Other ISP',
    visibility: true,
  },
  {
    title: 'Request Method',
    key: 'wafHttpMethod',
    type: 'string',
    value: wafHttpMethod,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafHttpMethod',
    ref: wafHttpMethod,
    questionTooltip: true,
    tooltip: 'waf.tooltip.requestMethod',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Request Rate',
    key: 'wafRate',
    type: 'string',
    value: wafRate,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafRate',
    ref: wafRate,
    questionTooltip: true,
    tooltip: 'waf.tooltip.requestRate',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Owasp',
    key: 'wafOwasp',
    type: 'string',
    value: wafOwasp,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafOwasp',
    ref: wafOwasp,
    questionTooltip: true,
    tooltip: 'waf.tooltip.owasp',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Not Source IP',
    key: 'wafIpExclude',
    type: 'textarea',
    value: wafIpExclude,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafIpExclude',
    ref: wafIpExclude,
    questionTooltip: true,
    tooltip: 'waf.tooltip.notWafIP',
    placeholder: 'A.B.C.D./netmask\nA.B.C.D./netmask',
    visibility: true,
  },
  {
    title: 'Not Request URI',
    key: 'wafUriExclude',
    type: 'textarea',
    value: wafUriExclude,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafUriExclude',
    ref: wafUriExclude,
    questionTooltip: true,
    tooltip: 'waf.tooltip.notRequestUrl',
    placeholder: '/api/secret$\n/assets$',
    visibility: true,
  },
  {
    title: 'Not Request Headers',
    key: 'wafHeadersExclude',
    type: 'textarea',
    value: wafHeadersExclude,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafHeadersExclude',
    ref: wafHeadersExclude,
    questionTooltip: true,
    tooltip: 'waf.tooltip.notRequestHeader',
    placeholder: 'user-agent:Good Agent$\nhost:mysite#.com\nreferer:^(?!^mysite.com$)',
    visibility: true,
  },
  {
    title: 'Proxy Type',
    key: 'wafProxyType',
    type: 'string',
    value: wafProxyType,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.wafProxyType',
    ref: wafProxyType,
    questionTooltip: true,
    tooltip: 'waf.tooltip.proxyType',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Create Date',
    key: 'createdDate',
    type: 'date',
    value: createdDate,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.createdDate',
    ref: createdDate,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Modified Date',
    key: 'modifiedDate',
    type: 'date',
    value: modifiedDate,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.modifiedDate',
    ref: modifiedDate,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Description',
    key: 'description',
    type: 'textarea',
    value: description,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'waf.description',
    ref: description,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
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
    label: 'waf.status',
    ref: status,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
]