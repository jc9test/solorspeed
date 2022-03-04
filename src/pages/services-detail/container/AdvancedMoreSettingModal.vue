<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { validateAdvancedForm } from '/@src/pages/services-detail/validation/validate'

const { t } = useI18n()
const emit = defineEmits(['clickDropdown', 'submitAdvancedMoreSetting'])

const props = defineProps({
  showAdvancedModal: {
    type: Boolean,
    default: () => false,
  },
  htmlPageNames: {
    type: Array,
    default: () => [],
  },
  advancedFormData: {
    type: Object,
    default: () => {},
  },
})

const isLoading = ref(false)
const proxyBufferSize = ref([2, 4, 8, 16, 32, 64])
const upstreamTimeout = ref([60, 120, 180])
const expired = ref(['1d', '15d', '30d'])
const minused = ref(['1', '5', '15', '25'])
const moreSettingFormData = ref({
  errorHtmlPageName: { value: 'default', error: false },
  upstreamTimeout: { value: 50, error: false },
  isEnabledUpstreamHttp11: { value: true, error: false },
  isAcceptHttpV1: { value: false, error: false },
  isInsertRidHeaderToOrigin: { value: false, error: false },
  setCustomHostHeader: { value: 'off', error: false },
  customHostHeader: { value: '', error: false },
  isUpgradeInsecureRequest: { value: false, error: false },
  websocketPath: { value: '', error: false },
  proxyBufferSize: { value: 4, error: false },
  maxUploadSize: { value: 1, error: false },
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
const htmlPageNames = computed(() => {
  return props.htmlPageNames
})
const advancedFormData = computed(() => {
  return props.advancedFormData
})
const showAdvancedModal = computed(() => {
  return props.showAdvancedModal
})

const updateMoreSettingFormData = () => {
  moreSettingFormData.value = JSON.parse(JSON.stringify(advancedFormData.value))

  // moreSettingFormData.value.errorHtmlPageName.value =
  //   advancedFormData.value.errorHtmlPageName.value
  // moreSettingFormData.value.upstreamTimeout.value = advancedFormData.value.upstreamTimeout.value
  // moreSettingFormData.value.isEnabledUpstreamHttp11.value =
  //   advancedFormData.value.isEnabledUpstreamHttp11.value
  // moreSettingFormData.value.isAcceptHttpV1.value = advancedFormData.value.isAcceptHttpV1
  // moreSettingFormData.value.isInsertRidHeaderToOrigin.value =
  //   advancedFormData.value.isInsertRidHeaderToOrigin
  // moreSettingFormData.value.setCustomHostHeader.value =
  //   advancedFormData.value.setCustomHostHeader
  // moreSettingFormData.value.customHostHeader.value =
  //   advancedFormData.value.customHostHeader
  // moreSettingFormData.value.isUpgradeInsecureRequest.value =
  //   advancedFormData.value.isUpgradeInsecureRequest
  // moreSettingFormData.value.websocketPath.value = advancedFormData.value.websocketPath
  // moreSettingFormData.value.proxyBufferSize.value = advancedFormData.value.proxyBufferSize
  // moreSettingFormData.value.maxUploadSize.value = advancedFormData.value.maxUploadSize
  // moreSettingFormData.value.cusFollowCachePath.value =
  //   advancedFormData.value.cusFollowCachePath
  // moreSettingFormData.value.cusFollowCacheFile.value =
  //   advancedFormData.value.cusFollowCacheFile
  // moreSettingFormData.value.cusCachepathExp.value = advancedFormData.value.cusCachepathExp
  // moreSettingFormData.value.cusCachepathSrvexp.value =
  //   advancedFormData.value.cusCachepathSrvexp
  // moreSettingFormData.value.cusCachepathHottime.value =
  //   advancedFormData.value.cusCachepathHottime
  // moreSettingFormData.value.cusCachefileExp.value = advancedFormData.value.cusCachefileExp
  // moreSettingFormData.value.cusCachefileSrvexp.value =
  //   advancedFormData.value.cusCachefileSrvexp
  // moreSettingFormData.value.cusCachefileHottime.value =
  //   advancedFormData.value.cusCachefileHottime
  // moreSettingFormData.value.defCachefileExp.value = advancedFormData.value.defCachefileExp
  // moreSettingFormData.value.defCachefileSrvexp.value =
  //   advancedFormData.value.defCachefileSrvexp
  // moreSettingFormData.value.defCachefileHottime.value =
  //   advancedFormData.value.defCachefileHottime
}

const submitMoreSetting = async () => {
  isLoading.value = true

  console.log({ 'onSubmit - moreSettingFormData': moreSettingFormData.value })

  const submit_data = {
    ...moreSettingFormData.value,
    // errorHtmlPageName: moreSettingFormData.value.errorHtmlPageName.value,
    // upstreamTimeout: moreSettingFormData.value.upstreamTimeout.value,
    // isEnabledUpstreamHttp11: moreSettingFormData.value.isEnabledUpstreamHttp11.value,
    // isAcceptHttpV1: moreSettingFormData.value.isAcceptHttpV1.value,
    // isInsertRidHeaderToOrigin: moreSettingFormData.value.isInsertRidHeaderToOrigin.value,
    // setCustomHostHeader: moreSettingFormData.value.setCustomHostHeader.value,
    // customHostHeader: moreSettingFormData.value.customHostHeader.value,
    // isUpgradeInsecureRequest: moreSettingFormData.value.isUpgradeInsecureRequest.value,
    // websocketPath: moreSettingFormData.value.websocketPath.value,
    // proxyBufferSize: moreSettingFormData.value.proxyBufferSize.value,
    // maxUploadSize: moreSettingFormData.value.maxUploadSize.value,
    // cusFollowCachePath: moreSettingFormData.value.cusFollowCachePath.value,
    // cusFollowCacheFile: moreSettingFormData.value.cusFollowCacheFile.value,
    // cusCachepathExp: moreSettingFormData.value.cusCachepathExp.value,
    // cusCachepathSrvexp: moreSettingFormData.value.cusCachepathSrvexp.value,
    // cusCachepathHottime: moreSettingFormData.value.cusCachepathHottime.value,
    // cusCachefileExp: moreSettingFormData.value.cusCachefileExp.value,
    // cusCachefileSrvexp: moreSettingFormData.value.cusCachefileSrvexp.value,
    // cusCachefileHottime: moreSettingFormData.value.cusCachefileHottime.value,
    // defCachefileExp: moreSettingFormData.value.defCachefileExp.value,
    // defCachefileSrvexp: moreSettingFormData.value.defCachefileSrvexp.value,
    // defCachefileHottime: moreSettingFormData.value.defCachefileHottime.value,
  }

  const validation = await validateAdvancedForm(
    'moreSetting',
    submit_data,
    moreSettingFormData.value
  )
  console.log({
    'OnSubmit - MoreSetting': {
      validation: validation,
      submit_data: submit_data,
    },
  })

  if (!validation.status) {
    moreSettingFormData.value = validation.advancedData
  } else {
    console.log('Update More Setting')
    emit('submitAdvancedMoreSetting', submit_data)
    emit('clickDropdown')
  }
  isLoading.value = false
}

watch(showAdvancedModal, () => {
  updateMoreSettingFormData()
})
</script>

<template>
  <VModal
    :open="showAdvancedModal"
    title="Edit Advanced Settings"
    size="large"
    actions="right"
    noscroll
    @close="emit('clickDropdown')"
  >
    <template #content>
      <form class="form-layout modal-form" @submit.prevent="submitMoreSetting">
        <VField>
          <label>{{ t('advancedSetting.error_html_page_name') }}</label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.errorHtmlPageName.value">
                <option v-for="(name, index) in htmlPageNames" :key="index">
                  {{ name }}
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>{{ t('advancedSetting.upstream_timeout') }}</label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.upstreamTimeout.value">
                <option
                  v-for="(time, index) in upstreamTimeout"
                  :key="index"
                  :value="time"
                >
                  {{ time }}s
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <div class="columns is-multiline">
          <div class="column is-6">
            <div class="field">
              <label>{{ t('advancedSetting.upstream_http') }}</label>
              <VControl>
                <label class="radio is-outlined is-primary">
                  <input
                    v-model="moreSettingFormData.isEnabledUpstreamHttp11.value"
                    type="radio"
                    :value="true"
                  />
                  <span></span>
                  {{ t('service.on') }}
                </label>
                <label class="radio is-outlined is-primary">
                  <input
                    v-model="moreSettingFormData.isEnabledUpstreamHttp11.value"
                    type="radio"
                    :value="false"
                  />
                  <span></span>
                  {{ t('service.off') }}
                </label>
              </VControl>
            </div>
            <div class="field">
              <div class="d-flex">
                <label>{{ t('advancedSetting.accept_http') }}</label>
                <div
                  v-tooltip.right="`${t('advancedSetting.tooltip.acceptHttp')}`"
                  class="ml-2"
                >
                  <i class="icon-tooltip fas fa-question-circle"></i>
                </div>
              </div>
              <VControl>
                <label class="radio is-outlined is-primary">
                  <input
                    v-model="moreSettingFormData.isAcceptHttpV1.value"
                    type="radio"
                    :value="true"
                  />
                  <span></span>
                  {{ t('service.on') }}
                </label>
                <label class="radio is-outlined is-primary">
                  <input
                    v-model="moreSettingFormData.isAcceptHttpV1.value"
                    type="radio"
                    :value="false"
                  />
                  <span></span>
                  {{ t('service.off') }}
                </label>
              </VControl>
            </div>
          </div>
          <div class="column is-6">
            <div class="field">
              <div class="d-flex">
                <label>{{ t('advancedSetting.insert_rid') }}</label>
                <div
                  v-tooltip.top="`${t('advancedSetting.tooltip.insertRid')}`"
                  class="ml-2"
                >
                  <i class="icon-tooltip fas fa-question-circle"></i>
                </div>
              </div>
              <VControl>
                <label class="radio is-outlined is-primary">
                  <input
                    v-model="moreSettingFormData.isInsertRidHeaderToOrigin.value"
                    type="radio"
                    :value="true"
                  />
                  <span></span>
                  {{ t('service.on') }}
                </label>
                <label class="radio is-outlined is-primary">
                  <input
                    v-model="moreSettingFormData.isInsertRidHeaderToOrigin.value"
                    type="radio"
                    :value="false"
                  />
                  <span></span>
                  {{ t('service.off') }}
                </label>
              </VControl>
            </div>
            <div class="field">
              <div class="d-flex">
                <label>{{ t('advancedSetting.custom_host') }}</label>
                <div
                  v-tooltip.top="`${t('advancedSetting.tooltip.customHost')}`"
                  class="ml-2"
                >
                  <i class="icon-tooltip fas fa-question-circle"></i>
                </div>
              </div>
              <VControl>
                <label class="radio is-outlined is-primary">
                  <input
                    v-model="moreSettingFormData.setCustomHostHeader.value"
                    type="radio"
                    :value="'on'"
                  />
                  <span></span>
                  {{ t('service.on') }}
                </label>
                <label class="radio is-outlined is-primary">
                  <input
                    v-model="moreSettingFormData.setCustomHostHeader.value"
                    type="radio"
                    :value="'on'"
                  />
                  <span></span>
                  {{ t('service.off') }}
                </label>
              </VControl>
            </div>
          </div>
        </div>
        <VField v-if="moreSettingFormData.setCustomHostHeader.value">
          <label>{{ t('advancedSetting.host') }} *</label>
          <VControl :has-error="moreSettingFormData.customHostHeader.error">
            <input
              v-model="moreSettingFormData.customHostHeader.value"
              type="text"
              class="input"
            />
            <i aria-hidden="true"></i>
          </VControl>
          <p v-if="moreSettingFormData.customHostHeader.error" class="help text-danger">
            {{ t('advancedSetting.warning.enter_host') }}
          </p>
        </VField>
        <div class="columns is-multiline">
          <div class="column is-6">
            <div class="field">
              <div class="d-flex">
                <label>
                  {{ t('advancedSetting.upgrade_insecure_request') }}
                </label>
                <div
                  v-tooltip.top="`${t('advancedSetting.tooltip.upgradeInsecureReq')}`"
                  class="ml-2"
                >
                  <i class="icon-tooltip fas fa-question-circle"></i>
                </div>
              </div>
              <VControl>
                <label class="radio is-outlined is-primary">
                  <input
                    v-model="moreSettingFormData.isUpgradeInsecureRequest.value"
                    type="radio"
                    :value="true"
                  />
                  <span></span>
                  {{ t('service.on') }}
                </label>
                <label class="radio is-outlined is-primary">
                  <input
                    v-model="moreSettingFormData.isUpgradeInsecureRequest.value"
                    type="radio"
                    :value="false"
                  />
                  <span></span>
                  {{ t('service.off') }}
                </label>
              </VControl>
            </div>
          </div>
        </div>
        <VField>
          <label>{{ t('advancedSetting.web_socket_path') }}</label>
          <VControl>
            <textarea
              v-model="moreSettingFormData.websocketPath.value"
              class="textarea"
              rows="4"
              placeholder="socket.io&#10;signair&#10;bar/mypath"
            ></textarea>
          </VControl>
          <p v-if="moreSettingFormData.websocketPath.error" class="help text-danger">
            {{ t('advancedSetting.warning.space_not_allow') }}
          </p>
        </VField>
        <VField>
          <label>{{ t('advancedSetting.proxy_buffer_size') }}</label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.proxyBufferSize.value">
                <option v-for="size in proxyBufferSize" :key="size" :value="size">
                  {{ size }}KB
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>{{ t('advancedSetting.max_upload_size') }}</label>
          <VControl>
            <input
              v-model="moreSettingFormData.maxUploadSize.value"
              type="number"
              class="input"
            />
            <i aria-hidden="true"></i>
          </VControl>
        </VField>
        <VField>
          <label>{{ t('advancedSetting.path_follow_origin') }}</label>
          <VControl>
            <textarea
              v-model="moreSettingFormData.cusFollowCachePath.value"
              class="textarea"
              rows="4"
              placeholder="foo&#10;dontcache&#10;bar/mypath"
            ></textarea>
          </VControl>
          <p v-if="moreSettingFormData.cusFollowCachePath.error" class="help text-danger">
            {{ t('advancedSetting.warning.space_not_allow') }}
          </p>
        </VField>
        <VField>
          <label>{{ t('advancedSetting.file_follow_origin') }}</label>
          <VControl>
            <textarea
              v-model="moreSettingFormData.cusFollowCacheFile.value"
              class="textarea"
              rows="4"
              placeholder="foo&#10;dontcache.html&#10;myfile.js&#10;\.css"
            ></textarea>
          </VControl>
          <p v-if="moreSettingFormData.cusFollowCacheFile.error" class="help text-danger">
            {{ t('advancedSetting.warning.space_not_allow') }}
          </p>
        </VField>
        <VField>
          <label>
            {{ t('advancedSetting.browser_cached_path_expired') }}
          </label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.cusCachepathExp.value">
                <option v-for="path in expired" :key="path">
                  {{ path }}
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>
            {{ t('advancedSetting.server_cached_path_expired') }}
          </label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.cusCachepathSrvexp.value">
                <option v-for="path in expired" :key="path">
                  {{ path }}
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>{{ t('advancedSetting.cached_path_minused') }}</label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.cusCachepathHottime.value">
                <option v-for="path in minused" :key="path">
                  {{ path }}
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>
            {{ t('advancedSetting.browser_cached_file_expired') }}
          </label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.cusCachefileExp.value">
                <option v-for="path in expired" :key="path">
                  {{ path }}
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>
            {{ t('advancedSetting.server_cached_file_expired') }}
          </label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.cusCachefileSrvexp.value">
                <option v-for="path in expired" :key="path">
                  {{ path }}
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>{{ t('advancedSetting.cached_file_minused') }}</label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.cusCachefileHottime.value">
                <option v-for="path in minused" :key="path">
                  {{ path }}
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>
            {{ t('advancedSetting.browser_default_cached_file_expired') }}
          </label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.defCachefileExp.value">
                <option v-for="path in expired" :key="path">
                  {{ path }}
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>{{ t('advancedSetting.server_default_cached_file_expired') }}</label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.defCachefileSrvexp.value">
                <option v-for="path in expired" :key="path">
                  {{ path }}
                </option>
              </select>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>
            {{ t('advancedSetting.default_cached_file_minused') }}
          </label>
          <VControl>
            <div class="select">
              <select v-model="moreSettingFormData.defCachefileHottime.value">
                <option v-for="path in minused" :key="path">
                  {{ path }}
                </option>
              </select>
            </div>
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton :loading="isLoading" color="primary" raised @click="submitMoreSetting">
        {{ t('service.confirmText') }}
      </VButton>
    </template>
  </VModal>
</template>
