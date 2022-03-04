import { ref, computed } from 'vue'
import store from '/@src/stores/index'

export const columnDefaults = [
  {
    name: 'groupName',
    value: 'originPolicy.groupName',
  },
  {
    name: 'policyName',
    value: 'originPolicy.policyName',
  },
  {
    name: 'origins',
    value: 'originPolicy.origins',
  },
  {
    name: 'loadBalancerMethod',
    value: 'originPolicy.loadBalancerMethod',
  },
  {
    name: 'healthCheckMode',
    value: 'originPolicy.healthCheckMode',
  },
  {
    name: 'status',
    value: 'originPolicy.status',
  },
  {
    name: 'log',
    value: 'originPolicy.log',
  },
  {
    name: 'action',
    value: {
      value: 'originPolicy.action',
      align: 'end',
    },
  },
]

//form v-model
const groupName = ref()
const policyName = ref()
const origins = ref()
const loadBalancerMethod = ref()
const healthCheckMode = ref()
const status = ref()
const log = ref()

const savedSelectedColumn = ref(store.getters.getOriginColumnSelection)
export const appliedSelectedColumn = ref(
  savedSelectedColumn.value.length > 0
    ? savedSelectedColumn
    : [
        'groupName',
        'policyName',
        'origins',
        'loadBalancerMethod',
        'healthCheckMode',
        'status',
        'log',
        'action',
      ]
)

export const formReferences = {
  groupName,
  policyName,
  origins,
  loadBalancerMethod,
  healthCheckMode,
  status,
  log,
}

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
      label: 'originPolicy.groupName',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Policy Name',
      key: 'policyName',
      type: 'checkbox',
      value: 'policyName',
      radioOptions: [],
      options: [],
      label: 'originPolicy.policyName',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Origins',
      key: 'origins',
      type: 'checkbox',
      value: 'origins',
      radioOptions: [],
      options: [],
      label: 'originPolicy.origins',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Load Balancer Method',
      key: 'loadBalancerMethod',
      type: 'checkbox',
      value: 'loadBalancerMethod',
      radioOptions: [],
      options: [],
      label: 'originPolicy.loadBalancerMethod',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Health Check Mode',
      key: 'healthCheckMode',
      type: 'checkbox',
      value: 'healthCheckMode',
      radioOptions: [],
      options: [],
      label: 'originPolicy.healthCheckMode',
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
      label: 'originPolicy.status',
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
      label: 'originPolicy.log',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'Action',
      key: 'action',
      type: 'checkbox',
      value: 'action',
      radioOptions: [],
      options: [],
      label: 'originPolicy.action',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
  ]
})
