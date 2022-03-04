<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// import { getFormOptions } from '/@src/api/formOptions'
// import { checkDocumentExist } from '/@src/api/documentexist'

const { t } = useI18n()
const emit = defineEmits<{
  (e: 'onClickClose'): void
}>()

const props = defineProps({
  serviceData: {
    type: Object,
    default: () => {},
  },
  showCreateDomainModal: {
    type: Boolean,
    default: () => false,
  },
})

const groupNameOptions = ref()
const appProfileNameOptions = ref()
const tagOptions = ref()
const keypairnameOptions = ref()
const isServerNameValidMsg = ref('')
const isServerNameValid = ref(true)

// form v-model
const domain = ref('')
const description = ref('')
const tags = ref([])
const useSystemCert = ref(false)
const keypairname = ref('self-sign')
const groupName = computed(() => props.serviceData?.groupName)
const appProfileName = computed(() => props.serviceData?.appProfileName)

const showCreateDomainModal = computed(() => props.showCreateDomainModal)

// const getAppProfileNameOptionsQueryString = computed(() => {
//   let searchParams = {}
//   searchParams.servername = appProfileName
//   searchParams.groupName = groupName
//   searchParams.appProfileName = '***'
//   searchParams.withNone = false

//   return new URLSearchParams(searchParams).toString()
// })

function getAppProfileNameOptions() {
  // getFormOptions(`app-profilenames?${getAppProfileNameOptionsQueryString.value}`).then(
  //   (res) => {
  //     appProfileNameOptions.value = res.data.options
  //   }
  // )
}
function getGroupNameOptions() {
  // getFormOptions(`groupnames`).then((res) => {
  //   groupNameOptions.value = res.data.options
  // })
}
function getTagOptions() {
  // getFormOptions(`/groupby/tags?${getOptionsQueryString.value}`).then((res) => {
  //   tagOptions.value = res.data.options
  // })
}
function getKeypairNameOptions() {
  // getFormOptions(`/keypairnames?${getKeypairNameOptionsQueryString.value}`).then(
  //   (res) => {
  //     keypairnameOptions.value = res.data.options
  //   }
  // )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkDomain(domain, groupName) {
  // isServerNameValid.value = true
  // let tempArray = domain.split('\n').filter((e) => e != '')
  // let domainList = []
  // for (let element of tempArray) {
  //   if (!domainList.includes(element)) {
  //     domainList.push(element)
  //   } else {
  //     isServerNameValid.value = false
  //     isServerNameValidMsg.value = ` ${t('waf.validation.duplicate')}` + element
  //     return
  //   }
  // }
  // let maxSubdomainLengthResult = await getMaxSubdomainLength()
  // let maxSubdomainLength = maxSubdomainLengthResult.data.data
  // for (let e of domainList) {
  //   if (!/^[a-z0-9\-\_\.]*$/.test(e)) {
  //     isServerNameValid.value = false
  //     isServerNameValidMsg.value = ` ${t('waf.validation.illegalText')}` + e
  //     return
  //   }
  //   if (e.split('.').length < 2) {
  //     isServerNameValid.value = false
  //     isServerNameValidMsg.value = ` ${t('waf.validation.unsupportedText')}` + e
  //     return
  //   }
  //   if (e.split('.').length > maxSubdomainLength) {
  //     isServerNameValid.value = false
  //     isServerNameValidMsg.value = ` ${t('waf.validation.subdomainLengthText')}` + e
  //     return
  //   }
  // }
  // if (isServerNameValid.value) {
  //   const option = {
  //     topic: 'servername',
  //     fieldVal: domainList,
  //     groupName: groupName,
  //   }
  //   checkDocumentExist(option)
  //     .then((res) => {
  //       isServerNameValid.value = res.data.success
  //       isServerNameValidMsg.value = 'Invalid: ' + res.data.message
  //     })
  //     .then(() => {
  //       if (!domain) {
  //         isServerNameValid.value = false
  //         isServerNameValidMsg.value = 'Invalid: this field is required.'
  //       }
  //     })
  // }
}

async function addDomain() {
  // if (isServerNameValid.value && domain.value !== '') {
  //   let domains = formItemList.value.servername.split('\n').filter((e) => e != '')
  //   formItemList.value.servername = domains.join('\n')
  //   if (domains.length == 1) {
  //     _updateData('rcm-nginxconfigs', 'create', formItemList.value).then(async (res) => {
  //       if (res.data.taskNo == '') {
  //         notif.error('Failed to create. Please try again.')
  //       } else if (res.data.taskNo.length > 0 && res.data.success) {
  //         notif.success('Verification Successful')
  //       }
  //     })
  //   } else {
  //     let bulkCreateData = {}
  //     bulkCreateData.formData = formItemList.value
  //     bulkCreateData.bulkItemNames = domains
  //     _updateData('rcm-nginxconfigs', 'bulk-create', bulkCreateData).then(async (res) => {
  //       if (res.data.taskNo == '') {
  //         notif.error('Failed to create. Please try again.')
  //       } else if (res.data.taskNo.length > 0 && res.data.success) {
  //         notif.success('Verification Successful')
  //       }
  //     })
  //   }
  //   showCreateDomainModal.value = false
  //   await getTableData()
  //   await getModalTableData(false)
  // } else {
  //   isServerNameValid.value = false
  //   notif.error('Form error. Please check and try again.')
  // }
}

onMounted(async () => {
  await getAppProfileNameOptions()
  await getGroupNameOptions()
  await getTagOptions()
  await getKeypairNameOptions()
})
</script>

<template>
  <VModal
    :open="showCreateDomainModal"
    :title="`${t('domain.addDomain')}`"
    size="big"
    actions="right"
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
                  v-model="groupName"
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
                  v-model="appProfileName"
                  :disabled="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :placeholder="t('filter.select_service')"
                  :options="appProfileNameOptions"
                />
              </VControl>
            </VField>
          </div>

          <div class="field">
            <label>{{ t('domain.domain') }} *</label>
            <div class="control">
              <VControl>
                <textarea
                  v-model="domain"
                  class="textarea"
                  rows="3"
                  placeholder=""
                  @blur="checkDomain(domain, groupName)"
                ></textarea>
              </VControl>
              <span v-if="!isServerNameValid" class="missing-alert">
                {{ isServerNameValidMsg }}
              </span>
            </div>
          </div>

          <div class="field">
            <label>{{ t('domain.description') }}</label>
            <div class="control">
              <VControl>
                <textarea
                  v-model="description"
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
              <Control>
                <Multiselect
                  v-model="tags"
                  mode="tags"
                  :searchable="true"
                  :create-tag="true"
                  :placeholder="t('filter.select_tags')"
                  :options="tagOptions"
                />
              </Control>
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
                    v-model="useSystemCert"
                    :label-true="t('domain.on')"
                    :label-false="t('domain.off')"
                    color="primary"
                    style="justify-content: flex-start"
                  />
                </VControl>
              </div>
            </div>
          </div>

          <div v-if="!useSystemCert" class="field">
            <VField>
              <label>{{ t('domain.keypairName') }} *</label>
              <VControl>
                <Multiselect
                  v-model="keypairname"
                  mode="single"
                  :can-deselect="false"
                  :can-clear="false"
                  placeholder="Select a keypair name"
                  :options="keypairnameOptions"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </form>
    </template>

    <template #action>
      <VButton raised color="primary" @click="addDomain">
        {{ t('service.createText') }}
      </VButton>
    </template>
  </VModal>
</template>
