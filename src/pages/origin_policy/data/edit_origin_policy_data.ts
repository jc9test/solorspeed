import { ref } from 'vue'
import store from '/@src/stores/index'

const groupName = ref(store.state.queryGroupName)
const healthCheckFail = ref('3')
const healthCheckHttpCode = ref(['200-399'])
const healthCheckInterval = ref(10)
const healthCheckMode = ref('tcp')
const healthCheckSuccess = ref(2)
const healthCheckTimeout = ref(500)
const healthCheckUri = ref('')
const loadbalancerMethod = ref('ipHash')
const loadbalancerSticky = ref(true)
const originPolicyName = ref('')
const originPort = ref('80')
const originsOptions = ref([])
const originscheme = ref('http')
const portMappingType = ref('default')

export const formReferences = {
  groupName,
  healthCheckFail,
  healthCheckHttpCode,
  healthCheckInterval,
  healthCheckMode,
  healthCheckSuccess,
  healthCheckTimeout,
  healthCheckUri,
  loadbalancerMethod,
  loadbalancerSticky,
  originPolicyName,
  originPort,
  originsOptions,
  originscheme,
  portMappingType,
}

export const refUpdater = (refValues: Object) => {
  const keys = Object.keys(refValues)
  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    if (formReferences[keys[keyIndex]]) {
      formReferences[keys[keyIndex]].value = refValues[keys[keyIndex]]
    }
  }
  return renderValues()
}

export const renderValues = () => {
  const returnKeys = Object.keys(formReferences)
  const returnRefs = Object.values(formReferences)

  const newItemData = {}

  for (let keyIndex = 0; keyIndex < returnKeys.length; keyIndex++) {
    newItemData[returnKeys[keyIndex]] = returnRefs[keyIndex].value
  }
  return newItemData
}

export const inputAttributeUpdater = ({ key, attributeName, value, errorMsg = '' }) => {
  const inputIndex = formInputs.findIndex((fi) => fi.key === key)
  formInputs[inputIndex][attributeName] = value

  if (attributeName === 'error' && errorMsg !== '') {
    formInputs[inputIndex]['errorMsg'] = errorMsg
  }

  return formInputs
}

export const renderSubmitValues = () => {
  const submissionObject = {}
  const keys = Object.keys(formReferences)

  for (let kIndex = 0; kIndex < keys.length; kIndex++) {
    const tempVal = formInputs.filter((fi) => fi.isObject == true)
    submissionObject[keys[kIndex]] =
      tempVal.filter((item) => item.key == keys[kIndex]).length > 0
        ? formReferences[keys[kIndex]].value
        : formReferences[keys[kIndex]].value
  }
  return submissionObject
}

export const formInputs = [
  {
    required: true,
    disabled: false,
    title: 'origin.group',
    key: 'groupName',
    type: 'multiselect',
    value: groupName,
    radioOptions: [],
    options: [],
    label: 'origin.group',
    ref: groupName,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: undefined,
  },
  {
    required: true,
    disabled: false,
    title: 'origin.policy_name',
    key: 'originPolicyName',
    type: 'string',
    value: originPolicyName,
    radioOptions: [],
    options: [],
    label: 'origin.policy_name',
    ref: originPolicyName,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: undefined,
  },
  {
    required: true,
    disabled: false,
    title: 'origin.port_mapping_type',
    key: 'portMappingType',
    type: 'radio',
    value: portMappingType,
    radioOptions: [
      { label: 'Default', value: 'default' },
      { label: 'Static', value: 'static' },
    ],
    options: [],
    label: 'origin.port_mapping_type',
    ref: portMappingType,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: undefined,
    publisher: true,
  },
  {
    required: false,
    disabled: false,
    title: 'origin.origin_scheme',
    key: 'originscheme',
    type: 'select',
    value: originscheme,
    radioOptions: [],
    options: [
      { label: 'http', value: 'http' },
      { label: 'https', value: 'https' },
    ],
    label: 'origin.origin_scheme',
    ref: originscheme,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: {
      observing: 'portMappingType',
      value: 'default',
      condition: 'equals',
    },
  },
  {
    required: false,
    disabled: false,
    title: 'origin.origin_port',
    key: 'originPort',
    type: 'number',
    value: originPort,
    radioOptions: [],
    options: [],
    label: 'origin.origin_port',
    ref: originPort,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: {
      observing: 'portMappingType',
      value: 'default',
      condition: 'equals',
    },
  },
  {
    required: false,
    disabled: false,
    title: 'origin.load_balancing_method',
    key: 'loadbalancerMethod',
    type: 'select',
    value: loadbalancerMethod,
    radioOptions: [],
    options: [
      { label: 'IP Hash', value: 'ipHash' },
      { label: 'Round Robin', value: 'roundrobin' },
      { label: 'Weight', value: 'weight' },
    ],
    label: 'origin.load_balancing_method',
    ref: loadbalancerMethod,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: undefined,
  },
  {
    required: false,
    disabled: false,
    title: 'origin.load_balancing_sticky',
    key: 'loadbalancerSticky',
    type: 'switch',
    value: loadbalancerSticky,
    radioOptions: [],
    options: [],
    label: 'origin.load_balancing_sticky',
    ref: loadbalancerSticky,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: undefined,
  },
  {
    required: false,
    disabled: true,
    title: 'origin.health_check_mode',
    key: 'healthCheckMode',
    type: 'select',
    value: healthCheckMode,
    radioOptions: [],
    options: [
      { label: 'TCP', value: 'tcp' },
      { label: 'HTTP', value: 'http' },
    ],
    label: 'origin.health_check_mode',
    ref: healthCheckMode,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: undefined,
  },
  {
    required: false,
    disabled: true,
    title: 'origin.health_check_interval',
    key: 'healthCheckInterval',
    type: 'select',
    value: healthCheckInterval,
    radioOptions: [],
    options: [{ label: '10s', value: 10 }],
    label: 'origin.health_check_interval',
    ref: healthCheckInterval,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: undefined,
  },
  {
    required: false,
    disabled: true,
    title: 'origin.health_check_timeout',
    key: 'healthCheckTimeout',
    type: 'select',
    value: healthCheckTimeout,
    radioOptions: [],
    options: [{ label: '500ms', value: 500 }],
    label: 'origin.health_check_timeout',
    ref: healthCheckTimeout,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: undefined,
  },
  {
    required: false,
    disabled: true,
    title: 'origin.health_check_success',
    key: 'healthCheckSuccess',
    type: 'select',
    value: healthCheckSuccess,
    radioOptions: [],
    options: [{ label: '2', value: 2 }],
    label: 'origin.health_check_success',
    ref: healthCheckSuccess,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: undefined,
  },
  {
    required: false,
    disabled: true,
    title: 'origin.health_check_fail',
    key: 'healthCheckFail',
    type: 'select',
    value: healthCheckFail,
    radioOptions: [],
    options: [{ label: '3', value: 3 }],
    label: 'origin.health_check_fail',
    ref: healthCheckFail,
    error: false,
    errorMsg: 'filter.validation.required',
    visibility: true,
    conditional_visibility: undefined,
  },
]
