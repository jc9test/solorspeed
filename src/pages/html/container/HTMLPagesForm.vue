<script setup lang="ts">
import { ref, onBeforeMount, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import FormBuilder from '/@src/components/general/FormBuilder.vue'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
import { checkFormValidation } from '../validation/validations'
import { _createData, _updateData } from '/@src/api/esdata'

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
  showFormHtmlModal: {
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
  htmlPagesData: {
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

const entry = ref(props.htmlPagesData)
const htmlPageRaw = ref('')
const isLoading = ref(false)
const formInput = ref(props.formInputs)
const reRender = ref(false)
const performValidation = ref(false)

const emit = defineEmits(['show-form-html', 'getData'])
const closeHtmlPagesModal = () => {
  emit('show-form-html', false)
  reRender.value = false
}

function highlighter(htmlPageRaw: any) {
  return highlight(htmlPageRaw, languages.js) //returns html
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files) {
    const file = target.files[0]
    if (file.name.includes('.html')) {
      // htmlPageUploadErr.value = false
      // htmlPageUpload.value = file.name
      var reader = new FileReader()
      reader.onload = (e: any) => {
        entry.value.htmlPageRaw = e.target.result
        htmlPageRaw.value = e.target.result
      }
      reader.readAsText(file)
    } else {
      // htmlPageUploadErr.value = true
    }
  }
}

const handleCentralChange = () => {
  entry.value = props.renderValues()
}

const handleSubmit = () => {
  const newFormInputs = checkFormValidation(props.formReferences, props.action)
  if (newFormInputs.formInputs) {
    formInput.value = newFormInputs.formInputs
    performValidation.value = true
    if (newFormInputs.isFormValid) {
      const currValues = props.renderSubmitValues()
      let newHtmlPages = currValues
      console.log(newHtmlPages)
      if (props.action === 'create') {
        _createData('rcm-htmlpages', newHtmlPages).then(async (result) => {
          notification(result)
        })
      } else if (props.action === 'edit') {
        _updateData('rcm-htmlpages', newHtmlPages).then(async (result) => {
          console.log(result)
          notification(result)
        })
      }
    }
  }
}

const notification = (result: any) => {
  if (result.data.success) {
    closeHtmlPagesModal()
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
  () => props.htmlPagesData,
  () => {
    if (props.htmlPagesData) {
      entry.value = props.refUpdater(props.htmlPagesData)
      htmlPageRaw.value = entry.value.htmlPageRaw
      if (props.action === 'edit') {
        reRender.value = true
      }
    }
  }
)
</script>

<template>
  <VModal
    :open="showFormHtmlModal"
    :title="props.action === 'create' ? 'Add HTML Page' : 'Edit HTML Page'"
    size="large"
    actions="right"
    @close="closeHtmlPagesModal"
  >
    <template #content>
      <form class="modal-form" @submit.prevent="">
        <FormBuilder
          :form-inputs="formInput"
          :re-render="reRender"
          :perform-validation="performValidation"
          @central-changed="(e: any) => handleCentralChange(e)"
          @file-changed="(e: any) => handleFileChange(e)"
          @validation-performed="handleValidationPerformed"
        >
          <template #lastInput>
            <VField>
              <label>{{ t('html.htmlPageContent') }} *</label>
              <prism-editor
                v-model="htmlPageRaw"
                class="my-editor height-300"
                :highlight="() => highlighter(htmlPageRaw)"
                line-numbers
                readonly
              ></prism-editor>
            </VField>
            <label>{{ t('html.htmlPagePreview') }} *</label><br />
            <div class="height-300 position-relative">
              <!-- <div v-html="htmlPageRaw"></div> -->
              <iframe
                title="createHTMLPagePreview"
                class="max-width height-300 position-relative"
                :srcdoc="htmlPageRaw"
              ></iframe>
              <div :style="entry.ridPosition">
                <span :style="entry.ridColor">Case ID : 123456</span><br />
                <span :style="entry.ridColor">Time Stamp : 2022-01-01</span><br />
                <span :style="entry.ridColor">IP : 1.2.3.4</span>
              </div>
            </div>
          </template>
        </FormBuilder>
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
