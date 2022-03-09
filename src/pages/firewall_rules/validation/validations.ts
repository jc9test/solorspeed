import { ref } from 'vue'
import { inputAttributeUpdater as createFormAttributeUpdater } from '../data/create_firewall_rule_data'
import { inputAttributeUpdater as editFormAttributeUpdater } from '../data/edit_firewall_rule_data'
import { checkDocumentExist } from '/@src/api/documentexist'
import { ipValidate } from '/@src/api/formValidate'
import { createI18n } from '/@src/i18n'
import store from '/@src/stores/index'

//form v-model
const i18n = createI18n()

const { t } = i18n.global

const formInputsRef = ref()
const actionType = ref()
const errorCount = ref(0)
const errorLogs = ref([])

const attributeUpdater = ({ key, attributeName, value, errorMsg = '' }) => {
  if (value) {
    errorCount.value = errorCount.value + 1
    errorLogs.value = [...errorLogs.value, { key, error: value, errorMsg }]
  }
  if (actionType.value === 'create') {
    return createFormAttributeUpdater({ key, attributeName, value, errorMsg })
  } else if (actionType.value === 'edit') {
    return editFormAttributeUpdater({ key, attributeName, value, errorMsg })
  }
}

async function checkRuleName(ref: any) {
  const ruleName = ref.ruleName.value
  const groupName = store.state.queryGroupName
  const regex = /^[a-z0-9\_]*$/
  const err = { error: false, errorMsg: '' }
  if (!ruleName) {
    err.error = true
    err.errorMsg = 'filter.validation.required'
  }
  if (!regex.test(ruleName)) {
    err.error = true
    err.errorMsg = 'Invalid Name: Please make sure you exclude any special characters.'
  }
  if (ruleName?.length > 35) {
    err.error = true
    err.errorMsg = 'Invalid Name: Please make your name do not exceed 35 characters'
  }

  const option = {
    topic: 'wafRuleName',
    fieldVal: ruleName,
    groupName: groupName,
  }
  await checkDocumentExist(option).then((res) => {
    if (!res.data.success) {
      err.error = true
      err.errorMsg = ruleName + ` ${t('service.validate.validateExistText')}`
    }
  })

  return attributeUpdater({
    key: 'ruleName',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
// Start of Action Fields

function checkWafDenyHtmlPageName(ref: any) {
  const denyPage = ref.denyPage.value
  const err = { error: false, errorMsg: '' }
  if (ref.wafAction.value === '01') {
    if (!denyPage) {
      err.error = true
      err.errorMsg = 'filter.validation.required'
    }
  }
  return attributeUpdater({
    key: 'denyPage',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
function checkWafSpeedLimit(ref: any) {
  const wafSpeedLimit = ref.wafSpeedLimit.value
  const err = { error: false, errorMsg: '' }
  if (ref.wafAction.value === '05') {
    if (wafSpeedLimit < 1 || wafSpeedLimit > 102400) {
      err.error = true
      err.errorMsg = 'Invalid Speed Limit: Value must be within the range of  1 - 102400'
    }
  }

  return attributeUpdater({
    key: 'wafSpeedLimit',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
function checkWafRedirectUrl(ref: any) {
  const wafRedirectUrl = ref.wafRedirectUrl.value
  const err = { error: false, errorMsg: '' }
  if (ref.wafAction.value === '06') {
    if (!wafRedirectUrl) {
      err.error = true
      err.errorMsg = 'filter.validation.required'
    }
    if (
      ref.wafRedirectUrl.value.indexOf('http://') !== 0 &&
      ref.wafRedirectUrl.value.indexOf('https://') !== 0
    ) {
      err.error = true
      err.errorMsg = 'Invalid value! All urls must start with http:// or https://'
    }
  }
  return attributeUpdater({
    key: 'wafRedirectUrl',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
function checkWafRedirectHttpCode(ref: any) {
  const wafRedirectHttpCode = ref.wafRedirectHttpCode.value
  const err = { error: false, errorMsg: '' }
  if (ref.wafAction.value === '06') {
    if (!wafRedirectHttpCode) {
      err.error = true
      err.errorMsg = 'filter.validation.required'
    }
  }
  return attributeUpdater({
    key: 'wafRedirectHttpCode',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
function checkWafBucketTime(ref: any) {
  const wafBucketTime = ref.wafBucketTime.value
  const err = { error: false, errorMsg: '' }
  if (ref.wafAction.value === '08') {
    if (wafBucketTime < 5 || wafBucketTime > 3600) {
      err.error = true
      err.errorMsg = 'Invalid Speed Limit: Value must be within the range of  5 - 3600'
    }
  }
  return attributeUpdater({
    key: 'wafBucketTime',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
// function checkWafSetReqHeaders(ref: any) {
//   const requestType = 'Set Request Header'

//   if (!ref.wafSetReqHeaders.value) {
//     if (requestType === 'Set Request Header' && ref.wafAction.value === '09') {
//       return attributeUpdater({
//         key: 'wafSetReqHeaders',
//         attributeName: 'error',
//         value: true,
//       })
//     } else {
//       return attributeUpdater({
//         key: 'wafSetReqHeaders',
//         attributeName: 'error',
//         value: false,
//       })
//     }
//   }
// }
// function checkWafSetResHeaders(ref: any) {
//   if (!ref.wafSetResHeaders.value) {
//     if (ref.wafAction.value === '10') {
//       return attributeUpdater({
//         key: 'wafSetResHeaders',
//         attributeName: 'error',
//         value: true,
//       })
//     } else {
//       return attributeUpdater({
//         key: 'wafSetResHeaders',
//         attributeName: 'error',
//         value: false,
//       })
//     }
//   }
// }
function checkWafCustomHtmlPageName(ref: any) {
  const wafCustomHtmlPageName = ref.wafCustomHtmlPageName.value
  const err = { error: false, errorMsg: '' }

  if (ref.wafAction.value === '12') {
    if (!wafCustomHtmlPageName) {
      err.error = true
      err.errorMsg = 'filter.validation.required'
    }
  }
  return attributeUpdater({
    key: 'wafCustomHtmlPageName',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
function checkWafOriginPolicyName(ref: any) {
  const wafOriginPolicyName = ref.wafOriginPolicyName.value
  const err = { error: false, errorMsg: '' }
  if (ref.wafAction.value === '13') {
    if (!wafOriginPolicyName) {
      err.error = true
      err.errorMsg = 'filter.validation.required'
    }
  }
  return attributeUpdater({
    key: 'wafOriginPolicyName',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}

// End of Action Fields

// Start of Identity Fields

async function checkWafIp(ref: any) {
  const wafIp = ref.wafIp.value
  const err = { error: false, errorMsg: '' }
  const tempArray = wafIp.split('\n').filter((e) => e != '')
  const _sourceIp: Array<any> = []
  for (const element of tempArray) {
    if (!_sourceIp.includes(element)) {
      _sourceIp.push(element)
    } else {
      err.error = true
      err.errorMsg = t('waf.validation.duplicate') + element
    }
  }
  if (!err.error) {
    const response = await ipValidate('network', _sourceIp).then((res) => res)
    if (response.data.success) {
      err.error = false
    } else {
      err.error = true
      err.errorMsg = response.data.message
    }
  }
  return attributeUpdater({
    key: 'wafIp',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
// function checkWafUri(ref: any) {
//   const wafUri = ref.wafUri.value
//   const err = { error: false, errorMsg: '' }
//   // if (!wafUri) {
//   //   err.error = true
//   //   err.errorMsg = 'filter.validation.required'
//   // }
//   return attributeUpdater({
//     key: 'wafUri',
//     attributeName: 'error',
//     value: err.error,
//     errorMsg: err.errorMsg,
//   })
// }
// function checkWafHeaders(ref: any) {
//   const wafHeaders = ref.wafHeaders.value
//   const err = { error: false, errorMsg: '' }
//   // if (!wafHeaders) {
//   //   err.error = true
//   //   err.errorMsg = 'filter.validation.required'
//   // }
//   return attributeUpdater({
//     key: 'wafHeaders',
//     attributeName: 'error',
//     value: err.error,
//     errorMsg: err.errorMsg,
//   })
// }
// function checkWafHeadersNotExist(ref: any) {
//   const wafHeadersNotExist = ref.wafHeadersNotExist.value
//   const err = { error: false, errorMsg: '' }
//   // if (!wafHeadersNotExist) {
//   //   err.error = true
//   //   err.errorMsg = 'filter.validation.required'
//   // }
//   return attributeUpdater({
//     key: 'wafHeadersNotExist',
//     attributeName: 'error',
//     value: err.error,
//     errorMsg: err.errorMsg,
//   })
// }
// function checkWafIsp(ref: any) {
//   const wafIsp = ref.wafIsp.value
//   const err = { error: false, errorMsg: '' }
//   if (!wafIsp) {
//     err.error = true
//     err.errorMsg = 'filter.validation.required'
//   }
//   return attributeUpdater({
//     key: 'wafIsp',
//     attributeName: 'error',
//     value: err.error,
//     errorMsg: err.errorMsg,
//   })
// }
// function checkOriginPage(ref: any) {
//   if (!ref.wafruleName.value) {
//     if (ref.wafAction.value === '13') {
//       return attributeUpdater({
//         key: 'wafruleName',
//         attributeName: 'error',
//         value: false,
//       })
//     } else {
//       return attributeUpdater({
//         key: 'wafruleName',
//         attributeName: 'error',
//         value: false,
//       })
//     }
//   } else
//     return attributeUpdater({
//       key: 'wafruleName',
//       attributeName: 'error',
//       value: false,
//     })
// }
// function checkWafProxyType(ref: any) {
//   const wafProxyType = ref.wafProxyType.value
//   const err = { error: false, errorMsg: '' }
//   if (!wafProxyType) {
//     err.error = true
//     err.errorMsg = 'filter.validation.required'
//   }
//   return attributeUpdater({
//     key: 'wafProxyType',
//     attributeName: 'error',
//     value: err.error,
//     errorMsg: err.errorMsg,
//   })
// }

// End of Identity Fields

// Start of Owasp Fields

// function checkWafHttpMethod(ref: any) {
//   const wafHttpMethod = ref.wafHttpMethod.value
//   const err = { error: false, errorMsg: '' }
//   if (!wafHttpMethod) {
//     err.error = true
//     err.errorMsg = 'filter.validation.required'
//   }
//   return attributeUpdater({
//     key: 'wafHttpMethod',
//     attributeName: 'error',
//     value: err.error,
//     errorMsg: err.errorMsg,
//   })
// }
function checkWafRate(ref: any) {
  const wafRate = ref.wafRate.value
  const err = { error: false, errorMsg: '' }

  const rate = wafRate ? wafRate.split('/') : []

  const hit = rate[0]
  const second = rate[1]

  const numRegex = /^[0-9]*$/

  if (rate.length) {
    if (!hit || !second) {
      err.error = true
      err.errorMsg = 'Wrong Format: request rate should be hit/second'
    } else {
      if (!numRegex.test(hit) || !numRegex.test(second)) {
        err.error = true
        err.errorMsg = 'hit and second should be a number!'
      }
    }
  }

  return attributeUpdater({
    key: 'wafRate',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
// function checkWafOwasp(ref: any) {
//   const wafOwasp = ref.wafOwasp.value
//   const err = { error: false, errorMsg: '' }
//   if (!wafOwasp) {
//     err.error = true
//     err.errorMsg = 'filter.validation.required'
//   }
//   return attributeUpdater({
//     key: 'wafOwasp',
//     attributeName: 'error',
//     value: err.error,
//     errorMsg: err.errorMsg,
//   })
// }
async function checkWafIpExclude(ref: any) {
  const wafIpExclude = ref.wafIpExclude.value
  const err = { error: false, errorMsg: '' }
  const tempArray = wafIpExclude ? wafIpExclude.split('\n').filter((e) => e != '') : []
  const _sourceIp: Array<any> = []
  for (const element of tempArray) {
    if (!_sourceIp.includes(element)) {
      _sourceIp.push(element)
    } else {
      err.error = true
      err.errorMsg = t('waf.validation.duplicate') + element
    }
  }
  if (!err.error) {
    const response = await ipValidate('network', _sourceIp).then((res) => res)
    if (response.data.success) {
      err.error = false
    } else {
      err.error = true
      err.errorMsg = response.data.message
    }
  }

  return attributeUpdater({
    key: 'wafIpExclude',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
// function checkWafUriExclude(ref: any) {
//   const wafUriExclude = ref.wafUriExclude.value
//   const regex = /^[a-z0-9\_]*$/
//   const err = { error: false, errorMsg: '' }
//   if (!wafUriExclude) {
//     err.error = true
//     err.errorMsg = 'filter.validation.required'
//   }
//   if (!regex.test(wafUriExclude)) {
//     err.error = true
//     err.errorMsg = 'Invalid Name: Please make sure you exclude any special characters.'
//   }
//   if (wafUriExclude?.length > 35) {
//     err.error = true
//     err.errorMsg = 'Invalid Name: Please make your name do not exceed 35 characters'
//   }
//   return attributeUpdater({
//     key: 'wafUriExclude',
//     attributeName: 'error',
//     value: err.error,
//     errorMsg: err.errorMsg,
//   })
// }
// function checkWafHeadersExclude(ref: any) {
//   const wafHeadersExclude = ref.wafHeadersExclude.value
//   const regex = /^[a-z0-9\_]*$/
//   const err = { error: false, errorMsg: '' }
//   if (!wafHeadersExclude) {
//     err.error = true
//     err.errorMsg = 'filter.validation.required'
//   }
//   if (!regex.test(wafHeadersExclude)) {
//     err.error = true
//     err.errorMsg = 'Invalid Name: Please make sure you exclude any special characters.'
//   }
//   if (wafHeadersExclude?.length > 35) {
//     err.error = true
//     err.errorMsg = 'Invalid Name: Please make your name do not exceed 35 characters'
//   }
//   return attributeUpdater({
//     key: 'wafHeadersExclude',
//     attributeName: 'error',
//     value: err.error,
//     errorMsg: err.errorMsg,
//   })
// }

// End of Owasp Fields

// Start of Special Fields

// export function checkWafCountry(ref: any) {
//   const wafCountry = ref.wafCountry.value
//   const err = { error: false, errorMsg: '' }
//   // if (!wafCountry) {
//   //   err.error = true
//   //   err.errorMsg = 'filter.validation.required'
//   // }
//   return attributeUpdater({
//     key: 'country',
//     attributeName: 'error',
//     value: err.error,
//     errorMsg: err.errorMsg,
//   })
// }

// End of Special Fields

// Start of Impored Validtors

function checkRequestHeader(ref: any, requestType: string) {
  let key = ''
  const prohibitedKeys = [
    'x-forwarded-for',
    'x-forwarded-proto',
    'true-client-ip',
    'rid',
    'c-type',
    'host',
    'connection',
    'if-modified-since',
    'if-unmodified-since',
    'if-match',
    'if-none-match',
    'user-agent',
    'referer',
    'content-length',
    'content-range',
    'content-type',
    'range',
    'if-range',
    'transfer-encoding',
    'te',
    'expect',
    'upgrade',
    'accept-encoding',
    'via',
    'authorization',
    'keep-alive',
    'x-forwarded-for',
    'x-real-ip',
    'accept',
    'accept-language',
    'depth',
    'destination',
    'overwrite',
    'date',
    'cookie',
  ]

  switch (requestType) {
    case 'Set Request Header':
      key = 'wafSetReqHeaders'
      break
    case 'Request Header':
      key = 'wafHeaders'
      break
    case 'Not Request Header':
      key = 'wafHeadersExclude'
      break
    default:
      break
  }
  const refHeader = ref[key].value
  const err = { error: false, errorMsg: '', key }

  // console.log({ action: `configuring ${key}`, refHeader })

  if (key === 'wafSetReqHeaders' && ref.wafAction.value === '09') {
    if (!refHeader) {
      err.error = true
      err.errorMsg = `filter.validation.required`
    }
  }

  const headersArray = refHeader ? refHeader.split('\n') : []
  headersArray.forEach((e) => {
    const headerKeyVal = e.split(':')
    const headerKey = headerKeyVal[0]
    const headerVal = headerKeyVal[1]

    if (!headerKey || !headerVal) {
      err.error = true
      err.errorMsg = `Invalid Input: ${e}`
    }

    if (prohibitedKeys.includes(headerKey.toLowerCase())) {
      err.error = true
      err.errorMsg = `Invalid Key: ${e}`
    }

    if (/[\'\"]/.test(e)) {
      err.error = true
      err.errorMsg = `Invalid Input: ${e}`
    }
  })

  return attributeUpdater({
    key: err.key,
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}

function checkResponseHeader(ref: any) {
  const prohibitedKeys = [
    'status',
    'content-type',
    'content-length',
    'date',
    'last-modified',
    'etag',
    'server',
    'www-authenticate',
    'location',
    'refresh',
    'set-cookie',
    'content-disposition',
    'cache-control',
    'expires',
    'accept-ranges',
    'content-range',
    'connection',
    'keep-alive',
    'vary',
    'link',
    'x-accel-expires',
    'x-accel-redirect',
    'x-accel-limit-rate',
    'x-accel-buffering',
    'x-accel-charset',
    'transfer-encoding',
    'content-encoding',
  ]

  const wafSetResHeaders = ref.wafSetResHeaders.value
  const err = { error: false, errorMsg: '' }

  // console.log({ action: `configuring wafSetResHeaders`, wafSetResHeaders })
  const headersArray = wafSetResHeaders ? wafSetResHeaders.split('\n') : []
  if (!wafSetResHeaders && ref.wafAction.value === '10') {
    err.error = true
    err.errorMsg = `filter.validation.required`
  }
  headersArray.forEach((e) => {
    const headerKeyVal = e.split(':')
    const headerKey = headerKeyVal[0]
    const headerVal = headerKeyVal[1]

    if (!headerKey || !headerVal) {
      err.error = true
      err.errorMsg = `Invalid Input: ${e}`
    }

    if (prohibitedKeys.includes(headerKey.toLowerCase())) {
      err.error = true
      err.errorMsg = `Invalid Key: ${e}`
    }

    if (/[\'\"]/.test(e)) {
      err.error = true
      err.errorMsg = `Invalid Input: ${e}`
    }
  })
  return attributeUpdater({
    key: 'wafSetResHeaders',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}

// End of Impored Validtors

export async function checkFormValidation(formReferences: any, action) {
  actionType.value = action

  // checkFileExist(ruleName.value, groupName.value)

  if (action === 'create') {
    formInputsRef.value = await checkRuleName(formReferences)
  }
  formInputsRef.value = checkWafCustomHtmlPageName(formReferences)
  formInputsRef.value = checkWafDenyHtmlPageName(formReferences)
  formInputsRef.value = checkWafOriginPolicyName(formReferences)
  formInputsRef.value = checkWafBucketTime(formReferences)
  formInputsRef.value = checkWafSpeedLimit(formReferences)
  formInputsRef.value = checkWafRedirectHttpCode(formReferences)
  formInputsRef.value = await checkWafIp(formReferences)
  formInputsRef.value = await checkWafIpExclude(formReferences)
  formInputsRef.value = checkWafRate(formReferences)
  formInputsRef.value = checkRequestHeader(formReferences, 'Set Request Header')
  formInputsRef.value = checkResponseHeader(formReferences)

  formInputsRef.value = checkWafRedirectUrl(formReferences)
  formInputsRef.value = checkRequestHeader(formReferences, 'Request Header')
  formInputsRef.value = checkRequestHeader(formReferences, 'Not Request Header')

  const output = { formInputs: formInputsRef.value, isFormValid: !errorCount.value }
  // reset errorCount
  console.log({ action: 'getting error logs', log: errorLogs.value })
  errorCount.value = 0
  errorLogs.value = []
  return output
}
