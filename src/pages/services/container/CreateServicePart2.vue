<script setup lang="ts">
// import { useWindowScroll } from '@vueuse/core'
import { checkDocumentExist } from '/@src/api/formValidate'
import { ref, reactive } from 'vue'
import { getMaxSubdomainLength } from '/@src/api/system'
import { useI18n } from 'vue-i18n'
import store from '/@src/stores'

// const port_number = ref(80)
// const system_cert = ref('value_1')
// const { y } = useWindowScroll()

const { t } = useI18n()
const emit = defineEmits(['step_forward', 'step_back'])
const props = defineProps({
  httpPort: {
    type: Array,
    default: undefined,
  },
  httpsPort: {
    type: Array,
    default: undefined,
  },
})
const serviceForm = reactive({
  servername: {
    value: '',
    error: false,
    illegalError: false,
    formatError: false,
    lengthError: false,
    nameExistError: false,
    subDomainError: false,
  },
  scheme: { value: ['http'], error: false },
  httpPort: { value: ['80'], error: false },
  httpsPort: { value: ['443'], error: false },
  useHsts: false,
  redirecthttps: false,
  redirectHttpCode: 302,
  domainNameMaxLength: 0,
})
const isLoading = ref(false)
const usableHttpPort = ref([80, 8080, 8880, 2052, 2082, 2086, 2095])
const redirectHttpCodeOptions = ref([301, 302, 307])
const errorHttpsList = ref([])
const portError = ref(false)

const schemeOptions = [
  { value: 'http', label: 'http' },
  { value: 'https', label: 'https' },
]

// const resetForm = () => {
//   serviceForm.servername = {
//     value: '',
//     error: false,
//     illegalError: false,
//     formatError: false,
//     lengthError: false,
//     nameExistError: false,
//     subDomainError: false,
//   }
//   serviceForm.scheme = { value: ['http'], error: false }
//   serviceForm.httpPort = { value: ['80'], error: false }
//   serviceForm.httpsPort = { value: ['443'], error: false }
//   serviceForm.useHsts = false
//   serviceForm.redirecthttps = false
//   serviceForm.domainNameMaxLength = 0
// }

const validator = async (value) => {
  serviceForm.servername.illegalError = false
  serviceForm.servername.formatError = false
  serviceForm.servername.subDomainError = false
  serviceForm.servername.lengthError = false
  serviceForm.servername.nameExistError = false

  let maxSubdomainLengthResult = await getMaxSubdomainLength()
  let maxSubdomainLength = maxSubdomainLengthResult.data.data
  serviceForm.domainNameMaxLength = maxSubdomainLength
  if (!/^[a-z0-9\-\_\.]*$/.test(value)) {
    serviceForm.servername.illegalError = true
  }

  if (value.split('.').length < 2) {
    serviceForm.servername.formatError = true
  }

  // if (value.split(".").length > 3)
  //   return callback(new Error("僅支持三級子域名"));
  if (value.split('.').length > maxSubdomainLength) {
    serviceForm.servername.subDomainError = true
  }

  await checkDocumentExist({
    topic: 'servername',
    fieldVal: value,
  }).then((res) => {
    if (!res.data.success) {
      serviceForm.servername.nameExistError = true
    }
  })
  if (value.length > 100) {
    serviceForm.servername.lengthError = true
  }
}

const checkHttpsPort = () => {
  let firstCondition = false,
    secondCondition = false,
    thirdCondition = false

  errorHttpsList.value = []

  if (Array.isArray(serviceForm.httpsPort.value)) {
    for (let i = 0; i < serviceForm.httpsPort.value.length; i++) {
      let data = Number(serviceForm.httpsPort.value[i])
      if (data == 443) {
        firstCondition = true
      } else {
        firstCondition = false
      }

      if (data > 1000 && data < 5000) {
        secondCondition = true
      } else {
        secondCondition = false
      }

      if (data > 6000 && data < 32768) {
        thirdCondition = true
      } else {
        thirdCondition = false
      }

      if (!firstCondition) {
        if (!secondCondition) {
          if (!thirdCondition) {
            errorHttpsList.value.push(data)
          }
        }
      }
    }
  } else {
    let data = Number(serviceForm.httpsPort.value)
    if (data == 443) {
      firstCondition = true
    }
    if (data > 1000 && data < 5000) {
      secondCondition = true
    }
    if (data > 6000 && data < 32768) {
      thirdCondition = true
    }

    if (!firstCondition) {
      if (!secondCondition) {
        if (!thirdCondition) {
          errorHttpsList.value.push(data)
        }
      }
    }
  }

  if (errorHttpsList.value.length > 0) {
    portError.value = true
  } else {
    portError.value = false
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  checkHttpsPort()
  await validator(serviceForm.servername.value)
  if (
    serviceForm.scheme.value.length > 0 &&
    serviceForm.httpPort.value.length > 0 &&
    serviceForm.httpsPort.value.length > 0 &&
    portError.value == false &&
    serviceForm.servername.value.length > 0 &&
    serviceForm.servername.illegalError == false &&
    serviceForm.servername.formatError == false &&
    serviceForm.servername.subDomainError == false &&
    serviceForm.servername.lengthError == false &&
    serviceForm.servername.nameExistError == false
  ) {
    let submitForm = {
      servername: serviceForm.servername.value,
      scheme: serviceForm.scheme.value,
      httpPort: serviceForm.httpPort.value,
      httpsPort: serviceForm.httpsPort.value,
      useHsts: serviceForm.useHsts,
      redirecthttps: serviceForm.redirecthttps,
      redirectHttpCode: serviceForm.redirectHttpCode,
    }

    store.commit('SET_SSL', submitForm)
    try {
      await store.dispatch('createServiceForm')
    } catch (err) {
      // console.log(err)
    }
    try {
      await store.dispatch('createDomain')
    } catch (err) {
      // console.log(err)
    }
    try {
      await store.dispatch('getCNAME')
    } catch (err) {
      // console.log(err)
    }
    stepForward()
  } else {
    if (serviceForm.servername.value.length == 0) {
      serviceForm.servername.error = true
    } else {
      serviceForm.servername.error = false
    }
    if (serviceForm.scheme.value.length == 0) {
      serviceForm.scheme.error = true
    } else {
      serviceForm.scheme.error = false
    }
    if (
      serviceForm.scheme.value.includes('http') &&
      serviceForm.httpPort.value.length == 0
    ) {
      serviceForm.httpPort.error = true
    } else {
      serviceForm.httpPort.error = false
    }
    if (
      serviceForm.scheme.value.includes('https') &&
      serviceForm.httpsPort.value.length == 0
    ) {
      serviceForm.httpsPort.error = true
    } else {
      serviceForm.httpsPort.error = false
    }
  }

  isLoading.value = false
}

const stepBack = () => {
  emit('step_back')
}
const stepForward = () => {
  emit('step_forward')
}
</script>

<template>
  <form class="form-layout" style="max-width: 1200px" @submit.prevent="handleSubmit">
    <div class="form-outer">
      <div class="form-header stuck-header">
        <div class="form-header-inner">
          <div class="left">
            <h3>{{ t('service.ssl/tls') }}</h3>
          </div>
        </div>
      </div>
      <div class="form-body">
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="fieldset-heading">
            <h4>HTTP / HTTPS {{ t('service.settingText') }}</h4>
          </div>
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField>
                <div class="d-flex">
                  <label>{{ t('service.scheme') }}</label>
                  <div v-tooltip.right="`${t('service.tooltip.scheme')}`" class="ml-2">
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>
                <VControl :has-error="serviceForm.scheme.error == true ? true : false">
                  <Multiselect
                    v-model="serviceForm.scheme.value"
                    :options="schemeOptions"
                    placeholder=""
                    mode="tags"
                    :create-tag="true"
                    no-results-text=""
                  />
                  <p v-if="serviceForm.scheme.error" class="help text-danger">
                    {{ t('ssl.warning.select_scheme') }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField v-if="serviceForm.scheme.value.includes('http')">
                <div class="d-flex">
                  <label>{{ t('ssl.http_port') }}</label>
                  <div v-tooltip.right="`${t('service.tooltip.http_port')}`" class="ml-2">
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>
                <VControl :has-error="serviceForm.httpPort.error == true ? true : false">
                  <Multiselect
                    v-model="serviceForm.httpPort.value"
                    :options="usableHttpPort"
                    placeholder=""
                    mode="tags"
                    :create-tag="true"
                    :searchable="true"
                  />
                  <p v-if="serviceForm.httpPort.error" class="help text-danger">
                    {{ t('ssl.warning.select_http_port') }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField v-if="serviceForm.scheme.value.includes('https')">
                <div class="d-flex">
                  <label>{{ t('ssl.https_port') }}</label>
                  <div
                    v-tooltip.right="`${t('service.tooltip.https_port')}`"
                    class="ml-2"
                  >
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>
                <VControl
                  :has-error="
                    serviceForm.httpsPort.error == true
                      ? true
                      : portError == true
                      ? true
                      : false
                  "
                >
                  <Multiselect
                    v-model="serviceForm.httpsPort.value"
                    :options="props.httpsPort"
                    placeholder=""
                    mode="tags"
                    :searchable="true"
                    :create-tag="true"
                  />
                  <p v-if="serviceForm.httpsPort.error" class="help text-danger">
                    {{ t('ssl.warning.select_https_port') }}
                  </p>
                  <p v-if="portError" class="help text-danger">
                    {{ t('ssl.warning.port_out_of_range') }}
                    <span v-for="(port, index) in errorHttpsList" :key="port"
                      >{{ port
                      }}<template
                        v-if="
                          errorHttpsList.length > 0 && index != errorHttpsList.length - 1
                        "
                        >,</template
                      >
                    </span>
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField v-if="serviceForm.scheme.value.includes('https')">
                <div class="d-flex">
                  <label>{{ t('ssl.redirect_https') }}</label>
                  <div
                    v-tooltip.right="`${t('service.tooltip.redirect_https')}`"
                    class="ml-2"
                  >
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>
                <VControl>
                  <VSwitchSegment
                    v-model="serviceForm.redirecthttps"
                    label-true="On"
                    label-false="Off"
                    color="primary"
                    style="justify-content: flex-start"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField v-if="serviceForm.scheme.value.includes('https')">
                <div class="d-flex">
                  <label>{{ t('ssl.hsts') }}</label>
                  <div v-tooltip.right="`${t('service.tooltip.hsts')}`" class="ml-2">
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>
                <VControl>
                  <VSwitchSegment
                    v-model="serviceForm.useHsts"
                    label-true="On"
                    label-false="Off"
                    color="primary"
                    style="justify-content: flex-start"
                  />
                </VControl>
              </VField>
            </div>

            <div
              v-if="
                serviceForm.redirecthttps == true &&
                serviceForm.scheme.value.includes('https')
              "
              class="column is-6"
            >
              <VField>
                <div class="d-flex">
                  <label>{{ t('ssl.redirect_http_code') }}</label>
                </div>
                <VControl>
                  <div class="select">
                    <select v-model="serviceForm.redirectHttpCode">
                      <template v-for="code in redirectHttpCodeOptions" :key="code">
                        <option :value="code">{{ code }}</option>
                      </template>
                    </select>
                  </div>
                </VControl>
              </VField>
            </div>

            <div class="column is-12">
              <VField>
                <label>{{ t('service.domains') }}</label>
                <VControl
                  :has-error="
                    serviceForm.servername.error == true ||
                    serviceForm.servername.illegalError == true ||
                    serviceForm.servername.formatError == true ||
                    serviceForm.servername.lengthError == true ||
                    serviceForm.servername.nameExistError == true ||
                    serviceForm.servername.subDomainError == true
                      ? true
                      : false
                  "
                >
                  <input
                    v-model="serviceForm.servername.value"
                    type="text"
                    class="input"
                    placeholder="Domains"
                    @blur="validator(serviceForm.servername.value)"
                  />
                  <p v-if="serviceForm.servername.error" class="help text-danger">
                    {{ t('ssl.warning.enter_domains') }}
                  </p>
                  <p v-if="serviceForm.servername.illegalError" class="help text-danger">
                    {{ t('service.validate.validateIllegalText') }}
                  </p>
                  <p v-if="serviceForm.servername.formatError" class="help text-danger">
                    {{ t('service.validate.validateIllegalCharsPrefix') }}: "."
                  </p>
                  <p v-if="serviceForm.servername.lengthError" class="help text-danger">
                    {{ t('service.validate.validateExceedLengthPrefix') }}: 100
                    {{ serviceForm.domainNameMaxLength }}
                  </p>
                  <p
                    v-if="serviceForm.servername.subDomainError"
                    class="help text-danger"
                  >
                    {{ t('service.validate.validateSubdomainLengthText') }}
                  </p>
                  <p
                    v-if="serviceForm.servername.nameExistError"
                    class="help text-danger"
                  >
                    Domain
                    {{ t('service.validate.validateExistText') }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-12 d-flex">
              <div class="button-wrap">
                <VButton
                  class="cancel"
                  color="white"
                  bold
                  raised
                  fullwidth
                  @click="stepBack"
                >
                  {{ t('service.backText') }}
                </VButton>
              </div>
              <div class="button-wrap">
                <VButton
                  color="primary"
                  :loading="isLoading"
                  type="submit"
                  bold
                  raised
                  fullwidth
                >
                  {{ t('service.saveText') }}
                </VButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
