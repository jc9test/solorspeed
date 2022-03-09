import { ref } from 'vue'
import { inputAttributeUpdater as createFormAttributeUpdater } from '../data/create_html_pages_data'
import { inputAttributeUpdater as editFormAttributeUpdater } from '../data/edit_html_pages_data'
import { checkDocumentExist } from '/@src/api/documentexist'
import store from '/@src/stores/index'
import { createI18n } from '/@src/i18n'

const i18n = createI18n()

const { t } = i18n.global

const formInputsRef = ref()
const actionType = ref()
const errorCount = ref(0)
const errorLogs = ref([])

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

async function checkHtmlPageName(ref: any) {
  const htmlPageName = ref.htmlPageName.value
  const groupName = store.state.queryGroupName
  const regex = /^[a-z0-9\_]*$/
  const err = { error: false, errorMsg: '' }
  if (!htmlPageName) {
    err.error = true
    err.errorMsg = 'filter.validation.required'
  }
  if (!regex.test(htmlPageName)) {
    err.error = true
    err.errorMsg = 'Invalid Name: Please make sure you exclude any special characters.'
  }
  if (htmlPageName?.length > 35) {
    err.error = true
    err.errorMsg = `${t('service.validate.validateExceedLengthPrefix')}: 35`
  }

  const option = {
    topic: 'htmlPageName',
    fieldVal: htmlPageName,
    groupName: groupName,
  }
  await checkDocumentExist(option).then((res) => {
    if (!res.data.success) {
      err.error = true
      err.errorMsg = htmlPageName + ` ${t('service.validate.validateExistText')}`
    }
  })

  return attributeUpdater({
    key: 'htmlPageName',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}
function checkHtmlPageUpload(ref: any) {
  const htmlPageUpload = ref.htmlPageUpload.value
  const err = { error: false, errorMsg: '' }

  if (!htmlPageUpload) {
    err.error = true
    err.errorMsg = 'filter.validation.required'
  }

  return attributeUpdater({
    key: 'htmlPageUpload',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}

// function checkHtmlPageRaw () {}
// function checkHtmlPageUpload () {}
// function checkRidColor () {}
// function checkRidPosition () {}

export async function checkFormValidation(formReferences: any, action) {
  actionType.value = action
  if (action === 'create') {
    formInputsRef.value = await checkHtmlPageName(formReferences)
  }
  console.log({ action: 'im here', formReferences })
  formInputsRef.value = checkHtmlPageUpload(formReferences)

  const output = { formInputs: formInputsRef.value, isFormValid: !errorCount.value }
  console.log(output)
  console.log({ action: 'getting error logs', log: errorLogs.value })
  errorCount.value = 0
  errorLogs.value = []
  return output
}
