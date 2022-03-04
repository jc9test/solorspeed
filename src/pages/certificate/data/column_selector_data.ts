import { ref, computed } from 'vue'
import store from '/@src/stores/index'

export const columnDefaults = [
  {
    name: 'keypairname',
    value: 'cert.keypairname',
  },
  {
    name: 'commonName',
    value: 'cert.commonName',
  },
  {
    name: 'expiredDays',
    value: 'cert.expiredDays',
  },
  {
    name: 'certpemRaw',
    value: 'PEM',
  },
  {
    name: 'certkeyRaw',
    value: 'KEY',
  },
  {
    name: 'status',
    value: 'cert.status',
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
const action = ref()
const wafIp = ref()
const wafRate = ref()
const wafIpExclude = ref()
const usedByFQDNConfigLength = ref()
const description = ref()
const status = ref()
const log = ref()

const savedSelectedColumn = ref(store.getters.getCertColumnSelection)
export const appliedSelectedColumn = ref(
  savedSelectedColumn.value.length > 0
    ? savedSelectedColumn
    : [
        'keypairname',
        'commonName',
        'expiredDays',
        'certpemRaw',
        'certkeyRaw',
        'status',
        'actions',
      ]
)

export const formReferences = {
  groupName,
  ruleName,
  action,
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
      title: 'Key Pair Name',
      key: 'keypairname',
      type: 'checkbox',
      value: 'keypairname',
      radioOptions: [],
      options: [],
      label: 'cert.keypairname',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Common Name',
      key: 'commonName',
      type: 'checkbox',
      value: 'commonName',
      radioOptions: [],
      options: [],
      label: 'cert.commonName',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Expired Days',
      key: 'expiredDays',
      type: 'checkbox',
      value: 'expiredDays',
      radioOptions: [],
      options: [],
      label: 'cert.expiredDays',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'PEM',
      key: 'certpemRaw',
      type: 'checkbox',
      value: 'certpemRaw',
      radioOptions: [],
      options: [],
      label: 'certpemRaw',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'KEY',
      key: 'certkeyRaw',
      type: 'checkbox',
      value: 'certkeyRaw',
      radioOptions: [],
      options: [],
      label: 'certkeyRaw',
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
      label: 'cert.status',
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
