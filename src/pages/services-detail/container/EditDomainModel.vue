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
  showEditDomainModal: {
    type: Boolean,
    default: () => false,
  },
  domainSelected: {
    type: Object,
    default: () => {},
  },
  serviceData: {
    type: Object,
    default: () => {},
  },
})

const appProfileNameOptions = ref()
const tagOptions = ref()
const keypairnameOptions = ref()

// form v-model
const appProfileName = computed(() => props.serviceData.appProfileName)

const showEditDomainModal = computed(() => props.showEditDomainModal)
const domainSelected = computed(() => props.domainSelected)

function getAppProfileNameOptions() {
  // getFormOptions(`app-profilenames?${getAppProfileNameOptionsQueryString.value}`).then(
  //   (res) => {
  //     appProfileNameOptions.value = res.data.options
  //   }
  // )
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

onMounted(async () => {
  await getAppProfileNameOptions()
  await getTagOptions()
  await getKeypairNameOptions()
})
</script>
<template>
  <div v-if="domainSelected">
    <VModal
      :open="showEditDomainModal"
      :title="`Edit ${domainSelected.servername}`"
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
                <label>{{ t('domain.service_name') }} *</label>
                <VControl>
                  <Multiselect
                    v-model="appProfileName"
                    :disabled="false"
                    :can-deselect="false"
                    :can-clear="false"
                    placeholder="Select a service"
                    :options="appProfileNameOptions"
                  />
                </VControl>
              </VField>
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
                <VControl>
                  <Multiselect
                    v-model="tags"
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
                      v-model="useSystemCert"
                      label-true="On"
                      label-false="Off"
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
                    :placeholder="t('filter.select_tag')"
                    :options="keypairnameOptions"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </form>
      </template>

      <template #action>
        <VButton
          raised
          color="primary"
          :loading="isLoading"
          @click="editDomain(domainSelected)"
        >
          {{ t('domain.save') }}
        </VButton>
      </template>
    </VModal>
  </div>
</template>
