import { ref, watch } from 'vue'
import store from '/@src/stores/index'

//form v-model
const createBy = ref()
const groupName = ref(store.state.queryGroupName)
const htmlPageName = ref()
const createdDate = ref()
const modifiedDate = ref()
const ridPosition = ref()
const ridColor = ref()
const status = ref()

export const formReferences = {
  createBy,
  groupName,
  htmlPageName,
  createdDate,
  modifiedDate,
  ridPosition,
  ridColor,
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
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'html.createBy',
    ref: createBy,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Group',
    key: 'groupName',
    type: 'multiselect',
    value: groupName,
    required: true,
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'html.groupName',
    ref: groupName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'HTML Page Name',
    key: 'htmlPageName',
    type: 'string',
    value: htmlPageName,
    required: false,
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'html.htmlPageName',
    ref: htmlPageName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Rid Position',
    key: 'ridPosition',
    type: 'string',
    value: ridPosition,
    required: false,
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'html.ridPosition',
    ref: ridPosition,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Rid Color',
    key: 'ridColor',
    type: 'string',
    value: ridColor,
    required: false,
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'html.ridColor',
    ref: ridColor,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
  {
    title: 'Created Date',
    key: 'createdDate',
    type: 'date',
    value: createdDate,
    required: false,
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'html.createdDate',
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
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'html.modifiedDate',
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
    disabled: true,
    radioOptions: [],
    options: [],
    label: 'html.status',
    ref: status,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    visibility: true,
  },
]
