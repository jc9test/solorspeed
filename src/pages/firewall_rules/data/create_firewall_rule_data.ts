import { ref, watch } from 'vue'
import store from '/@src/stores/index'
import { getFormOptions } from '/@src/api/formOptions'

//form v-model

const groupName = ref(store.state.queryGroupName)
const ruleName = ref()
const wafAction = ref('00')
const wafDenyHtmlPageName = ref()
const denyPage = ref()
const blockPeriodDenyPage = ref('default')
const wafOriginPolicyName = ref()
const wafBucketTime = ref(300)
const wafSpeedLimit = ref(10240)
const wafRedirectUrl = ref()
const wafRedirectHttpCode = ref('302')
const wafSetReqHeaders = ref()
const wafSetResHeaders = ref()
const wafCustomHtmlPageName = ref()
const wafCountry = ref()
const wafIp = ref('0.0.0.0/0')
const wafUri = ref()
const wafHeaders = ref()
const wafIsp = ref()
const wafHttpMethod = ref()
const wafRate = ref()
const wafOwasp = ref()
const wafIpExclude = ref()
const wafUriExclude = ref()
const wafHeadersExclude = ref()
const wafHeadersNotExist = ref()
const wafProxyType = ref()
const description = ref()
const wafruleId = ref()
const usedByFQDNConfigLength = ref()

export const resetToDefault = (resetOtherRefs: Function) => {
  groupName.value = store.state.queryGroupName
  ruleName.value = undefined
  wafAction.value = '00'
  wafDenyHtmlPageName.value = undefined
  denyPage.value = undefined
  blockPeriodDenyPage.value = 'default'
  wafOriginPolicyName.value = undefined
  wafBucketTime.value = 300
  wafSpeedLimit.value = 10240
  wafRedirectUrl.value = undefined
  wafRedirectHttpCode.value = '302'
  wafSetReqHeaders.value = undefined
  wafSetResHeaders.value = undefined
  wafCustomHtmlPageName.value = undefined
  wafCountry.value = undefined
  wafIp.value = '0.0.0.0/0'
  wafUri.value = undefined
  wafHeaders.value = undefined
  wafIsp.value = undefined
  wafHttpMethod.value = undefined
  wafRate.value = undefined
  wafOwasp.value = undefined
  wafIpExclude.value = undefined
  wafUriExclude.value = undefined
  wafHeadersExclude.value = undefined
  wafHeadersNotExist.value = undefined
  wafProxyType.value = undefined
  description.value = undefined
  wafruleId.value = undefined
  usedByFQDNConfigLength.value = undefined
  resetOtherRefs()
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

export const addFirewallRule = async () => {
  try {
    const newFirewallRule = renderSubmitValues()
    console.log(newFirewallRule)
  } catch (err) {
    console.log(err)
  }
}

const fetchPagesOptions = (groupNames, action) => {
  let withDefault = true
  let pageKey = ''
  if (action === '12') {
    withDefault = false
  }

  switch (action) {
    case '01':
      pageKey = 'denyPage'
      break
    case '08':
      pageKey = 'blockPeriodDenyPage'
      break
    case '12':
      pageKey = 'wafCustomHtmlPageName'
      break
    default:
      break
  }

  return {
    promise: getFormOptions(
      `htmlpagenames?wafAction=${action}&groupNames=${groupNames}&htmlPageName=***&withDefault=${withDefault}`
    ),
    pageKey,
  }
}

export const fetchFormOptions = async () => {
  const groupNames = 604

  const denyObject = fetchPagesOptions(groupNames, '01')
  const blockObject = fetchPagesOptions(groupNames, '08')
  const htmlObject = fetchPagesOptions(groupNames, '12')

  const denyPromise = denyObject.promise
  const blockPromise = blockObject.promise
  const htmlPromise = htmlObject.promise
  const groupPromise = getFormOptions(`groupnames`)
  const actionPromise = getFormOptions(`/wafactions?actionName=***`)
  const policyPromise = getFormOptions(
    `originpolicynames?wafAction=${13}&groupNames=${groupNames}&originPolicyName=***`
  )
  const httpPromise = getFormOptions(`redirect-http-code?codeName=***`)

  const responses = await Promise.all([
    denyPromise,
    blockPromise,
    htmlPromise,
    groupPromise,
    actionPromise,
    policyPromise,
    httpPromise,
  ])

  inputAttributeUpdater({
    key: denyObject.pageKey,
    attributeName: 'options',
    value: responses[0].data.options,
  })
  inputAttributeUpdater({
    key: blockObject.pageKey,
    attributeName: 'options',
    value: responses[1].data.options,
  })
  inputAttributeUpdater({
    key: htmlObject.pageKey,
    attributeName: 'options',
    value: responses[2].data.options,
  })

  inputAttributeUpdater({
    key: 'groupName',
    attributeName: 'options',
    value: responses[3].data.options,
  })

  inputAttributeUpdater({
    key: 'wafOriginPolicyName',
    attributeName: 'options',
    value: responses[5].data.options,
  })

  inputAttributeUpdater({
    key: 'wafRedirectHttpCode',
    attributeName: 'options',
    value: responses[6].data.options,
  })
  return formInputs

  // await getFormOptions(`/wafactions?actionName=***`).then((res) => {
  //   const wafAction = res.data.options.value.map((option) => {
  //     return {
  //       value: option.value,
  //       label: option.label,
  //     }
  //   })

  //   formInput.value = props.attributeUpdater({
  //     key: 'wafOriginPolicyName',
  //     attributeName: 'options',
  //     value: wafAction,
  //   })
  // })
}

export const formReferences = {
  groupName,
  ruleName,
  wafAction,
  wafDenyHtmlPageName,
  denyPage,
  blockPeriodDenyPage,
  wafOriginPolicyName,
  wafBucketTime,
  wafSpeedLimit,
  wafRedirectUrl,
  wafRedirectHttpCode,
  wafSetReqHeaders,
  wafSetResHeaders,
  wafCustomHtmlPageName,
  wafCountry,
  wafIp,
  wafUri,
  wafHeaders,
  wafIsp,
  wafHttpMethod,
  wafRate,
  wafOwasp,
  wafIpExclude,
  wafUriExclude,
  wafHeadersExclude,
  wafHeadersNotExist,
  wafProxyType,
  description,
  wafruleId,
  usedByFQDNConfigLength,
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
  placeholder: string
  error?: Boolean
  errorMsg?: string
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
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Group Name',
    key: 'groupName',
    type: 'multiselect',
    mode: 'single',
    value: groupName,
    required: true,
    disabled: true,
    radioOptions: [{}],
    options: [{ label: '604', value: '604' }],
    label: 'waf.groupName',
    ref: groupName,
    questionTooltip: true,
    tooltip: 'waf.tooltip.group_name',
    placeholder: 'filter.select_group',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Rule Name',
    key: 'ruleName',
    type: 'string',
    mode: '',
    value: ruleName,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.ruleName',
    ref: ruleName,
    questionTooltip: true,
    tooltip: 'waf.tooltip.rule_name',
    placeholder: 'waf.ruleName',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Action',
    key: 'wafAction',
    type: 'multiselect',
    mode: 'single',
    value: wafAction,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [
      { value: '00', label: 'Allow' },
      { value: '01', label: 'Deny' },
      { value: '03', label: 'Gesture' },
      { value: '04', label: 'Log' },
      { value: '05', label: 'Speed' },
      { value: '06', label: 'Redirect' },
      { value: '07', label: 'Cookie' },
      { value: '08', label: 'Period' },
      { value: '09', label: 'Request Headers' },
      { value: '10', label: 'Response Headers' },
      { value: '11', label: 'Log Only' },
      { value: '12', label: 'Custom Page' },
      { value: '13', label: 'OriginPolicy' },
      { value: '14', label: 'Smart Captcha' },
    ],
    label: 'waf.wafAction',
    ref: wafAction,
    questionTooltip: true,
    tooltip: 'waf.tooltip.waf_action',
    placeholder: 'waf.wafAction',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
    publisher: true,
  },
  {
    title: 'Deny HTML Page Name',
    key: 'denyPage',
    type: 'multiselect',
    mode: 'single',
    value: denyPage,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafDenyHtmlPageName',
    ref: denyPage,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'filter.select_deny_page',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: {
      observing: 'wafAction',
      value: '01',
      condition: 'equals',
    },
    visibility: true,
  },
  {
    title: 'Deny HTML Page Name',
    key: 'blockPeriodDenyPage',
    type: 'multiselect',
    mode: 'single',
    value: blockPeriodDenyPage,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafDenyHtmlPageName',
    ref: blockPeriodDenyPage,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'filter.select_deny_page',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: {
      observing: 'wafAction',
      value: '08',
      condition: 'equals',
    },
    visibility: true,
  },
  {
    title: 'Speed Limit',
    key: 'wafSpeedLimit',
    type: 'number',
    mode: '',
    value: wafSpeedLimit,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafSpeedLimit',
    ref: wafSpeedLimit,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: {
      observing: 'wafAction',
      value: '05',
      condition: 'equals',
    },
    visibility: true,
  },
  {
    title: 'Redirect Url',
    key: 'wafRedirectUrl',
    type: 'string',
    mode: '',
    value: wafRedirectUrl,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafRedirectUrl',
    ref: wafRedirectUrl,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: {
      observing: 'wafAction',
      value: '06',
      condition: 'equals',
    },
    visibility: true,
  },

  {
    title: 'Redirect HTTP Code',
    key: 'wafRedirectHttpCode',
    type: 'multiselect',
    mode: 'single',
    value: wafRedirectHttpCode,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafRedirectHttpCode',
    ref: wafRedirectHttpCode,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: {
      observing: 'wafAction',
      value: '06',
      condition: 'equals',
    },
    visibility: true,
  },

  {
    title: 'Block Period',
    key: 'wafBucketTime',
    type: 'number',
    mode: '',
    value: wafBucketTime,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafBucketTime',
    ref: wafBucketTime,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: {
      observing: 'wafAction',
      value: '08',
      condition: 'equals',
    },
    visibility: true,
  },

  {
    title: 'Set Request Headers',
    key: 'wafSetReqHeaders',
    type: 'textarea',
    mode: '',
    value: wafSetReqHeaders,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafSetReqHeaders',
    ref: wafSetReqHeaders,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'my-ip-header:$rip',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: {
      observing: 'wafAction',
      value: '09',
      condition: 'equals',
    },
    visibility: true,
  },

  {
    title: 'Set Response Headers',
    key: 'wafSetResHeaders',
    type: 'textarea',
    mode: '',
    value: wafSetResHeaders,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafSetResHeaders',
    ref: wafSetResHeaders,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'access-control-allow-origin:mydomain.com',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: {
      observing: 'wafAction',
      value: '10',
      condition: 'equals',
    },
    visibility: true,
  },

  {
    title: 'Html Page',
    key: 'wafCustomHtmlPageName',
    type: 'multiselect',
    mode: 'single',
    value: wafCustomHtmlPageName,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafCustomHtmlPageName',
    ref: wafCustomHtmlPageName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: {
      observing: 'wafAction',
      value: '12',
      condition: 'equals',
    },
    visibility: true,
  },

  {
    title: 'Origin Policy',
    key: 'wafOriginPolicyName',
    type: 'multiselect',
    mode: 'single',
    value: wafOriginPolicyName,
    required: true,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafOriginPolicyName',
    ref: wafOriginPolicyName,
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: {
      observing: 'wafAction',
      value: '13',
      condition: 'equals',
    },
    visibility: true,
  },
  // end
  {
    title: 'Description',
    key: 'description',
    type: 'textarea',
    mode: '',
    value: description,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.description',
    ref: description,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'Your message',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  //section two
  {
    title: 'Condition - Identity',
    key: 'conditionIdentity',
    type: 'onlyLabels',
    mode: '',
    value: '',
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.sections.conditionIdentity',
    ref: '',
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  {
    title: 'Source IP',
    key: 'wafIp',
    type: 'textarea',
    mode: '',
    value: wafIp,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafIp',
    ref: wafIp,
    questionTooltip: true,
    tooltip: 'waf.tooltip.wafIp',
    placeholder: '0.0.0.0/0',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  {
    title: 'Request URI',
    key: 'wafUri',
    type: 'textarea',
    mode: '',
    value: wafUri,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafUri',
    ref: wafUri,
    questionTooltip: true,
    tooltip: 'waf.tooltip.requestUrl',
    placeholder: '/api/secret$\n/assets$',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  {
    title: 'Request Header',
    key: 'wafHeaders',
    type: 'textarea',
    mode: '',
    value: wafHeaders,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafHeaders',
    ref: wafHeaders,
    questionTooltip: true,
    tooltip: 'waf.tooltip.requestHeader',
    placeholder: 'user-agent: Bad Agent$\nhost:mysite.com$\nreferer:^(?!^mysite.com$)',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  {
    title: 'Request Headers Not Exist',
    key: 'wafHeadersNotExist',
    type: 'textarea',
    mode: '',
    value: wafHeadersNotExist,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafHeadersNotExist',
    ref: wafHeadersNotExist,
    questionTooltip: true,
    tooltip: 'waf.tooltip.requestHeaderNotExist',
    placeholder: 'user Agent\nhost',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  // {
  //   title: 'Source Country',
  //   key: 'wafCountry',
  //   type: 'multiselect',
  //   mode: 'tags',
  //   value: wafCountry,
  //   required: false,
  //   disabled: false,
  //   radioOptions: [{}],
  //   options: [
  //     { value: '20000_http_violation', label: 'http_violation' },
  //     { value:wafCountry', label: 'http_anomaly' },
  //     { value: '35000_user_agent', label: 'user_agent' },
  //     { value: '40000_generic_attack', label: 'generic_attack' },
  //     { value: '41000_sqli', label: 'sqli' },
  //     { value: '42000_xss', label: 'xss' },
  //   ],
  //   label: 'waf.wafCountry'),  //   ref: country,
  //   questionTooltip: true,
  //   tooltip: 'waf.tooltip.sourceCountry'),  //   placeholder: '',
  //   conditional_visibility: undefined,
  // },

  {
    title: 'ISP',
    key: 'wafIsp',
    type: 'textarea',
    mode: '',
    value: wafIsp,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafIsp',
    ref: wafIsp,
    questionTooltip: false,
    tooltip: '',
    placeholder: 'Target Telecom Co Ltd.\nMy Other ISP',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  {
    title: 'Proxy Type',
    key: 'wafProxyType',
    type: 'multiselect',
    mode: 'tags',
    value: wafProxyType,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [
      { value: 'vpn', label: 'VPN' },
      { value: 'tor', label: 'TOR' },
      { value: 'dch', label: 'DCH' },
      { value: 'pub', label: 'PUB' },
      { value: 'web', label: 'WEB' },
      { value: 'ces', label: 'CES' },
    ],
    label: 'waf.wafProxyType',
    ref: wafProxyType,
    questionTooltip: true,
    tooltip: 'waf.tooltip.proxyType',
    placeholder: 'Select',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },
  //section three
  {
    title: 'Condition - Behavior',
    key: 'conditionBehavior',
    type: 'onlyLabels',
    mode: '',
    value: '',
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.sections.conditionBehavior',
    ref: '',
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },
  {
    title: 'Request Method',
    key: 'wafHttpMethod',
    type: 'multiselect',
    mode: 'tags',
    value: wafHttpMethod,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [
      { value: 'get', label: 'GET' },
      { value: 'post', label: 'POST' },
      { value: 'purge', label: 'PURGE' },
      { value: 'put', label: 'PUT' },
      { value: 'head', label: 'HEAD' },
      { value: 'options', label: 'OPTIONS' },
      { value: 'delete', label: 'DELETE' },
      { value: 'patch', label: 'PATCH' },
    ],
    label: 'waf.wafHttpMethod',
    ref: wafHttpMethod,
    questionTooltip: true,
    tooltip: 'waf.tooltip.requestMethod',
    placeholder: 'Select',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  {
    title: 'Request Rate',
    key: 'wafRate',
    type: 'string',
    mode: '',
    value: wafRate,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafRate',
    ref: wafRate,
    questionTooltip: true,
    tooltip: 'waf.tooltip.requestRate',
    placeholder: 'hits/seconds',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  // section four
  {
    title: 'Condition - Owasp',
    key: 'conditionOwasp',
    type: 'onlyLabels',
    mode: '',
    value: '',
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.sections.conditionOwasp',
    ref: '',
    questionTooltip: false,
    tooltip: '',
    placeholder: '',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  {
    title: 'Owasp',
    key: 'wafOwasp',
    type: 'multiselect',
    mode: 'tags',
    value: wafOwasp,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [
      { value: '20000_http_violation', label: 'http_violation' },
      { value: '21000_http_anomaly', label: 'http_anomaly' },
      { value: '35000_user_agent', label: 'user_agent' },
      { value: '40000_generic_attack', label: 'generic_attack' },
      { value: '41000_sqli', label: 'sqli' },
      { value: '42000_xss', label: 'xss' },
    ],
    label: 'waf.wafOwasp',
    ref: wafOwasp,
    questionTooltip: true,
    tooltip: 'waf.tooltip.owasp',
    placeholder: 'Select',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  // section five

  {
    title: 'Not Source IP',
    key: 'wafIpExclude',
    type: 'textarea',
    mode: '',
    value: wafIpExclude,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafIpExclude',
    ref: wafIpExclude,
    questionTooltip: true,
    tooltip: 'waf.tooltip.notWafIP',
    placeholder: 'A.B.C.D/netmask\nA.B.C.D/netmask',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  {
    title: 'Not Request URI',
    key: 'wafUriExclude',
    type: 'textarea',
    mode: '',
    value: wafUriExclude,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafUriExclude',
    ref: wafUriExclude,
    questionTooltip: true,
    tooltip: 'waf.tooltip.notRequestUrl',
    placeholder: '/api/secret$\n/assets$',
    error: false,
    errorMsg: 'filter.validation.required',
    conditional_visibility: undefined,
    visibility: true,
  },

  {
    title: 'Not Request Headers',
    key: 'wafHeadersExclude',
    type: 'textarea',
    mode: '',
    value: wafHeadersExclude,
    required: false,
    disabled: false,
    radioOptions: [{}],
    options: [{}],
    label: 'waf.wafHeadersExclude',
    ref: wafHeadersExclude,
    questionTooltip: true,
    tooltip: 'waf.tooltip.notRequestHeader',
    placeholder: 'user-agent:Good Agents$\nhost:mysite.com$\nreferer:^(?!^mysite.com$)',
    error: false,
    errorMsg: 'filter.validation.required',
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
//   value: key,
//   required: false,
//   disabled: false,
//   radioOptions: [{}],
//   options: [{}],
//   label: 'page.label',
//   ref: key,
//   questionTooltip: false,
//   tooltip: '',
//   placeholder: '',
// },notRequestHeaders
