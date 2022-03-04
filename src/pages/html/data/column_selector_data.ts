import { ref, computed } from 'vue'
import store from '/@src/stores/index'

export const columnDefaults = [
  {
    name: 'groupName',
    value: 'html.groupName',
  },
  {
    name: 'htmlPageName',
    value: 'html.htmlPageName',
  },
  {
    name: 'status',
    value: 'html.status',
  },
  {
    name: 'log',
    value: 'html.log',
  },
  {
    name: 'actions',
    value: {
      value: 'originPolicy.action',
      align: 'end',
    },
  },
]

const savedSelectedColumn = ref(store.getters.getHtmlColumnSelection)
export const appliedSelectedColumn = ref(
  savedSelectedColumn.value.length > 0
    ? savedSelectedColumn
    : ['groupName', 'htmlPageName', 'status', 'log', 'actions']
)

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
      title: 'Group',
      key: 'groupName',
      type: 'checkbox',
      value: 'groupName',
      radioOptions: [],
      options: [],
      label: 'html.groupName',
      ref: appliedSelectedColumn.value,
      visibility: true,
    },
    {
      required: false,
      disabled: false,
      title: 'HTML Page Name',
      key: 'htmlPageName',
      type: 'checkbox',
      value: 'htmlPageName',
      radioOptions: [],
      options: [],
      label: 'html.htmlPageName',
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
      label: 'html.status',
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
      label: 'html.log',
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
