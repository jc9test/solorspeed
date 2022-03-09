<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { getFormOptions } from '/@src/api/formOptions'
import store from '/@src/stores/index'
import AdvancedSettingFormModal from '/@src/pages/services-detail/container/AdvancedSettingFormModal.vue'
import { validateAdvancedForm } from '/@src/pages/services-detail/validation/validate'

const { t } = useI18n()
const emit = defineEmits(['clickDropdown', 'submitData'])
const props = defineProps({
  overviewData: {
    type: Object,
    default: () => {},
  },
  advancedDropdown: {
    type: Boolean,
    default: () => false,
  },
})

const isLoading = ref(false)
const showAdvancedModal = ref(false)
const htmlPageNames = ref([])
const advancedFormData = ref({
  errorHtmlPageName: 'default',
  isAcceptHttpV1: false,
  isUpgradeInsecureRequest: false,
  maxUploadSize: 1,
  // More Setting Data
  upstreamTimeout: 60,
  isEnabledCompressionToOrigin: true,
  isEnabledUpstreamHttp11: true,
  isInsertRidHeaderToOrigin: false,
  setCustomHostHeader: 'off',
  customHostHeader: '',
  websocketPath: '',
  proxyBufferSize: 4,
  cusFollowCachePath: '',
  cusFollowCacheFile: '',
  cusCachepathExp: '1d',
  cusCachepathSrvexp: '1d',
  cusCachepathHottime: '1',
  cusCachefileExp: '1d',
  cusCachefileSrvexp: '1d',
  cusCachefileHottime: '1',
  defCachefileExp: '1d',
  defCachefileSrvexp: '1d',
  defCachefileHottime: '1',
})
const advancedFormDataChanges = ref({
  errorHtmlPageName: { value: 'default', error: false },
  isAcceptHttpV1: { value: false, error: false },
  isUpgradeInsecureRequest: { value: false, error: false },
  maxUploadSize: { value: 1, error: false },
  // More Setting Data
  upstreamTimeout: { value: 60, error: false },
  isEnabledCompressionToOrigin: { value: true, error: false },
  isEnabledUpstreamHttp11: { value: true, error: false },
  isInsertRidHeaderToOrigin: { value: false, error: false },
  setCustomHostHeader: { value: 'off', error: false },
  customHostHeader: { value: '', error: false },
  websocketPath: { value: '', error: false },
  proxyBufferSize: { value: 4, error: false },
  cusFollowCachePath: { value: '', error: false },
  cusFollowCacheFile: { value: '', error: false },
  cusCachepathExp: { value: '1d', error: false },
  cusCachepathSrvexp: { value: '1d', error: false },
  cusCachepathHottime: { value: '1', error: false },
  cusCachefileExp: { value: '1d', error: false },
  cusCachefileSrvexp: { value: '1d', error: false },
  cusCachefileHottime: { value: '1', error: false },
  defCachefileExp: { value: '1d', error: false },
  defCachefileSrvexp: { value: '1d', error: false },
  defCachefileHottime: { value: '1', error: false },
})

const overviewData = computed(() => {
  return props.overviewData
})
const advancedDropdown = computed(() => {
  return props.advancedDropdown
})

const updateAdvancedFormData = () => {
  // UPDATE advancedFormData FROM overviewData
  for (const advancedFormData_key in advancedFormData.value) {
    advancedFormData.value[advancedFormData_key] =
      overviewData.value[advancedFormData_key]
  }

  // UPDATE advancedFormDataChanges FROM advancedFormData
  for (const advancedFormDataChanges_key in advancedFormDataChanges.value) {
    advancedFormDataChanges.value[advancedFormDataChanges_key].value =
      advancedFormData.value[advancedFormDataChanges_key]
  }
}

const onClickMoreSettingModal = () => {
  showAdvancedModal.value = !showAdvancedModal.value
  console.log({
    onClickMoreSettingModal: {
      showAdvancedModal: showAdvancedModal.value,
      'showAdvancedModal - advancedFormDataChanges': advancedFormDataChanges.value,
    },
  })
}

const submitMoreSetting = (item) => {
  console.log({ 'submitMoreSetting - item': item })

  for (const item_key in item) {
    advancedFormDataChanges.value[item_key].value = item[item_key].value
  }
}

const submitAdvancedSettings = async () => {
  let temp_list = { ...advancedFormDataChanges.value }
  const submit_data = {
    ...overviewData.value,
    errorHtmlPageName: temp_list.errorHtmlPageName.value,
    isAcceptHttpV1: temp_list.isAcceptHttpV1.value,
    isUpgradeInsecureRequest: temp_list.isUpgradeInsecureRequest.value,
    maxUploadSize: temp_list.maxUploadSize.value,
    // More Setting Data
    upstreamTimeout: temp_list.upstreamTimeout.value,
    isEnabledCompressionToOrigin: temp_list.isEnabledCompressionToOrigin.value,
    isEnabledUpstreamHttp11: temp_list.isEnabledUpstreamHttp11.value,
    isInsertRidHeaderToOrigin: temp_list.isInsertRidHeaderToOrigin.value,
    setCustomHostHeader: temp_list.setCustomHostHeader.value,
    customHostHeader: temp_list.customHostHeader.value,
    websocketPath: temp_list.websocketPath.value,
    proxyBufferSize: temp_list.proxyBufferSize.value,
    cusFollowCachePath: temp_list.cusFollowCachePath.value,
    cusFollowCacheFile: temp_list.cusFollowCacheFile.value,
    cusCachepathExp: temp_list.cusCachepathExp.value,
    cusCachepathSrvexp: temp_list.cusCachepathSrvexp.value,
    cusCachepathHottime: temp_list.cusCachepathHottime.value,
    cusCachefileExp: temp_list.cusCachefileExp.value,
    cusCachefileSrvexp: temp_list.cusCachefileSrvexp.value,
    cusCachefileHottime: temp_list.cusCachefileHottime.value,
    defCachefileExp: temp_list.defCachefileExp.value,
    defCachefileSrvexp: temp_list.defCachefileSrvexp.value,
    defCachefileHottime: temp_list.defCachefileHottime.value,
  }
  console.log({ 'submitAdvancedSettings - item': submit_data })

  const validation = await validateAdvancedForm(
    'advancedSetting',
    submit_data,
    advancedFormDataChanges.value
  )

  if (!validation.status) {
    advancedFormDataChanges.value = validation.advancedData
  } else {
    console.log('Update Advanced Setting')
    emit('submitData', submit_data)
    emit('clickDropdown')
  }
}

onMounted(async () => {
  await getFormOptions(
    `htmlpagenames?groupName=${store.state.queryGroupName}&htmlpageName=***&withDefault=true`
  ).then((res) => {
    htmlPageNames.value = res.data.options
  })
})

watch(overviewData, () => {
  updateAdvancedFormData()
})
watch(advancedFormDataChanges, () => {
  console.log('Updated advancedFormDataChanges')
})
</script>

<template>
  <div class="tile-grid-item service-detail-card-body">
    <div class="tile-grid-item-inner" style="display: block">
      <div class="columns" style="display: flex">
        <div class="column meta is-2">
          <span
            class="dark-inverted"
            style="
              font-size: 16px;
              vertical-align: -webkit-baseline-middle;
              vertical-align: text-top;
            "
          >
            {{ t('service.advanced_settings') }}
          </span>
        </div>
        <div class="vertical-divider" />
        <div class="horizontal-divider" />

        <!-- Display Value -->
        <div v-if="!advancedDropdown" class="column is-9">
          <div class="columns container">
            <div class="column meta is-6">
              <span class="dark-inverted" style="color: gray">
                {{ t('advancedSetting.error_html_page_name') }}
              </span>
              <div>
                <VTag
                  v-if="advancedFormData.errorHtmlPageName == ''"
                  rounded
                  color="primary"
                  class="m-r-5 cache-tag"
                  :label="'default'"
                />
                <VTag
                  v-else
                  rounded
                  color="primary"
                  class="m-r-5 cache-tag"
                  :label="advancedFormData.errorHtmlPageName"
                />
              </div>
            </div>
            <div class="column meta is-6">
              <span class="dark-inverted" style="color: gray">
                {{ t('advancedSetting.max_upload_size') }}
              </span>
              <div>
                <VTag
                  rounded
                  color="primary"
                  class="m-r-5 cache-tag"
                  :label="advancedFormData.maxUploadSize + `mb`"
                />
              </div>
            </div>
          </div>
          <div class="columns container">
            <div class="column meta is-6">
              <span class="dark-inverted" style="color: gray">
                {{ t('advancedSetting.accept_http') }}
              </span>
              <div>
                <VTag
                  v-if="advancedFormData.isAcceptHttpV1"
                  rounded
                  color="primary"
                  class="m-r-5 cache-tag"
                  label="On"
                />
                <VTag
                  v-else
                  rounded
                  color="primary"
                  class="m-r-5 cache-tag"
                  label="Off"
                />
              </div>
            </div>
            <div class="column meta is-6">
              <span class="dark-inverted" style="color: gray">
                {{ t('advancedSetting.upgrade_insecure_request') }}
              </span>
              <div>
                <VTag
                  v-if="advancedFormData.isUpgradeInsecureRequest"
                  rounded
                  color="primary"
                  class="m-r-5 cache-tag"
                  label="On"
                />
                <VTag
                  v-else
                  rounded
                  color="primary"
                  class="m-r-5 cache-tag"
                  label="Off"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Edit Value -->
        <div v-else class="column is-9">
          <form class="" @submit.prevent="submitAdvancedSettings">
            <div class="columns container">
              <div class="column meta is-6">
                <span class="dark-inverted" style="color: gray">
                  {{ t('advancedSetting.error_html_page_name') }}
                </span>
                <VControl>
                  <div class="select">
                    <select v-model="advancedFormDataChanges.errorHtmlPageName.value">
                      <option v-for="(name, index) in htmlPageNames" :key="index">
                        {{ name }}
                      </option>
                    </select>
                  </div>
                </VControl>
              </div>
              <div class="column meta is-6">
                <span class="dark-inverted" style="color: gray">
                  {{ t('advancedSetting.max_upload_size') }}
                </span>
                <VControl :has-error="advancedFormDataChanges.maxUploadSize.error">
                  <input
                    v-model="advancedFormDataChanges.maxUploadSize.value"
                    type="number"
                    class="input"
                  />
                  <!-- <i aria-hidden="true"></i> -->
                  <p
                    v-if="advancedFormDataChanges.maxUploadSize.error"
                    class="help text-danger"
                  >
                    The upload size must be between 1 and 100
                  </p>
                </VControl>
              </div>
            </div>
            <div class="columns container">
              <div class="column meta is-6">
                <span class="dark-inverted" style="color: gray">
                  {{ t('advancedSetting.accept_http') }}
                </span>
                <VControl>
                  <VSwitchSegment
                    v-model="advancedFormDataChanges.isAcceptHttpV1.value"
                    style="justify-content: flex-start"
                    :label-true="t('service.on')"
                    :label-false="t('service.off')"
                    color="primary"
                  />
                </VControl>
                <div class="left" style="float: left; margin-top: 2rem">
                  <span
                    class="dark-inverted setting-btn"
                    style="color: gray; margin-top: 1rem"
                    @click="onClickMoreSettingModal"
                    @keypress="onClickMoreSettingModal"
                  >
                    {{ t('advancedSetting.view_more_setting') }}
                    <i
                      style="font-size: 10px"
                      aria-hidden="true"
                      class="iconify sidebar-svg"
                      data-icon="fe:arrow-right"
                    ></i>
                  </span>
                </div>
              </div>
              <div class="column meta is-6">
                <span class="dark-inverted" style="color: gray">
                  {{ t('advancedSetting.upgrade_insecure_request') }}
                </span>
                <VControl>
                  <VSwitchSegment
                    v-model="advancedFormDataChanges.isUpgradeInsecureRequest.value"
                    style="justify-content: flex-start"
                    :label-true="t('service.on')"
                    :label-false="t('service.off')"
                    color="primary"
                  />
                </VControl>
                <div class="right" style="float: right; margin-top: 2rem">
                  <VButton @click="emit('clickDropdown')">
                    <div class="light-text">
                      {{ t('service.cancelText') }}
                    </div>
                  </VButton>
                  <VButton
                    :loading="isLoading"
                    color="primary"
                    @click="submitAdvancedSettings"
                  >
                    <div>{{ t('service.saveText') }}</div>
                  </VButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="btn-edit">
        <div
          class="is-trigger dropdown-trigger"
          style="display: flex; justify-content: space-evenly"
          @click="emit('clickDropdown')"
          @keypress="emit('clickDropdown')"
        >
          <VIcon icon="feather:settings" class="setting-btn" />
        </div>
      </div>
    </div>
  </div>

  <AdvancedSettingFormModal
    :show-advanced-modal="showAdvancedModal"
    :advanced-form-data="advancedFormDataChanges"
    :html-page-names="htmlPageNames"
    @submit-advanced-more-setting="(e) => submitMoreSetting(e)"
    @click-dropdown="onClickMoreSettingModal"
  />
</template>
