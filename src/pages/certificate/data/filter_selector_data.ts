import { ref, watch } from 'vue'
import store from '/@src/stores/index'

//form v-model
const groupName = ref(store.state.queryGroupName)
const createBy = ref()
const keypairname = ref()
const commonName = ref()
const issuerCommonName = ref()
const sanDns = ref()
const validityStart = ref()
const validityEnd = ref()
const emailAddress = ref()
const createdDate = ref()
const modifiedDate = ref()
const status = ref()

export const formReferences = {
  groupName,
  createBy,
  keypairname,
  commonName,
  issuerCommonName,
  sanDns,
  validityStart,
  validityEnd,
  emailAddress,
  createdDate,
  modifiedDate,
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
    title: 'Group Name',
    key: 'groupName',
    type: 'multiselect',
    value: groupName,
    required: true,
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'cert.groupName',
    ref: groupName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Create By',
    key: 'createBy',
    type: 'string',
    value: createBy,
    required: false,
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'cert.createBy',
    ref: createBy,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'KeyPair Name',
    key: 'keypairname',
    type: 'string',
    value: keypairname,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'cert.keypairname',
    ref: keypairname,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Common Name',
    key: 'commonName',
    type: 'string',
    value: commonName,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'cert.commonName',
    ref: commonName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Issuer Common Name',
    key: 'issuerCommonName',
    type: 'string',
    value: issuerCommonName,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'cert.issuerCommonName',
    ref: issuerCommonName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'SAN',
    key: 'sanDns',
    type: 'string',
    value: sanDns,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'cert.sanDns',
    ref: sanDns,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Validity Start',
    key: 'validityStart',
    type: 'date',
    value: validityStart,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'cert.validityStart',
    ref: validityStart,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Validity End',
    key: 'validityEnd',
    type: 'date',
    value: validityEnd,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'cert.validityEnd',
    ref: validityEnd,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Email Address',
    key: 'emailAddress',
    type: 'string',
    value: emailAddress,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'cert.emailAddress',
    ref: emailAddress,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Create Date',
    key: 'createDate',
    type: 'date',
    value: createdDate,
    required: false,
    disabled: false,
    radioOptions: [],
    options: [],
    label: 'cert.createDate',
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
    label: 'cert.modifiedDate',
    ref: modifiedDate,
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
    label: 'cert.status',
    ref: status,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
]
