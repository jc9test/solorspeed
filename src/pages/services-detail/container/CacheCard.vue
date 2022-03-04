<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { validateCacheForm } from '/@src/pages/services-detail/validation/validate'

const { t } = useI18n()
const emit = defineEmits(['clickDropdown', 'submitData'])
const props = defineProps({
  overviewData: {
    type: Object,
    default: () => {},
  },
  cacheDropdown: {
    type: Boolean,
    default: () => false,
  },
})

const isLoading = ref(false)
const showCacheModal = ref(false)
const showNoCacheModal = ref(false)
const cacheFormData = ref({
  proxyCacheIgnoreArgs: false,
  cusCachepath: '',
  cusCachefile: '',
  forceCusCachePath: '',
  forceCusCacheFile: '',
  cusNoncachepath: '',
  cusNonachefile: '',
})
const cacheFormDataChanges = ref({
  proxyCacheIgnoreArgs: { value: false, error: false },
  cusCachepath: { value: '', error: false },
  cusCachefile: { value: '', error: false },
  forceCusCachePath: { value: '', error: false },
  forceCusCacheFile: { value: '', error: false },
  cusNoncachepath: { value: '', error: false },
  cusNonachefile: { value: '', error: false },
})
const cacheDisplayData = ref({
  cusCachepath: [],
  cusCachefile: [],
  forceCusCachePath: [],
  forceCusCacheFile: [],
  cusNoncachepath: [],
  cusNonachefile: [],
})
const overviewData = computed(() => {
  return props.overviewData
})
const cacheDropdown = computed(() => {
  return props.cacheDropdown
})

const updateCacheFormData = () => {
  cacheFormData.value.cusCachepath = overviewData.value.cusCachepath
  cacheFormData.value.cusCachefile = overviewData.value.cusCachefile
  cacheFormData.value.forceCusCachePath = overviewData.value.forceCusCachePath
  cacheFormData.value.forceCusCacheFile = overviewData.value.forceCusCacheFile
  cacheFormData.value.cusNoncachepath = overviewData.value.cusNoncachepath
  cacheFormData.value.cusNonachefile = overviewData.value.cusNonachefile
  refreshCacheDisplayData()
}
const refreshCacheDisplayData = () => {
  cacheDisplayData.value.cusCachepath = processDisplayTag(
    cacheFormData.value.cusCachepath
  )
  cacheDisplayData.value.cusCachefile = processDisplayTag(
    cacheFormData.value.cusCachefile
  )
  cacheDisplayData.value.forceCusCachePath = processDisplayTag(
    cacheFormData.value.forceCusCachePath
  )
  cacheDisplayData.value.forceCusCacheFile = processDisplayTag(
    cacheFormData.value.forceCusCacheFile
  )
  cacheDisplayData.value.cusNoncachepath = processDisplayTag(
    cacheFormData.value.cusNoncachepath
  )
  cacheDisplayData.value.cusNonachefile = processDisplayTag(
    cacheFormData.value.cusNonachefile
  )
}
const processDisplayTag = (data) => {
  return data ? data.split('\n') : []
}

const onClickUpdateCacheModal = (type) => {
  switch (type) {
    case 'cache':
      showCacheModal.value = !showCacheModal.value
      break
    case 'nocache':
      showNoCacheModal.value = !showNoCacheModal.value
      break
  }

  cacheFormDataChanges.value.proxyCacheIgnoreArgs.value =
    cacheFormData.value.proxyCacheIgnoreArgs
  cacheFormDataChanges.value.cusCachepath.value = cacheFormData.value.cusCachepath
  cacheFormDataChanges.value.cusCachefile.value = cacheFormData.value.cusCachefile
  cacheFormDataChanges.value.forceCusCachePath.value =
    cacheFormData.value.forceCusCachePath
  cacheFormDataChanges.value.forceCusCacheFile.value =
    cacheFormData.value.forceCusCacheFile
  cacheFormDataChanges.value.cusNoncachepath.value = cacheFormData.value.cusNoncachepath
  cacheFormDataChanges.value.cusNonachefile.value = cacheFormData.value.cusNonachefile
}

const updateCacheForm = async (type) => {
  const validation = await validateCacheForm(type, cacheFormDataChanges.value)

  if (!validation.status) {
    cacheFormDataChanges.value = validation.cacheData
  } else {
    cacheFormData.value.proxyCacheIgnoreArgs =
      cacheFormDataChanges.value.proxyCacheIgnoreArgs.value
    cacheFormData.value.cusCachepath = cacheFormDataChanges.value.cusCachepath.value
    cacheFormData.value.cusCachefile = cacheFormDataChanges.value.cusCachefile.value
    cacheFormData.value.forceCusCachePath =
      cacheFormDataChanges.value.forceCusCachePath.value
    cacheFormData.value.forceCusCacheFile =
      cacheFormDataChanges.value.forceCusCacheFile.value
    cacheFormData.value.cusNoncachepath = cacheFormDataChanges.value.cusNoncachepath.value
    cacheFormData.value.cusNonachefile = cacheFormDataChanges.value.cusNonachefile.value

    // showCacheModal.value = false
    // showNoCacheModal.value = false
    onClickUpdateCacheModal(type)
    refreshCacheDisplayData()
  }
}
const submitCache = async () => {
  isLoading.value = true

  const submit_data = {
    ...overviewData.value,
    proxyCacheIgnoreArgs: cacheFormData.value.proxyCacheIgnoreArgs,
    cusCachepath: cacheFormData.value.cusCachepath,
    cusCachefile: cacheFormData.value.cusCachefile,
    forceCusCachePath: cacheFormData.value.forceCusCachePath,
    forceCusCacheFile: cacheFormData.value.forceCusCacheFile,
    cusNoncachepath: cacheFormData.value.cusNoncachepath,
    cusNonachefile: cacheFormData.value.cusNonachefile,
  }

  emit('submitData', submit_data)
  emit('clickDropdown')
  isLoading.value = false
}

watch(overviewData, () => {
  updateCacheFormData()
})
</script>

<template>
  <!-- <div v-if="tableData != null" ref="cacheRef" class="column is-12"> -->

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
            {{ t('cacheRules.cache_rules') }}
          </span>
        </div>
        <div class="vertical-divider" />
        <div class="horizontal-divider" />

        <!-- Display Value & Edit Button -->
        <div class="column is-9">
          <div class="columns container">
            <div class="column meta is-6">
              <span class="dark-inverted" style="color: gray">
                {{ t('cacheRules.cache_rules') }}
              </span>
              <VIconButton
                v-if="cacheDropdown"
                :outlined="true"
                color="primary"
                circle
                icon="feather:plus"
                class="setting-btn add-btn"
                @click="onClickUpdateCacheModal('cache')"
              ></VIconButton>

              <div class="m-t-5">
                <div class="cache-item">
                  <span class="dark-inverted">
                    {{ t('cacheRules.cache_path') }}
                  </span>
                  <div v-if="cacheDisplayData.cusCachepath.length > 0">
                    <VTag
                      v-for="tag in cacheDisplayData.cusCachepath"
                      :key="tag"
                      rounded
                      color="primary"
                      class="m-r-5 cache-tag"
                      :label="tag"
                    />
                  </div>
                  <span v-else>-</span>
                </div>

                <div class="cache-item">
                  <span class="dark-inverted">
                    {{ t('cacheRules.cache_file') }}
                  </span>
                  <div v-if="cacheDisplayData.cusCachefile.length > 0">
                    <VTag
                      v-for="tag in cacheDisplayData.cusCachefile"
                      :key="tag"
                      rounded
                      color="primary"
                      class="m-r-5 cache-tag"
                      :label="tag"
                    />
                  </div>
                  <span v-else>-</span>
                </div>

                <div class="cache-item">
                  <span>{{ t('cacheRules.force_cuscache_path') }}</span>
                  <div v-if="cacheDisplayData.forceCusCachePath.length > 0">
                    <VTag
                      v-for="tag in cacheDisplayData.forceCusCachePath"
                      :key="tag"
                      rounded
                      color="primary"
                      class="m-r-5 cache-tag"
                      :label="tag"
                    />
                  </div>
                  <span v-else>-</span>
                </div>

                <div class="cache-item">
                  <span>{{ t('cacheRules.force_cuscache_file') }}</span>
                  <div v-if="cacheDisplayData.forceCusCacheFile.length > 0">
                    <VTag
                      v-for="tag in cacheDisplayData.forceCusCacheFile"
                      :key="tag"
                      rounded
                      color="primary"
                      class="m-r-5 cache-tag"
                      :label="tag"
                    />
                  </div>
                  <span v-else>-</span>
                </div>
              </div>
            </div>

            <div class="column meta is-6">
              <span class="dark-inverted" style="color: gray">
                {{ t('cacheRules.no_cache_rules') }}
              </span>
              <VIconButton
                v-if="cacheDropdown"
                :outlined="true"
                color="primary"
                circle
                icon="feather:plus"
                class="setting-btn add-btn"
                @click="onClickUpdateCacheModal('nocache')"
              ></VIconButton>

              <div class="m-t-5">
                <div class="cache-item">
                  <span>{{ t('cacheRules.no_cached_path') }}</span>
                  <div v-if="cacheDisplayData.cusNoncachepath.length > 0">
                    <VTag
                      v-for="tag in cacheDisplayData.cusNoncachepath"
                      :key="tag"
                      rounded
                      color="primary"
                      class="m-r-5 cache-tag"
                      :label="tag"
                    />
                  </div>
                  <span v-else>-</span>
                </div>

                <div class="cache-item">
                  <span>{{ t('cacheRules.no_cached_file') }}</span>
                  <div v-if="cacheDisplayData.cusNonachefile.length > 0">
                    <VTag
                      v-for="tag in cacheDisplayData.cusNonachefile"
                      :key="tag"
                      rounded
                      color="primary"
                      class="m-r-5 cache-tag"
                      :label="tag"
                    />
                  </div>
                  <span v-else>-</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="cacheDropdown" class="columns container">
            <div class="column meta is-12">
              <div class="right" style="float: right; margin-top: 2rem">
                <VButton @click="emit('clickDropdown')">
                  <div class="light-text">
                    {{ t('service.cancelText') }}
                  </div>
                </VButton>
                <VButton color="primary" @click="submitCache">
                  <div>{{ t('service.saveText') }}</div>
                </VButton>
              </div>
            </div>
          </div>
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

  <!-- Cache Rules -->
  <VModal
    :open="showCacheModal"
    title="Add Cache Rules"
    size="big"
    actions="right"
    @close="onClickUpdateCacheModal('cache')"
  >
    <template #content>
      <form class="modal-form" @submit.prevent>
        <div class="field">
          <label>{{ t('cacheRules.proxyCacheIgnoreArgs') }}</label>
          <div class="control">
            <div class="https-switch">
              <VControl class="https-switch">
                <VSwitchSegment
                  v-model="cacheFormDataChanges.proxyCacheIgnoreArgs.value"
                  label-true="On"
                  label-false="Off"
                  color="primary"
                  style="justify-content: flex-start"
                />
              </VControl>
            </div>
          </div>
        </div>
        <div class="field">
          <label>{{ t('cacheRules.cache_path') }}</label>
          <div class="control">
            <VControl>
              <textarea
                v-model="cacheFormDataChanges.cusCachepath.value"
                class="textarea"
                rows="4"
                placeholder="foo$&#10;cache$&#10;bar/mypath"
              ></textarea>
            </VControl>
            <p v-if="cacheFormDataChanges.cusCachepath.error" class="help text-danger">
              {{ t('cacheRules.warning.space_not_allow') }}
            </p>
          </div>
        </div>
        <div class="field">
          <div class="d-flex">
            <label>{{ t('cacheRules.cache_file') }}</label>
            <div
              v-tooltip.right="
                `${t(
                  'cacheRules.tooltip.cache'
                )} (bmp|class|css|csv|doc|docx|ejs|eot|eps|gif|ico|jar|jpeg|jpg|js|mid|midi|otf|pdf| pict|pls|png|ppt|pptx|ps|svg|svgz|swf|tif|tiff|ttf|webp|woff|woff2|xls|xlsx)`
              "
              class="ml-2"
            >
              <i class="icon-tooltip fas fa-question-circle"></i>
            </div>
          </div>
          <div class="control">
            <VControl>
              <textarea
                v-model="cacheFormDataChanges.cusCachefile.value"
                class="textarea"
                rows="4"
                placeholder="foo$&#10;cache.html$&#10;myfile.js$&#10;\.css"
              ></textarea>
            </VControl>
            <p v-if="cacheFormDataChanges.cusCachefile.error" class="help text-danger">
              {{ t('cacheRules.warning.space_not_allow') }}
            </p>
          </div>
        </div>
        <div class="field">
          <label>{{ t('cacheRules.force_cuscache_path') }}</label>
          <div class="control">
            <VControl>
              <textarea
                v-model="cacheFormDataChanges.forceCusCachePath.value"
                class="textarea"
                rows="4"
                placeholder="foo$&#10;cache$&#10;bar/mypath"
              ></textarea>
            </VControl>
            <p
              v-if="cacheFormDataChanges.forceCusCachePath.error"
              class="help text-danger"
            >
              {{ t('cacheRules.warning.space_not_allow') }}
            </p>
          </div>
        </div>
        <div class="field">
          <label>{{ t('cacheRules.force_cuscache_file') }}</label>
          <div class="control">
            <VControl>
              <textarea
                v-model="cacheFormDataChanges.forceCusCacheFile.value"
                class="textarea"
                rows="4"
                placeholder="foo$&#10;cache.html$&#10;myfile.js$&#10;\.css"
              ></textarea>
            </VControl>
            <p
              v-if="cacheFormDataChanges.forceCusCacheFile.error"
              class="help text-danger"
            >
              {{ t('cacheRules.warning.space_not_allow') }}
            </p>
          </div>
        </div>
      </form>
    </template>
    <template #action>
      <VButton raised color="primary" @click="updateCacheForm('cache')">
        {{ t('service.createText') }}
      </VButton>
    </template>
  </VModal>

  <!-- No Cache Rules -->
  <VModal
    :open="showNoCacheModal"
    title="Add No Cache Rules"
    size="big"
    actions="right"
    @close="onClickUpdateCacheModal('nocache')"
  >
    <template #content>
      <form class="modal-form">
        <div class="field">
          <label>{{ t('cacheRules.no_cached_path') }}</label>
          <div class="control">
            <VControl>
              <textarea
                v-model="cacheFormDataChanges.cusNoncachepath.value"
                class="textarea"
                rows="4"
                placeholder="foo$&#10;dontcache$&#10;bar/mypath"
              ></textarea>
            </VControl>
            <p v-if="cacheFormDataChanges.cusNoncachepath.error" class="help text-danger">
              {{ t('cacheRules.warning.space_not_allow') }}
            </p>
          </div>
        </div>
        <div class="field">
          <label>{{ t('cacheRules.no_cached_file') }}</label>
          <div class="control">
            <VControl>
              <textarea
                v-model="cacheFormDataChanges.cusNonachefile.value"
                class="textarea"
                rows="4"
                placeholder="foo$&#10;dontcache.html$&#10;myfile.js$&#10;\.css"
              ></textarea>
            </VControl>
            <p v-if="cacheFormDataChanges.cusNonachefile.error" class="help text-danger">
              {{ t('cacheRules.warning.space_not_allow') }}
            </p>
          </div>
        </div>
      </form>
    </template>
    <template #action>
      <VButton raised color="primary" @click="updateCacheForm('nocache')">
        {{ t('service.createText') }}
      </VButton>
    </template>
  </VModal>
</template>
