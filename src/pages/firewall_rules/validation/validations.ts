import { ref } from 'vue'
import { inputAttributeUpdater as createFormAttributeUpdater } from '../data/create_firewall_rule_data'
import { inputAttributeUpdater as editFormAttributeUpdater } from '../data/edit_firewall_rule_data'

const formInputsRef = ref()
const actionType = ref()
const errorCount = ref(0)

const attributeUpdater = ({ key, attributeName, value, errorMsg = '' }) => {
  if (value) {
    errorCount.value = errorCount.value + 1
  }
  if (actionType.value === 'create') {
    return createFormAttributeUpdater({ key, attributeName, value, errorMsg })
  } else if (actionType.value === 'edit') {
    return editFormAttributeUpdater({ key, attributeName, value, errorMsg })
  }
}

//source ip validate
// function checkSourceIpValidate(ref: any) {
//   console.log('checkSourceIpValidate')
//   const tempArray = ref.wafIp.value.split('\n').filter((e) => e != '')
//   type srcIP = Array<String>
//   const _sourceIp: srcIP = []
//   for (const element of tempArray) {
//     if (!_sourceIp.includes(element)) {
//       _sourceIp.push(element)
//     } else {
//       return attributeUpdater({
//         key: 'wafIp',
//         attributeName: 'error',
//         value: true,
//         errorMsg: ` ${t('waf.validation.duplicate')}` + element,
//       })
//     }
//   }
//   ipValidate('network', _sourceIp).then((res) => {
//     if (res.data.success === true) {
//       isSourceIpValid.value = res.data.success
//     } else {
//       isSourceIpValid.value = res.data.success
//       ipSourceIpValidMsg.value = res.data.message
//     }
//   })
//   console.log('checkRedirectUrl')
// }

//redirect url
function checkRedirectUrl(ref: any) {
  //   console.log('checkRedirectUrl')
  if (!ref.wafRedirectUrl.value) {
    if (ref.wafAction.value === '06') {
      return attributeUpdater({
        key: 'wafRedirectUrl',
        attributeName: 'error',
        value: true,
      })
    } else {
      return attributeUpdater({
        key: 'wafRedirectUrl',
        attributeName: 'error',
        value: false,
      })
    }
  }

  if (
    ref.wafRedirectUrl.value.indexOf('http://') === 0 ||
    ref.wafRedirectUrl.value.indexOf('https://') === 0
  ) {
    return attributeUpdater({
      key: 'wafRedirectUrl',
      attributeName: 'error',
      value: false,
    })
  } else {
    return attributeUpdater({
      key: 'wafRedirectUrl',
      attributeName: 'error',
      value: true,
      errorMsg: 'Invalid value! All urls must start with http:// or https://',
    })
  }
}

//check request header
function checkRequestHeader(ref: any) {
  //   console.log('checkRequestHeader')
  const requestType = 'Set Request Header'

  if (!ref.wafSetReqHeaders.value) {
    if (requestType === 'Set Request Header' && ref.wafAction.value === '09') {
      return attributeUpdater({
        key: 'wafSetReqHeaders',
        attributeName: 'error',
        value: true,
      })
    } else {
      return attributeUpdater({
        key: 'wafSetReqHeaders',
        attributeName: 'error',
        value: false,
      })
    }
  }
}

//check response header
function checkResponseHeader(ref: any) {
  //   console.log('checkResponseHeader')
  // validate emptyness
  if (!ref.wafSetResHeaders.value) {
    if (ref.wafAction.value === '10') {
      return attributeUpdater({
        key: 'wafSetResHeaders',
        attributeName: 'error',
        value: true,
      })
    } else {
      return attributeUpdater({
        key: 'wafSetResHeaders',
        attributeName: 'error',
        value: false,
      })
    }
  }
}

//check html page
function checkHtmlPage(ref: any) {
  //   console.log('checkHtmlPage')
  if (!ref.wafCustomHtmlPageName.value) {
    if (ref.wafAction.value === '12') {
      return attributeUpdater({
        key: 'wafCustomHtmlPageName',
        attributeName: 'error',
        value: false,
      })
    } else {
      return attributeUpdater({
        key: 'wafCustomHtmlPageName',
        attributeName: 'error',
        value: false,
      })
    }
  } else
    return attributeUpdater({
      key: 'wafCustomHtmlPageName',
      attributeName: 'error',
      value: false,
    })
}

function checkOriginPage(ref: any) {
  //   console.log('checkOriginPage')
  if (!ref.wafOriginPolicyName.value) {
    if (ref.wafAction.value === '13') {
      return attributeUpdater({
        key: 'wafOriginPolicyName',
        attributeName: 'error',
        value: false,
      })
    } else {
      return attributeUpdater({
        key: 'wafOriginPolicyName',
        attributeName: 'error',
        value: false,
      })
    }
  } else
    return attributeUpdater({
      key: 'wafOriginPolicyName',
      attributeName: 'error',
      value: false,
    })
}

//check request rate
// function checkRequestRate(ref: any) {
//   //   console.log('checkRequestRate')
//   if (!ref.wafRate.value) {
//     return attributeUpdater({
//       key: 'wafRate',
//       attributeName: 'error',
//       value: true,
//     })
//   }
// }

export function checkFormValidation(formReferences: any, action) {
  //   console.log('checkFormValidation')
  actionType.value = action

  // checkFileExist(ruleName.value, groupName.value)
  formInputsRef.value = checkRedirectUrl(formReferences)
  formInputsRef.value = checkRequestHeader(formReferences)
  formInputsRef.value = checkResponseHeader(formReferences)
  formInputsRef.value = checkHtmlPage(formReferences)
  formInputsRef.value = checkOriginPage(formReferences)
  // formInputsRef.value = checkSourceIpValidate(formReferences)
  // formInputsRef.value = checkRequestRate(formReferences)

  // other input validaiton that are not used here
  //   checkRequestHeader(requestHeaders.value, 'Request Header')
  //   checkNotSourceIpValidate(notSourceIp.value)
  //   checkRequestHeader(notRequestHeaders.value, 'Not Request Header')

  const output = { formInputs: formInputsRef.value, isFormValid: !errorCount.value }
  // reset errorCount
  errorCount.value = 0
  return output
}
