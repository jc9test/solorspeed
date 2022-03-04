import { ref, watch } from 'vue'
import store from '/@src/stores/index'

//form v-model
const groupName = ref(store.state.queryGroupName)
const keyPairName = ref('')
const commonName = ref('')
const issuerCommonName = ref('')
const validityStart = ref('')
const validityEnd = ref('')
const emailAddress = ref('')
const sanDns = ref('')
const certpemRaw = ref('')
const certkeyRaw = ref('')

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

export const renderSubmitValues = () => {
  const submissionObject = {}
  const keys = Object.keys(formReferences)

  for (let kIndex = 0; kIndex < keys.length; kIndex++) {
    const tempVal = formInputs.find((fi) => fi.key === keys[kIndex])?.value.value
    submissionObject[keys[kIndex]] = tempVal
      ? tempVal
      : formReferences[keys[kIndex]].value
  }
  return submissionObject
}

export const inputAttributeUpdater = ({ key, attributeName, value, errorMsg = '' }) => {
  const inputIndex = formInputs.findIndex((fi) => fi.key === key)

  formInputs[inputIndex][attributeName] = value

  if (attributeName === 'error' && errorMsg !== '') {
    formInputs[inputIndex]['errorMsg'] = errorMsg
  }

  return formInputs
}

export const addCerts = async () => {
  try {
    const newCerts = renderSubmitValues()
    console.log({ action: 'add', newCerts })
  } catch (err) {
    console.log(err)
  }
}

export const formReferences = {
  groupName,
  keyPairName,
  commonName,
  issuerCommonName,
  validityStart,
  validityEnd,
  emailAddress,
  sanDns,
  certpemRaw,
  certkeyRaw,
}

interface formInput {
  title: string
  key: string
  type: string
  mode: string
  value: any
  required: Boolean
  disabled: Boolean
  radioOptions: Array<Object>
  options: Array<Object>
  label: string
  ref: any
  questionTooltip: Boolean
  tooltip: string
  fileFormats?: Array<Object>
  placeholder: string
  conditional_visibility: Object | undefined
  visibility: Boolean
  publisher?: Boolean
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
    title: 'Essential',
    key: 'essential',
    type: 'onlyLabels',
    mode: '',
    value: '',
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.sections.essential',
    ref: '',
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Group',
    key: 'groupName',
    type: 'multiselect',
    mode: 'single',
    value: groupName,
    required: true,
    disabled: true,
    radioOptions: [{}],
    options: [{}],
    label: 'cert.groupName',
    ref: groupName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Key Pair Name',
    key: 'keypairname',
    type: 'string',
    mode: '',
    value: keyPairName,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'cert.keypairname',
    ref: keyPairName,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'filter.input_keypairName',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Cert PEM Upload',
    key: 'certpemUpload',
    type: 'file',
    mode: '',
    value: certpemRaw,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'cert.certpemUpload',
    ref: certpemRaw,
    questionTooltip: false,
    tooltip: '',
    fileFormats: [
      { label: 'pem', format: '.pem' },
      { label: 'cert', format: '.cert' },
      { label: 'cer', format: '.cer' },
    ],
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Cert KEY Upload',
    key: 'certkeyUpload',
    type: 'file',
    mode: '',
    value: certkeyRaw,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'cert.certkeyUpload',
    ref: certkeyRaw,
    questionTooltip: false,
    tooltip: '',
    fileFormats: [{ label: 'key', format: '.key' }],
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Common Name',
    key: 'commonName',
    type: 'string',
    mode: '',
    value: commonName,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'cert.commonName',
    ref: commonName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Issuer CommonName',
    key: 'issuerCommonName',
    type: 'string',
    mode: '',
    value: issuerCommonName,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'cert.issuerCommonName',
    ref: issuerCommonName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'SAN',
    key: 'sanDns',
    type: 'onlyLabels',
    mode: '',
    value: '',
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'cert.sanDns',
    ref: '',
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Validity Start',
    key: 'validityStart',
    type: 'string',
    mode: '',
    value: validityStart,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'cert.validityStart',
    ref: validityStart,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Validity End',
    key: 'validityEnd',
    type: 'string',
    mode: '',
    value: validityEnd,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'cert.validityEnd',
    ref: validityEnd,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Email Address',
    key: 'emailAddress',
    type: 'string',
    mode: '',
    value: emailAddress,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'cert.emailAddress',
    ref: emailAddress,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
]
//default template

// {
//   title: 'Title',
//   key: 'key',
//   type: 'type',
//   mode: "",
//   value: ref,
//   required: false,
//   disabled: false,
//   radioOptions: [{}],
//   options: [{}],
//   label: 'page.label',
//   ref: ref,
//   questionTooltip: false,
//   tooltip: '',
//   placeholder: '',
//   conditional_visibility: undefined,
//   visibility: true,
// },
