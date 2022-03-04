import { ref } from 'vue'
import { inputAttributeUpdater as createFormAttributeUpdater } from '../data/create_html_pages_data'
import { inputAttributeUpdater as editFormAttributeUpdater } from '../data/edit_html_pages_data'

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

// return attributeUpdater({
//   key: 'originPort',
//   attributeName: 'error',
//   value: false,
// })

const checkSomeInput = (formReferences) => {
  if (formReferences) {
    return attributeUpdater({
      key: 'htmlPageUpload',
      attributeName: 'error',
      value: false,
    })
  }
}

export function checkFormValidation(formReferences: any, action) {
  actionType.value = action
  formInputsRef.value = checkSomeInput(formReferences)

  const output = { formInputs: formInputsRef.value, isFormValid: !errorCount.value }
  console.log(output)
  // reset errorCount
  errorCount.value = 0
  return output
}
