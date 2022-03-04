<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// import { usableHttpPortData, httpsPortData } from '/@src/data/layouts/services-lines'
import { getFormOptions } from '/@src/api/formOptions'
// import { getEsData } from '/@src/api/esdata'
import store from '/@src/stores/index'
import { validateSSLForm } from '/@src/pages/services-detail/validation/validate'

const { t } = useI18n()
const emit = defineEmits(['clickDropdown', 'submitData'])
const props = defineProps({
  overviewData: {
    type: Object,
    default: () => {},
  },
  sslDropdown: {
    type: Boolean,
    default: () => false,
  },
})

const isLoading = ref(false)
const redirectHttpCodeOptions = ref([301, 302, 307])
const sslFormData = ref({
  scheme: { value: [], error: false },
  httpPort: { value: [], error: false },
  httpsPort: { value: [], error: false },
  useHsts: { value: false, error: false },
  redirecthttps: { value: false, error: false },
  redirectHttpCode: { value: '', error: false },
})

// const sslFormData = computed(() => {
//   return {
//     scheme: { value: props.overviewData?.scheme ?? '', error: false },
//     httpPort: { value: props.overviewData?.httpPort ?? '', error: false },
//     httpsPort: { value: props.overviewData?.httpsPort ?? '', error: false },
//     useHsts: props.overviewData?.useHsts ?? '',
//     redirecthttps: props.overviewData?.redirecthttps ?? '',
//     redirectHttpCode: props.overviewData?.redirectHttpCode ?? '',
//   }
// })
const httpPortOptions = ref([80, 8080, 8880, 2052, 2082, 2086, 2095])
const httpsPort = ref([])
const invalidHttpsPort = ref([])
const overviewData = computed(() => {
  return props.overviewData
})
const sslDropdown = computed(() => {
  return props.sslDropdown
})

const updateSslFormData = () => {
  sslFormData.value.scheme.value = overviewData.value?.scheme
  sslFormData.value.httpPort.value = overviewData.value?.httpPort
  sslFormData.value.httpsPort.value = overviewData.value?.httpsPort
  sslFormData.value.useHsts.value = overviewData.value?.useHsts
  sslFormData.value.redirecthttps.value = overviewData.value?.redirecthttps
  sslFormData.value.redirectHttpCode.value = overviewData.value?.redirectHttpCode
}

const onClickSslScheme = (scheme: string) => {
  if (!sslFormData.value.scheme.value.includes(scheme)) {
    sslFormData.value.scheme.value.push(scheme)
  } else {
    sslFormData.value.scheme.value = sslFormData.value.scheme.value.filter(
      (e) => e !== scheme
    )
  }

  sslFormData.value.scheme.error =
    sslFormData.value.scheme.value.length === 0 ? true : false
}

const checkHttpsPort = () => {
  invalidHttpsPort.value = []

  if (sslFormData.value.httpsPort.value.length > 0) {
    // change all input to Number
    // If https create new, data type is string
    sslFormData.value.httpsPort.value = sslFormData.value.httpsPort.value.map((x) => {
      return Number(x)
    })
    let httpPort = Object.values(sslFormData.value.httpPort.value)
    let httpsPort = Object.values(sslFormData.value.httpsPort.value)
    // Check: Https cannot same as Http
    let duplicatesPort = httpsPort.filter((x) => httpPort.includes(parseInt(x)))
    // Check: Https cannot out of range
    let invalidPort = httpsPort.filter((x) => {
      if (x > 4999 && x < 6001) {
        return x
      }
    })

    if (invalidPort.length > 0 || duplicatesPort.length > 0) {
      let error_arr = [].concat(invalidPort, duplicatesPort)
      invalidHttpsPort.value = error_arr.filter(
        (item, index) => error_arr.indexOf(item) === index
      )
    }
  }
}

const submitSSL = async () => {
  isLoading.value = true

  const submit_data = {
    ...overviewData.value,
    scheme: Object.values(sslFormData.value.scheme.value),
    httpPort: Object.values(sslFormData.value.httpPort.value),
    httpsPort: Object.values(sslFormData.value.httpsPort.value),
    useHsts: sslFormData.value.useHsts.value,
    redirecthttps: sslFormData.value.redirecthttps.value,
    redirectHttpCode: sslFormData.value.redirectHttpCode.value,
  }

  const validation = await validateSSLForm(submit_data, sslFormData.value)

  if (!validation.status || invalidHttpsPort.value.length > 0) {
    sslFormData.value = validation.sslFormData
  } else {
    emit('submitData', submit_data)
    emit('clickDropdown')
  }

  isLoading.value = false
}

onMounted(async () => {
  await getFormOptions(
    `/groupby/httpsPort?groupName=${store.state.queryGroupName}&origins=***`
  ).then((res) => {
    httpsPort.value = res.data.options
  })
})
watch(overviewData, () => {
  updateSslFormData()
})
</script>

<template>
  <!-- <div v-if="sslFormData != null" ref="sslRef" class="column is-12"> -->

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
            {{ t('service.ssl/tls') }}
          </span>
        </div>
        <div class="vertical-divider" />
        <div class="horizontal-divider" />

        <!-- Display Value -->
        <div v-if="!sslDropdown" class="column is-9">
          <div class="columns container">
            <div class="column meta is-6">
              <span class="dark-inverted service-detail-card-label">
                {{ t('ssl.http_or_https') }}
              </span>
              <div class="m-t-5">
                <div v-if="sslFormData.scheme.value.length > 0">
                  <template v-for="type in sslFormData.scheme.value" :key="type">
                    <VTag
                      rounded
                      color="primary"
                      class="m-r-5"
                      style="margin-bottom: 0.25rem; margin-top: 0.25rem"
                      :label="type"
                    />
                  </template>
                </div>
                <span v-else>-</span>
              </div>
            </div>
            <div
              v-if="sslFormData.scheme.value.includes('http')"
              class="column meta is-6"
            >
              <span class="dark-inverted service-detail-card-label">
                {{ t('ssl.http_port') }}
              </span>
              <div class="m-t-5">
                <div v-if="sslFormData.httpPort.value.length > 0">
                  <template
                    v-for="http in sslFormData.httpPort.value.slice(0, 6)"
                    :key="http"
                  >
                    <VTag
                      rounded
                      color="primary"
                      class="m-r-5 c"
                      style="margin-bottom: 0.25rem; margin-top: 0.25rem"
                      :label="http"
                    />
                  </template>
                </div>
                <span v-else>-</span>
              </div>
            </div>
          </div>
          <div class="columns container">
            <div
              v-if="sslFormData.scheme.value.includes('https')"
              class="column meta is-6"
            >
              <span class="dark-inverted service-detail-card-label">
                {{ t('ssl.https_port') }}
              </span>
              <div class="m-t-5">
                <div v-if="sslFormData.httpsPort.value.length > 0">
                  <template
                    v-for="https in sslFormData.httpsPort.value.slice(0, 6)"
                    :key="https"
                  >
                    <VTag
                      rounded
                      color="primary"
                      class="m-r-5"
                      style="margin-bottom: 0.25rem; margin-top: 0.25rem"
                      :label="https"
                    />
                  </template>
                </div>
              </div>
            </div>
            <div
              v-if="sslFormData.scheme.value.includes('https')"
              class="column meta is-6"
            >
              <span class="dark-inverted service-detail-card-label">
                {{ t('ssl.hsts') }}
              </span>
              <div class="m-t-5">
                <span style="color: #a2a5b9">
                  {{ sslFormData.useHsts.value ? 'On' : 'Off' }}
                </span>
              </div>
            </div>
          </div>
          <div
            v-if="
              sslFormData.scheme.value.includes('http') &&
              sslFormData.scheme.value.includes('https')
            "
            class="columns container"
          >
            <div class="column meta is-6">
              <span class="dark-inverted service-detail-card-label">
                {{ t('ssl.redirect_https') }}
              </span>
              <div class="m-t-5">
                <span style="color: #a2a5b9">
                  {{ sslFormData.redirecthttps.value ? 'On' : 'Off' }}
                </span>
              </div>
            </div>

            <div v-if="sslFormData.redirecthttps.value" class="meta column is-6">
              <span class="dark-inverted service-detail-card-label">
                {{ t('ssl.redirect_http_code') }}
              </span>
              <div class="m-t-5">
                <span style="color: #a2a5b9">
                  {{ sslFormData.redirectHttpCode.value }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- Edit Value -->
        <div v-else class="column is-9">
          <form class="" @submit.prevent="submitSSL">
            <div class="columns container">
              <div class="column meta is-6">
                <span class="dark-inverted service-detail-card-label">
                  {{ t('ssl.http_or_https') }}
                </span>

                <div class="edit" style="margin-top: 1rem">
                  <VButton
                    rounded
                    bold
                    :color="sslFormData.scheme.value.includes('http') ? 'primary' : ''"
                    @click="onClickSslScheme('http')"
                    >HTTP
                  </VButton>
                  <VButton
                    rounded
                    bold
                    :color="sslFormData.scheme.value.includes('https') ? 'primary' : ''"
                    @click="onClickSslScheme('https')"
                    >HTTPS
                  </VButton>
                  <p v-if="sslFormData.scheme.error" class="help text-danger">
                    {{ t('ssl.warning.select_scheme') }}
                  </p>
                </div>
              </div>
              <div
                v-if="sslFormData.scheme.value.includes('http')"
                class="column meta is-6"
              >
                <div class="d-flex">
                  <span class="dark-inverted" style="color: gray">
                    {{ t('ssl.http_port') }}
                  </span>
                  <div v-tooltip.right="`${t('ssl.tooltip.httpPort')}`" class="ml-2">
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>
                <div style="margin-top: 1rem">
                  <VControl :has-error="sslFormData.httpPort.error">
                    <Multiselect
                      v-model="sslFormData.httpPort.value"
                      :options="httpPortOptions"
                      placeholder=""
                      mode="tags"
                      :searchable="true"
                    />
                    <p v-if="sslFormData.httpPort.error" class="help text-danger">
                      {{ t('ssl.warning.select_http_port') }}
                    </p>
                  </VControl>
                </div>
              </div>
            </div>

            <div
              v-if="sslFormData.scheme.value.includes('https')"
              class="columns container"
            >
              <div class="column meta is-6">
                <div class="d-flex">
                  <span class="dark-inverted" style="color: gray">
                    {{ t('ssl.https_port') }}
                  </span>
                  <div v-tooltip.right="`${t('ssl.tooltip.httpsPort')}`" class="ml-2">
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>

                <div class="edit" style="margin-top: 1rem">
                  <VControl>
                    <Multiselect
                      v-model="sslFormData.httpsPort.value"
                      :options="httpsPort"
                      placeholder=""
                      mode="tags"
                      :searchable="true"
                      :create-tag="true"
                      @select="checkHttpsPort"
                      @deselect="checkHttpsPort"
                    />
                    <p v-if="invalidHttpsPort.length > 0" class="help text-danger">
                      {{ t('ssl.warning.port_out_of_range') }} :
                      {{ invalidHttpsPort.join(', ') }}
                    </p>
                    <p v-if="sslFormData.httpsPort.error" class="help text-danger">
                      {{ t('ssl.warning.select_http_port') }}.
                    </p>
                  </VControl>
                </div>
              </div>
              <div class="column meta is-6">
                <div class="d-flex">
                  <span class="dark-inverted" style="color: gray; width: fit-content">
                    {{ t('ssl.hsts') }}
                  </span>
                  <div v-tooltip.right="`${t('service.tooltip.hsts')}`" class="ml-2">
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>
                <div class="edit" style="margin-top: 1rem">
                  <VSwitchSegment
                    v-model="sslFormData.useHsts.value"
                    style="justify-content: flex-start"
                    label-true="On"
                    label-false="Off"
                    color="primary"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="
                sslFormData.scheme.value.includes('http') &&
                sslFormData.scheme.value.includes('https')
              "
              class="columns container"
            >
              <div class="column meta is-6">
                <div class="d-flex">
                  <span class="dark-inverted" style="color: gray; width: fit-content">
                    {{ t('ssl.redirect_https') }}
                  </span>

                  <div
                    v-tooltip.right="`${t('service.tooltip.redirect_https')}`"
                    class="ml-2"
                  >
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>
                <div class="edit" style="margin-top: 1rem">
                  <VSwitchSegment
                    v-model="sslFormData.redirecthttps.value"
                    style="justify-content: flex-start"
                    label-true="On"
                    label-false="Off"
                    color="primary"
                  />
                </div>
              </div>

              <div v-if="sslFormData.redirecthttps.value" class="meta column is-6">
                <span class="dark-inverted" style="color: gray">
                  {{ t('ssl.redirect_http_code') }}
                </span>
                <VField>
                  <VControl>
                    <div class="select">
                      <select v-model="sslFormData.redirectHttpCode.value">
                        <template v-for="code in redirectHttpCodeOptions" :key="code">
                          <option :value="code">{{ code }}</option>
                        </template>
                      </select>
                    </div>
                  </VControl>
                </VField>
              </div>
            </div>
            <div class="columns container">
              <div class="column meta is-12">
                <div class="right" style="float: right; margin-top: 2rem">
                  <VButton @click="emit('clickDropdown')">
                    <div class="light-text">
                      {{ t('service.cancelText') }}
                    </div>
                  </VButton>
                  <VButton :loading="isLoading" color="primary" @click="submitSSL">
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
</template>
