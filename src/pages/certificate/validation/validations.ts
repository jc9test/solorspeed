import { ref } from 'vue'
import { inputAttributeUpdater as createFormAttributeUpdater } from '../data/create_certs_data'
import { inputAttributeUpdater as editFormAttributeUpdater } from '../data/edit_certs_data'
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

async function checkKeyPairName(ref: any) {
  const keyPairName = ref.keyPairName.value
  const groupName = store.state.queryGroupName
  const regex = /^[a-z0-9\-\_\.]*$/
  const err = { error: false, errorMsg: '' }
  if (!keyPairName) {
    err.error = true
    err.errorMsg = 'filter.validation.required'
  }
  if (!regex.test(keyPairName)) {
    err.error = true
    err.errorMsg = 'Invalid Name: Please make sure you exclude any special characters.'
  }
  if (keyPairName?.length > 35) {
    err.error = true
    err.errorMsg = `${t('service.validate.validateExceedLengthPrefix')}: 35`
  }

  const option = {
    topic: 'keyPairId',
    fieldVal: keyPairName,
    groupName: groupName,
  }
  await checkDocumentExist(option).then((res) => {
    if (!res.data.success) {
      err.error = true
      err.errorMsg = keyPairName + ` ${t('service.validate.validateExistText')}`
    }
  })

  return attributeUpdater({
    key: 'keyPairName',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}

function checkCertPem(ref: any) {
  const certpemRaw = ref.certpemRaw.value
  const err = { error: false, errorMsg: '' }
  if (!certpemRaw) {
    err.error = true
    err.errorMsg = 'filter.validation.required'
  }

  return attributeUpdater({
    key: 'certpemRaw',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}

function checkCertKey(ref: any) {
  const certkeyRaw = ref.certkeyRaw.value
  const err = { error: false, errorMsg: '' }
  if (!certkeyRaw) {
    err.error = true
    err.errorMsg = 'filter.validation.required'
  }

  return attributeUpdater({
    key: 'certkeyRaw',
    attributeName: 'error',
    value: err.error,
    errorMsg: err.errorMsg,
  })
}

export async function checkFormValidation(formReferences: any, action) {
  actionType.value = action
  if (action === 'create') {
    formInputsRef.value = await checkKeyPairName(formReferences)
  }
  formInputsRef.value = checkCertPem(formReferences)
  formInputsRef.value = checkCertKey(formReferences)
  const output = { formInputs: formInputsRef.value, isFormValid: !errorCount.value }
  console.log(output)
  console.log({ action: 'getting error logs', log: errorLogs.value })
  errorCount.value = 0
  errorLogs.value = []
  return output
}
