<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// import { getGroupAsset } from '/@src/api/groupasset.ts'
// import { _createData } from '/@src/api/esdata'
import { getFormOptions } from '/@src/api/formOptions'
import { getMaxSubdomainLength } from '/@src/api/system'
import { checkDocumentExist } from '/@src/api/documentexist'
import { validateDomainForm } from '/@src/pages/services-detail/validation/validate'

const { t } = useI18n()
const emit = defineEmits(['onClickClose', 'submitData'])

const props = defineProps({
  showEditDomainModal: {
    type: Boolean,
    default: () => false,
  },
  domainSelected: {
    type: Object,
    default: () => {},
  },
  overviewData: {
    type: String,
    default: () => '',
  },
  formType: {
    type: String,
    default: () => '',
  },
})

const isLoading = ref(false)
const addEditModalTitle = ref('')
// const appProfileName = ref('')
const isDomainValid = ref(true)
const domainErrorMsg = ref('')
// const useSystemCert = ref(false)
const appProfileNameOptions = ref()
const tagOptions = ref()
const keypairnameOptions = ref()
const groupNameOptions = ref()

const domainFormInputData = ref({
  appProfileName: { value: '', error: false },
  groupName: { value: '', error: false },
  domain: { value: '', error: false },
  description: { value: '', error: false },
  tags: { value: [], error: false },
  useSystemCert: { value: false, error: false },
  keypairname: { value: '', error: false }, // { value: 'self-sign', error: false },
})
const showEditDomainModal = computed(() => props.showEditDomainModal)
const domainSelected = computed(() => props.domainSelected)
const overviewData = computed(() => props.overviewData)
// const groupName = computed(() => props.groupName)
const formType = computed(() => props.formType)

const getQueryString = (params) => {
  const searchParams = { ...params }
  return new URLSearchParams(searchParams).toString()
}
const getAppProfileNameOptions = () => {
  let appProfileNameParams = {
    servername: overviewData.value.appProfileName,
    groupName: overviewData.value.groupName,
    appProfileName: '***',
    withNone: false,
  }
  let appProfileNameQuery = getQueryString(appProfileNameParams)
  getFormOptions(`app-profilenames?${appProfileNameQuery}`).then((res) => {
    appProfileNameOptions.value = res.data.options
  })
}
const getTagOptions = () => {
  let tagParams = {
    servername: overviewData.value.appProfileName,
    groupName: overviewData.value.groupName,
    keypairName: '***',
    withSelfSign: !overviewData.value.useSystemCert,
    withSystem: overviewData.value.useSystemCert,
  }
  let tagQuery = getQueryString(tagParams)
  getFormOptions(`/groupby/tags?${tagQuery}`).then((res) => {
    tagOptions.value = res.data.options
  })
}
const getKeypairNameOptions = () => {
  let keypairNameParams = {
    groupName: overviewData.value.groupName,
    tags: '***',
    indexName: 'rcm-nginxconfigs',
  }
  let keypairNameQuery = getQueryString(keypairNameParams)
  getFormOptions(`/keypairnames?${keypairNameQuery}`).then((res) => {
    keypairnameOptions.value = res.data.options
  })
}
const getGroupNameOptions = () => {
  getFormOptions(`groupnames`).then((res) => {
    groupNameOptions.value = res.data.options
  })
}
const updateDomainFormModalTitle = () => {
  if (formType.value == 'add') {
    addEditModalTitle.value = t('domain.addDomain')
  } else {
    addEditModalTitle.value = `Edit ${domainSelected.value.servername}`
  }
}
const updateDomainFormInputData = () => {
  domainFormInputData.value.appProfileName = {
    value: overviewData.value.appProfileName,
    error: false,
  }
  domainFormInputData.value.groupName = {
    value: overviewData.value.groupName,
    error: false,
  }
  domainFormInputData.value.domain = { value: '', error: false }
  domainFormInputData.value.description = { value: '', error: false }
  domainFormInputData.value.tags = { value: [], error: false }
  domainFormInputData.value.useSystemCert = { value: false, error: false }
  domainFormInputData.value.keypairname = { value: '', error: false } // { value: 'self-sign', error: false },

  if (domainSelected.value) {
    domainFormInputData.value.appProfileName.value = domainSelected.value.appProfileName
    domainFormInputData.value.groupName.value = domainSelected.value.groupName
    domainFormInputData.value.domain.value = domainSelected.value.servername
    domainFormInputData.value.description.value = domainSelected.value.description
    domainFormInputData.value.tags.value = domainSelected.value.tags
    domainFormInputData.value.useSystemCert.value = domainSelected.value.useSystemCert
    domainFormInputData.value.keypairname.value = domainSelected.value.keypairname
  }
}

const checkDomain = async (domain, groupName) => {
  isDomainValid.value = true
  let tempArray = domain?.split('\n').filter((e) => e != '') ?? []
  let domainList = []
  for (let element of tempArray) {
    if (!domainList.includes(element)) {
      domainList.push(element)
    } else {
      isDomainValid.value = false
      domainErrorMsg.value = ` ${t('waf.validation.duplicate')}` + element
      return
    }
  }

  let maxSubdomainLengthResult = await getMaxSubdomainLength()
  let maxSubdomainLength = maxSubdomainLengthResult.data.data
  if (domainList.length > 0) {
    for (let e of domainList) {
      if (!/^[a-z0-9\-\_\.]*$/.test(e)) {
        isDomainValid.value = false
        domainErrorMsg.value = ` ${t('waf.validation.illegalText')}` + e
        return
      }
      if (e.split('.').length < 2) {
        isDomainValid.value = false
        domainErrorMsg.value = ` ${t('waf.validation.unsupportedText')}` + e
        return
      }
      if (e.split('.').length > maxSubdomainLength) {
        isDomainValid.value = false
        domainErrorMsg.value = ` ${t('waf.validation.subdomainLengthText')}` + e
        return
      }
    }

    if (isDomainValid.value) {
      const option = {
        topic: 'servername',
        fieldVal: domainList,
        groupName: groupName,
      }
      checkDocumentExist(option)
        .then((res) => {
          isDomainValid.value = res.data.success
          domainErrorMsg.value = 'Invalid: ' + res.data.message
        })
        .then(() => {
          if (!domain) {
            isDomainValid.value = false
            domainErrorMsg.value = 'Invalid: this field is required.'
          }
        })
    }
  }
}
const submitDomain = async () => {
  isLoading.value = true
  let submit_data = {}
  let temp_domainSelected = { ...domainSelected.value }
  let temp = {
    appProfileName: overviewData.value.appProfileName,
    groupName: overviewData.value.groupName,
    description: domainFormInputData.value.description.value,
    keypairname: domainFormInputData.value.keypairname.value,
    servername: domainFormInputData.value.domain.value,
    tags: domainFormInputData.value.tags.value,
    useSystemCert: domainFormInputData.value.useSystemCert.value,
    originPort: overviewData.value.originPort,
    origins: overviewData.value.origins,
    originscheme: overviewData.value.originscheme,
    portMappingType: overviewData.value.portMappingType,
  }

  if (formType.value == 'edit') {
    submit_data = {
      ...temp_domainSelected,
      ...temp,
    }
  } else {
    submit_data = { ...temp }
  }
  console.log({
    'domain - submit_data': {
      submit_data: submit_data,
      domainSelected: temp_domainSelected,
      temp: temp,
    },
  })

  const validation = await validateDomainForm(
    formType.value,
    submit_data,
    domainFormInputData.value
  )

  if (!validation.status) {
    domainFormInputData.value = validation.domainData
  } else {
    console.log({ submitDomain: { type: formType.value, data: submit_data } })
    emit('submitData', { type: formType.value, data: submit_data })
    emit('onClickClose')
  }

  isLoading.value = false
}

watch(showEditDomainModal, () => {
  updateDomainFormModalTitle()
  updateDomainFormInputData()
})
watch(overviewData, () => {
  updateDomainFormInputData()
  getAppProfileNameOptions()
  getTagOptions()
  getKeypairNameOptions()
  getGroupNameOptions()
})
</script>
<template>
  <VModal
    :open="showEditDomainModal"
    :title="addEditModalTitle"
    size="big"
    actions="right"
    noscroll
    @close="emit('onClickClose')"
  >
    <template #content>
      <form class="modal-form" @submit.prevent>
        <div class="essential">
          <h4>{{ t('domain.sections.essential') }}</h4>
          <div class="field">
            <VField>
              <label>{{ t('domain.group') }}*</label>
              <VControl>
                <Multiselect
                  v-model="domainFormInputData.groupName.value"
                  :placeholder="t('filter.select_group')"
                  :disabled="true"
                  :options="groupNameOptions"
                />
              </VControl>
            </VField>
          </div>

          <div class="field">
            <VField>
              <label>{{ t('domain.service_name') }} *</label>
              <VControl>
                <Multiselect
                  v-model="domainFormInputData.appProfileName.value"
                  :disabled="formType == 'add' ? true : false"
                  :can-deselect="false"
                  :can-clear="false"
                  placeholder="Select a service"
                  :options="appProfileNameOptions"
                />
              </VControl>
            </VField>
          </div>

          <div v-if="formType == 'add'" class="field">
            <label>{{ t('domain.domain') }} *</label>
            <div class="control">
              <VControl :has-error="domainFormInputData.domain.error">
                <textarea
                  v-model="domainFormInputData.domain.value"
                  class="textarea"
                  rows="3"
                  placeholder=""
                  @blur="
                    checkDomain(
                      domainFormInputData.domain.value,
                      domainFormInputData.groupName.value
                    )
                  "
                ></textarea>
              </VControl>
              <span v-if="!isDomainValid" class="missing-alert">
                {{ domainErrorMsg }}
              </span>
              <p v-if="domainFormInputData.domain.error" class="help text-danger">
                Please select Domain.
              </p>
            </div>
          </div>

          <div class="field">
            <label>{{ t('domain.description') }}</label>
            <div class="control">
              <VControl>
                <textarea
                  v-model="domainFormInputData.description.value"
                  class="textarea"
                  rows="4"
                  placeholder=""
                ></textarea>
              </VControl>
            </div>
          </div>

          <div class="field">
            <VField>
              <label>{{ t('domain.tags') }}</label>
              <VControl>
                <Multiselect
                  v-model="domainFormInputData.tags.value"
                  mode="tags"
                  :searchable="true"
                  :create-tag="true"
                  :placeholder="t('filter.select_tag')"
                  :options="tagOptions"
                />
              </VControl>
            </VField>
          </div>
        </div>

        <div>
          <h4>HTTP / HTTPS</h4>
          <div class="field">
            <label>{{ t('domain.use_system_cert') }}</label>
            <div class="control">
              <div class="https-switch">
                <VControl class="https-switch">
                  <VSwitchSegment
                    v-model="domainFormInputData.useSystemCert.value"
                    label-true="On"
                    label-false="Off"
                    color="primary"
                    style="justify-content: flex-start"
                  />
                </VControl>
              </div>
            </div>
          </div>

          <div v-if="!domainFormInputData.useSystemCert.value" class="field">
            <VField>
              <label>{{ t('domain.keypairName') }} *</label>
              <VControl :has-error="domainFormInputData.keypairname.error">
                <Multiselect
                  v-model="domainFormInputData.keypairname.value"
                  mode="single"
                  :can-deselect="false"
                  :can-clear="false"
                  :placeholder="t('filter.select_tag')"
                  :options="keypairnameOptions"
                />
                <p v-if="domainFormInputData.keypairname.error" class="help text-danger">
                  Please select Keypair Name.
                </p>
              </VControl>
            </VField>
          </div>
        </div>
      </form>
    </template>

    <template #action>
      <VButton raised color="primary" :loading="isLoading" @click="submitDomain()">
        {{ formType == 'add' ? t('service.createText') : t('domain.save') }}
      </VButton>
    </template>
  </VModal>
</template>
