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

const checkOriginPolicyName = (ref: any) => {
  const originPolicyName = ref.originPolicyName.value
  const regex = /^[a-z0-9\_]*$/
  const err = { error: false, errorMsg: '' }
  if (!originPolicyName) {
    err.error = true
    err.errorMsg = 'filter.validation.required'
  }
  if (!regex.test(originPolicyName)) {
    err.error = true
    err.errorMsg = 'Invalid Name: Please make sure you exclude any special characters.'
  }
  if (originPolicyName.length > 35) {
    err.error = true
    err.errorMsg = 'Invalid Name: Please make your name do not exceed 35 characters'
  }

  return attributeUpdater({
    key: 'originPolicyName',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}

export const checkOriginOption = (originsOptions: any) => {
  const err = { error: false, errorMsg: '' }
  if (originsOptions.length === 0) {
    errorCount.value = errorCount.value + 1
    err.error = true
    err.errorMsg = ''
  }
  return err
}

const checkOriginFormPort = (ref: any) => {
  const err = { error: false, errorMsg: '' }
  if (ref.originPort.value <= 0 || ref.originPort.value >= 65535) {
    err.error = true
    err.errorMsg = 'Invalid Port: Value must be within the range of 1 - 65534'
  }

  return attributeUpdater({
    key: 'originPort',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
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
