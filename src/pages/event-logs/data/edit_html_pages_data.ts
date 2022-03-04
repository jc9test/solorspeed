import { ref } from 'vue'

//form v-model
const htmlPageName = ref('')
const htmlPageRaw = ref('')
const htmlPageUpload = ref('')
const ridPosition = ref('z-index:9999;font-size:18px;position:absolute;top:0;left:0;')
const ridColor = ref('color:black')

export const formReferences = {
  htmlPageName,
  htmlPageRaw,
  htmlPageUpload,
  ridPosition,
  ridColor,
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
    value: htmlPageUpload.value,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'html.htmlPageUpload',
    ref: htmlPageUpload.value,
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
    value: ridPosition.value,
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
    ref: ridPosition.value,
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
    value: ridColor.value,
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
    ref: ridColor.value,
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
//   value: ref.value,
//   required: false,
//   disabled: false,
//   radioOptions: [{}],
//   options: [{}],
//   label: 'page.label',
//   ref: ref.value,
//   questionTooltip: false,
//   tooltip: '',
//   placeholder: '',
//   conditional_visibility: undefined,
//   visibility: true,
// },
