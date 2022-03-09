<script setup lang="ts">
import { ref, onBeforeMount, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import FormBuilder from '/@src/components/general/FormBuilder.vue'
import { checkFormValidation } from '../validation/validations'
import { _createData, _updateData } from '/@src/api/esdata'
import { resetToDefault as resetCreateForm } from '../data/create_certs_data'
import { resetToDefault as resetEditForm } from '../data/edit_certs_data'

const { t } = useI18n()
const notif = useNotyf()
const props = defineProps({
  page: {
    type: String,
    default: '',
  },
  action: {
    type: String,
    default: 'create',
  },
  showFormCertsModal: {
    type: Boolean,
    default: undefined,
  },
  formInputs: {
    type: Object,
    default: ref([]),
  },
  formReferences: {
    type: Object,
    default: ref({}),
  },
  certsData: {
    type: Object,
    default: ref([]),
  },
  refUpdater: {
    type: Function,
    default: () => () => {},
  },
  renderValues: {
    type: Function,
    default: () => () => {},
  },
  renderSubmitValues: {
    type: Function,
    default: () => () => {},
  },
})

const entry = ref(props.certsData)
const isLoading = ref(false)
const formInput = ref(props.formInputs)
const reRender = ref(false)
const performValidation = ref(false)

const emit = defineEmits(['show-form-certs', 'getData'])
const closeCertsModal = () => {
  emit('show-form-certs', false)
  reRender.value = false
}

const globalPemResult = ref()
const globalKeyResult = ref()

const handleSubmit = async () => {
  const validatedInputs = await checkFormValidation(props.formReferences, props.action)
  if (validatedInputs.formInputs) {
    formInput.value = validatedInputs.formInputs
    performValidation.value = true
    if (validatedInputs.isFormValid) {
      const currValues = props.renderSubmitValues()
      let newCert = currValues
      console.log({
        newCert: {
          ...newCert,
          certpemRaw: globalPemResult.value.certpemRaw,
          certkeyRaw: globalKeyResult.value.certkeyRaw,
        },
      })
      if (props.action === 'create') {
        _createData('rcm-certpems', newCert).then(async (result) => {
          notification(result)
          resetCreateForm(() => {})
        })
      } else {
        _updateData('rcm-certpems', newCert).then(async (result) => {
          notification(result)
          resetEditForm(() => {})
        })
      }
    }
  }
}

function handleFileChange(value, input) {
  let fileType = input.key.includes('pem') ? 'certpem' : 'certkey'
  let file = value.target.files
  handlefileUpload(file, fileType)
}

function handlefileUpload(file, fileType) {
  const action = `api/uploads/${fileType}`

  let xhr = new XMLHttpRequest()

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (fileType === 'certpem') {
        const certpem = JSON.parse(this.responseText)
        const certpemResult = certpem.uploadPerformResult
        globalPemResult.value = certpemResult
        if (certpem.success) {
          formInput.value.commonName = certpemResult.commonName
          formInput.value.issuerCommonName = certpemResult.issuerCommonName
          formInput.value.validityStart = certpemResult.validityStart
          formInput.value.validityEnd = certpemResult.validityEnd
          formInput.value.emailAddress = certpemResult.emailAddress
          formInput.value.sanDns = certpemResult.sanDns
          formInput.value.certpemRaw = props.formReferences.certpemRaw
        }
      } else {
        const certkey = JSON.parse(this.responseText)
        globalKeyResult.value = certkey.uploadPerformResult
        if (certkey.success) {
          formInput.value.certkeyRaw = props.formReferences.certkeyRaw
        }
      }
      props.refUpdater(formInput.value)
    }
  }

  xhr.open('post', action, true)
  const formData = new FormData()
  formData.append('uploads', file[0])

  xhr.send(formData)
}

const notification = (result: any) => {
  if (result.data.success) {
    closeCertsModal()
    emit('getData')
    if (result.data.taskNo != '') {
      if (props.action === 'create') {
        notif.success('Create successful!')
      } else {
        notif.success('Update successful!')
      }
    } else {
      notif.error('Action Failed!')
    }
  } else {
    notif.error(result.data.message)
  }
}

const handleValidationPerformed = () => {
  performValidation.value = false
}

onBeforeMount(async () => {})
onMounted(() => {})

watch(
  () => props.certsData,
  () => {
    if (props.certsData) {
      resetEditForm(() => {})
      entry.value = props.refUpdater(props.certsData)
      if (props.action === 'edit') {
        reRender.value = true
      }
    }
  }
)
</script>
<template>
  <VModal
    :open="showFormCertsModal"
    :title="props.action === 'create' ? 'Add Cert' : 'Edit Cert'"
    size="large"
    actions="right"
    @close="closeCertsModal"
  >
    <template #content>
      <form class="modal-form" @submit.prevent="handleSubmit">
        <FormBuilder
          :form-inputs="formInput"
          :re-render="reRender"
          :perform-validation="performValidation"
          @validation-performed="handleValidationPerformed"
          @file-changed="handleFileChange"
        ></FormBuilder>
      </form>
    </template>
    <template #action>
      <VButton color="primary" raised :loading="isLoading" @click="handleSubmit">{{
        t('service.confirmText')
      }}</VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
.missing-alert {
  font-size: 0.75rem;
  color: $danger !important;
  padding-left: 10px;
}

.add-btn {
  margin-left: 0.5rem;
  height: 0;
  padding: 10px;
  position: relative;
  top: -2px;
}

.flexColumn {
  display: flex;
  flex-direction: column;
}
.max-width {
  width: 100%;
}
.my-editor {
  background: #2d2d2d;
  color: #ccc;

  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

// optional
.prism-editor__textarea:focus {
  outline: none;
}

// not required:
.height-300 {
  height: 300px;
}
.position-relative {
  position: relative;
}
.rid {
  width: 100%;
  height: 100%;
}
</style>
