import { ref, computed } from 'vue'
import store from '/@src/stores/index'

export const columnDefaults = [
  {
    name: 'groupName',
    value: 'waf.groupName',
  },
  {
    name: 'ruleName',
    value: 'waf.ruleName',
  },
  {
    name: 'wafAction',
    value: 'waf.wafAction',
  },
  {
    name: 'wafIp',
    value: 'waf.wafIp',
  },
  {
    name: 'wafRate',
    value: 'waf.wafRate',
  },
  {
    name: 'wafIpExclude',
    value: 'waf.wafIpExclude',
  },
  {
    name: 'usedByFQDNConfigLength',
    value: 'waf.usedByFQDNConfigLength',
  },
  {
    name: 'description',
    value: 'waf.description',
  },
  {
    name: 'status',
    value: 'waf.status',
  },
  {
    name: 'log',
    value: 'waf.log',
  },
  {
    name: 'actions',
    value: {
      value: 'originPolicy.action',
      align: 'end',
    },
  },
]

//form v-model
const groupName = ref()
const ruleName = ref()
const wafAction = ref()
const wafIp = ref()
const wafRate = ref()
const wafIpExclude = ref()
const usedByFQDNConfigLength = ref()
const description = ref()
const status = ref()
const log = ref()

const savedSelectedColumn = ref(store.getters.getWafColumnSelection)
export const appliedSelectedColumn = ref(
  savedSelectedColumn.value.length > 0
    ? savedSelectedColumn
    : [
        'groupName',
        'ruleName',
        'wafAction',
        'wafIp',
        'wafRate',
        'wafIpExclude',
        'usedByFQDNConfigLength',
        'description',
        'status',
        'log',
        'actions',
      ]
)

export const formReferences = {
  groupName,
  ruleName,
  wafAction,
  wafIp,
  wafRate,
  wafIpExclude,
  usedByFQDNConfigLength,
  description,
  status,
  log,
}

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
      required: false,
      disabled: false,
      title: 'Group Name',
      key: 'groupName',
      type: 'checkbox',
      value: 'groupName',
      radioOptions: [],
      options: [],
      label: 'waf.groupName',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Rule Name',
      key: 'ruleName',
      type: 'checkbox',
      value: 'ruleName',
      radioOptions: [],
      options: [],
      label: 'waf.ruleName',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Action',
      key: 'wafAction',
      type: 'checkbox',
      value: 'wafAction',
      radioOptions: [],
      options: [],
      label: 'waf.wafAction',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'wafIp',
      key: 'wafIp',
      type: 'checkbox',
      value: 'wafIp',
      radioOptions: [],
      options: [],
      label: 'waf.wafIp',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'wafRate',
      key: 'wafRate',
      type: 'checkbox',
      value: 'wafRate',
      radioOptions: [],
      options: [],
      label: 'waf.wafRate',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'wafIpExclude',
      key: 'wafIpExclude',
      type: 'checkbox',
      value: 'wafIpExclude',
      radioOptions: [],
      options: [],
      label: 'waf.wafIpExclude',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'usedByFQDNConfigLength',
      key: 'usedByFQDNConfigLength',
      type: 'checkbox',
      value: 'usedByFQDNConfigLength',
      radioOptions: [],
      options: [],
      label: 'waf.usedByFQDNConfigLength',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'description',
      key: 'description',
      type: 'checkbox',
      value: 'description',
      radioOptions: [],
      options: [],
      label: 'waf.description',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Status',
      key: 'status',
      type: 'checkbox',
      value: 'status',
      radioOptions: [],
      options: [],
      label: 'waf.status',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Log',
      key: 'log',
      type: 'checkbox',
      value: 'log',
      radioOptions: [],
      options: [],
      label: 'waf.log',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Action',
      key: 'actions',
      type: 'checkbox',
      value: 'actions',
      radioOptions: [],
      options: [],
      label: 'waf.action',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
  ]
})
