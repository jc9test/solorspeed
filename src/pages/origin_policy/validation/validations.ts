import { ref } from 'vue'
import { inputAttributeUpdater as createFormAttributeUpdater } from '../data/create_origin_policy_data'
import { inputAttributeUpdater as editFormAttributeUpdater } from '../data/edit_origin_policy_data'

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

const checkOriginFormPort = (ref: any) => {
  if (ref.originPort.value > 0 && ref.originPort.value < 65535) {
    return attributeUpdater({
      key: 'originPort',
      attributeName: 'error',
      value: false,
    })
  } else {
    return attributeUpdater({
      key: 'originPort',
      attributeName: 'error',
      value: true,
    })
  }
}

// const checkOriginOption = (ref: any) => {
//   if (ref.originsOptions.length === 0) {
//     return attributeUpdater({
//       key: 'originsError',
//       attributeName: 'error',
//       value: true,
//     })
//   } else {
//     return attributeUpdater({
//       key: 'originsError',
//       attributeName: 'error',
//       value: false,
//     })
//   }
// }

const checkOriginPolicyName = (ref: any) => {
  if (ref.originPolicyName.value == '') {
    return attributeUpdater({
      key: 'originPolicyName',
      attributeName: 'error',
      value: true,
    })
  } else {
    return attributeUpdater({
      key: 'originPolicyName',
      attributeName: 'error',
      value: false,
    })
  }
}

export function checkFormValidation(formReferences: any, action) {
  actionType.value = action
  formInputsRef.value = checkOriginFormPort(formReferences)
  formInputsRef.value = checkOriginPolicyName(formReferences)
  // formInputsRef.value = checkOriginOption(formReferences)

  const output = { formInputs: formInputsRef.value, isFormValid: !errorCount.value }
  // reset errorCount
  errorCount.value = 0
  console.log(output)
  return output
}
