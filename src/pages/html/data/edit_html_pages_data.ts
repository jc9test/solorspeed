import { ref } from 'vue'
import store from '/@src/stores/index'

//form v-model
const groupName = ref(store.state.queryGroupName)
const createBy = ref('')
const createdDate = ref('')
const htmlPageId = ref('')
const _id = ref('')
const htmlPageName = ref('')
const htmlPageRaw = ref('')
const htmlPageUpload = ref('')
const s3ObjectName = ref('')
const ridPosition = ref('z-index:9999;font-size:18px;position:absolute;top:0;left:0;')
const ridColor = ref('color:black')
const status = ref('')

export const resetToDefault = (resetOtherRefs: Function) => {
  groupName.value = store.state.queryGroupName
  htmlPageId.value = ''
  htmlPageName.value = ''
  htmlPageRaw.value = ''
  htmlPageUpload.value = ''
  ridPosition.value = 'z-index:9999;font-size:18px;position:absolute;top:0;left:0;'
  ridColor.value = 'color:black'
  resetOtherRefs()
}

export const formReferences = {
  createdDate,
  createBy,
  groupName,
  htmlPageId,
  _id,
  htmlPageName,
  htmlPageRaw,
  htmlPageUpload,
  s3ObjectName,
  ridPosition,
  ridColor,
  status,
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

export const renderSubmitValues = () => {
  const submissionObject = {}
  const keys = Object.keys(formReferences)

  for (let kIndex = 0; kIndex < keys.length; kIndex++) {
    const fi = formInputs.find((fi) => fi.key === keys[kIndex])
    const tempVal = fi?.value.value
    if (fi?.type !== 'file') {
      submissionObject[keys[kIndex]] = tempVal
        ? tempVal
        : formReferences[keys[kIndex]].value
    } else {
      console.log(tempVal)
      submissionObject[keys[kIndex]] = tempVal.file.name
    }
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

export const updateHTMLPage = async () => {
  try {
    const newHtmlPage = renderSubmitValues()
    console.log(newHtmlPage)
  } catch (err) {
    console.log(err)
  }
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
    label: 'html.sections.essential',
    ref: '',
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'HTML Page Upload',
    key: 'htmlPageUpload',
    type: 'file',
    mode: 'single',
    value: htmlPageUpload,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'html.htmlPageUpload',
    ref: htmlPageUpload,
    questionTooltip: false,
    tooltip: '',
    fileFormats: [{ label: 'html', format: '.html' }],
    placeholder: 'html.htmlPageUpload',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Rid Position',
    key: 'ridPosition',
    type: 'radio',
    mode: 'single',
    value: ridPosition,
    required: true,
    disabled: false,
    radioOptions: [
      {
        label: 'Top Left',
        value: 'z-index:9999;font-size:18px;position:absolute;top:0;left:0;',
      },
      {
        label: 'Top Right',
        value: 'z-index:9999;font-size:18px;position:absolute;top:0px;right:0px;',
      },
      {
        label: 'Center center',
        value:
          'z-index:9999;font-size:18px;position:absolute;top:50%;left:50%;margin-right:-50%;transform:translate(-50%,-50%);',
      },
      {
        label: 'Bottom Left',
        value: 'z-index:9999;font-size:18px;position:absolute;bottom:0;left:0;',
      },
      {
        label: 'Bottom Right',
        value: 'z-index:9999;font-size:18px;position:absolute;bottom:0;right:0;',
      },
    ],
    options: [{}],
    label: 'html.ridPosition',
    ref: ridPosition,
    questionTooltip: false,
    tooltip: '',
    fileFormats: [{}],
    placeholder: '',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Rid Color',
    key: 'ridColor',
    type: 'radio',
    mode: 'single',
    value: ridColor,
    required: true,
    disabled: false,
    radioOptions: [
      {
        label: 'Black',
        value: 'color:black',
      },
      {
        label: 'White',
        value: 'color:white',
      },
    ],
    options: [{}],
    label: 'html.ridColor',
    ref: ridColor,
    questionTooltip: false,
    tooltip: '',
    fileFormats: [{}],
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
