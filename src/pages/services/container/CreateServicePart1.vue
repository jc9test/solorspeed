<script setup lang="ts">
// import { useWindowScroll } from '@vueuse/core'
import { ref, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { checkDocumentExist } from '/@src/api/formValidate'
import store from '/@src/stores'

// const originPort = ref(80)
// const port_mapping = ref('value_1')
// const { y } = useWindowScroll()

const { t } = useI18n()
const emit = defineEmits(['step_forward', 'step_back'])
const props = defineProps({
  package: {
    type: Object,
    default: () => {},
  },
  httpPort: {
    type: Array,
    default: () => [],
  },
  httpsPort: {
    type: Array,
    default: () => [],
  },
  origins: {
    type: Object,
    default: () => {},
  },
  clear: {
    type: Boolean,
    default: () => false,
  },
})
const serviceForm = reactive({
  appProfileName: {
    value: '',
    error: false,
    illegalError: false,
    formatError: false,
    lengthError: false,
    nameExistError: false,
  },
  serviceGroupName: { value: '', error: false },
  origins: { value: [], error: false },
  portMappingType: { value: 'default', error: false },
  originPort: { value: 80, error: false },
  originscheme: { value: 'http', error: false },
  scheme: { value: ['http'], error: false },
  httpPort: { value: ['80'], error: false },
  httpsPort: { value: ['443'], error: false },
  useHsts: false,
  redirecthttps: false,
})
const portExceed = ref(false)

const resetForm = () => {
  serviceForm.appProfileName = {
    value: '',
    error: false,
    illegalError: false,
    formatError: false,
    lengthError: false,
    nameExistError: false,
  }
  serviceForm.serviceGroupName = { value: '', error: false }
  serviceForm.origins = { value: [], error: false }
  serviceForm.portMappingType = { value: 'def', error: false }
  serviceForm.originPort = { value: 80, error: false }
  serviceForm.originscheme = { value: 'http', error: false }
  serviceForm.scheme = { value: ['http'], error: false }
  serviceForm.httpPort = { value: ['80'], error: false }
  serviceForm.httpsPort = { value: ['443'], error: false }
  serviceForm.useHsts = false
  serviceForm.redirecthttps = false
}

const validateOriginAddress = async (value) => {
  // debugger
  for (let i = 0; i < value.length; i++) {
    if (!/^(?!\.)(?!.*\.$)(?!.*?\.\.)[a-z0-9\-\_\.]*$/.test(value[i])) {
      serviceForm.origins.value.splice(i)
    }
  }
}

const validateAppProfile = async (value) => {
  serviceForm.appProfileName.illegalError = false
  serviceForm.appProfileName.formatError = false
  serviceForm.appProfileName.lengthError = false
  serviceForm.appProfileName.nameExistError = false

  if (!/^(?!\.)(?!.*\.$)(?!.*?\.\.)[a-z0-9\-\_\.]*$/.test(value)) {
    serviceForm.appProfileName.illegalError = true
  }
  if (value.split('.').length < 2) {
    serviceForm.appProfileName.formatError = true
  }
  if (value.length > 35) {
    serviceForm.appProfileName.lengthError = true
  }
  await checkDocumentExist({
    topic: 'appProfileName',
    fieldVal: value,
    groupName: store.state.queryGroupName,
  }).then((res) => {
    if (!res.data.success) {
      serviceForm.appProfileName.nameExistError = true
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updatePort = (value) => {
  if (serviceForm.originscheme.value == 'https') {
    serviceForm.originPort.value = 443
  } else {
    serviceForm.originPort.value = 80
  }
}

const handleSubmit = () => {
  if (
    serviceForm.appProfileName.value !== '' &&
    serviceForm.serviceGroupName.value !== '' &&
    serviceForm.origins.value.length > 0 &&
    serviceForm.portMappingType.value !== '' &&
    serviceForm.originscheme.value !== '' &&
    serviceForm.scheme.value.length > 0 &&
    serviceForm.httpPort.value.length > 0 &&
    serviceForm.originPort.value > 0 &&
    serviceForm.originPort.value < 65535 &&
    serviceForm.originPort.value !== '' &&
    serviceForm.httpsPort.value.length > 0 &&
    serviceForm.appProfileName.illegalError == false &&
    serviceForm.appProfileName.formatError == false &&
    serviceForm.appProfileName.lengthError == false &&
    serviceForm.appProfileName.nameExistError == false
  ) {
    stepForward()
  } else {
    if (serviceForm.appProfileName.value == '') {
      serviceForm.appProfileName.error = true
    } else {
      serviceForm.appProfileName.error = false
    }
    validateAppProfile(serviceForm.appProfileName.value)

    if (
      serviceForm.serviceGroupName.value == '' ||
      serviceForm.serviceGroupName.value == null
    ) {
      serviceForm.serviceGroupName.error = true
    } else {
      serviceForm.serviceGroupName.error = false
    }
    if (serviceForm.origins.value.length == 0) {
      serviceForm.origins.error = true
    } else {
      serviceForm.origins.error = false
    }
    if (serviceForm.portMappingType.value == '') {
      serviceForm.portMappingtype.error = true
    } else {
      serviceForm.portMappingType.error = false
    }
    if (serviceForm.originscheme.value == '') {
      serviceForm.originscheme.error = true
    } else {
      serviceForm.originscheme.error = false
    }
    if (serviceForm.scheme.value.length == 0) {
      serviceForm.scheme.error = true
    } else {
      serviceForm.scheme.error = false
    }
    if (serviceForm.httpPort.value.length == 0) {
      serviceForm.httpPort.error = true
    } else {
      serviceForm.httpPort.error = false
    }
    if (serviceForm.httpsPort.value.length == 0) {
      serviceForm.httpsPort.error = true
    } else {
      serviceForm.httpsPort.error = false
    }
    if (serviceForm.originPort.value == '' || serviceForm.originPort.value == null) {
      serviceForm.originPort.error = true
    } else {
      serviceForm.originPort.error = false
    }
    if (serviceForm.originPort.value < 0 || serviceForm.originPort.value > 65534) {
      portExceed.value = true
    } else {
      portExceed.value = false
    }
  }
}

// const stepBack = () => {
//   emit('step_back')
// }
const back = () => {
  window.location.href = '/service-lines'
}
const stepForward = () => {
  store.commit('SET_CREATE_SERVICE', serviceForm)
  emit('step_forward')
  // resetForm();
}

onMounted(() => {
  serviceForm.httpPort.value = [props.httpPort[0]]
  serviceForm.httpsPort.value = [props.httpsPort[0]]
})

watch(
  () => props.clear,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (first, second) => {
    if (props.clear) {
      resetForm()
    }
  }
)

watch(
  () => serviceForm.origins.value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (first, second) => {
    validateOriginAddress(serviceForm.origins.value)
  }
)

watch(
  () => serviceForm.originscheme.value,
  () => {
    if (serviceForm.originscheme.value === 'https') {
      serviceForm.originPort.value = 443
    } else {
      serviceForm.originPort.value = 80
    }
  }
)

watch(
  () => serviceForm.portMappingType.value,
  () => {
    if (serviceForm.originscheme.value === 'https') {
      serviceForm.originPort.value = 443
    } else {
      serviceForm.originPort.value = 80
    }
  }
)
</script>

<template>
  <form class="form-layout" style="max-width: 1200px" @submit.prevent="handleSubmit">
    <div class="form-outer">
      <div class="form-header stuck-header">
        <div class="form-header-inner">
          <div class="left">
            <h3>
              {{ `${t('service.createText')} ${t('service.service_line')}` }}
            </h3>
          </div>
        </div>
      </div>
      <div class="form-body">
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="fieldset-heading d-flex">
            <h4>
              {{ t('service.service_name') }}
            </h4>
            <div v-tooltip.right="`${t('service.tooltip.service_name')}`" class="ml-2">
              <i class="icon-tooltip fas fa-question-circle"></i>
            </div>
          </div>

          <div class="columns is-multiline">
            <div class="column is-12">
              <VField>
                <VControl
                  :has-error="
                    serviceForm.appProfileName.error == true ||
                    serviceForm.appProfileName.illegalError == true ||
                    serviceForm.appProfileName.formatError == true ||
                    serviceForm.appProfileName.lengthError == true ||
                    serviceForm.appProfileName.nameExistError == true
                      ? true
                      : false
                  "
                >
                  <input
                    v-model="serviceForm.appProfileName.value"
                    type="text"
                    class="input"
                    placeholder="solarspeed.service"
                    @blur="validateAppProfile(serviceForm.appProfileName.value)"
                  />
                  <p
                    v-if="serviceForm.appProfileName.error == true"
                    class="help text-danger"
                  >
                    {{ t('service.warning.enter_service_name') }}
                  </p>
                  <p
                    v-if="serviceForm.appProfileName.illegalError == true"
                    class="help text-danger"
                  >
                    {{ t('service.validate.validateIllegalText') }}
                  </p>
                  <p
                    v-if="serviceForm.appProfileName.formatError == true"
                    class="help text-danger"
                  >
                    {{ t('service.validate.validateIllegalCharsPrefix') }}: "."
                  </p>
                  <p
                    v-if="serviceForm.appProfileName.lengthError == true"
                    class="help text-danger"
                  >
                    {{ t('service.validate.validateExceedLengthPrefix') }} 35
                  </p>
                  <p
                    v-if="serviceForm.appProfileName.nameExistError == true"
                    class="help text-danger"
                  >
                    Service name
                    {{ t('service.validate.validateExistText') }}
                  </p>
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <div class="form-fieldset">
          <div class="fieldset-heading d-flex">
            <h4>
              {{ t('service.customer_package') }}
            </h4>
            <div
              v-tooltip.right="`${t('service.tooltip.customer_package')}`"
              class="ml-2"
            >
              <i class="icon-tooltip fas fa-question-circle"></i>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField>
                <VControl
                  :has-error="serviceForm.serviceGroupName.error == true ? true : false"
                >
                  <Multiselect
                    v-model="serviceForm.serviceGroupName.value"
                    :options="props.package"
                    placeholder="Select group name"
                  />
                  <p v-if="serviceForm.serviceGroupName.error" class="help text-danger">
                    {{ t('service.warning.select_customer_name') }}
                  </p>
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="fieldset-heading">
            <h4>
              {{ t('service.origin_details') }}
            </h4>
          </div>

          <div class="columns is-multiline">
            <div class="column is-6">
              <VField>
                <div class="d-flex">
                  <label>{{ `${t('origin.origin')} ${t('origin.address')}` }}</label>
                  <div
                    v-tooltip.right="`${t('service.tooltip.origin_address')}`"
                    class="ml-2"
                  >
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>
                <VControl :has-error="serviceForm.origins.error == true ? true : false">
                  <Multiselect
                    v-model="serviceForm.origins.value"
                    :options="props.origins"
                    mode="tags"
                    :searchable="true"
                    placeholder="Origin address"
                    :create-tag="true"
                    :max="5"
                  />
                  <p v-if="serviceForm.origins.error" class="help text-danger">
                    {{ t('origin.warning.enter_orgin_address') }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField>
                <div class="d-flex">
                  <label>{{ t('origin.port_mapping_type') }}</label>
                  <div
                    v-tooltip.right="`${t('service.tooltip.port_mapping_type')}`"
                    class="ml-2"
                  >
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>

                <VControl>
                  <VRadio
                    v-model="serviceForm.portMappingType.value"
                    :value="'default'"
                    label="Default"
                    name="outlined_radio"
                    color="primary"
                    @update="updatePortMappiong(serviceForm.portMappingType.value)"
                  />
                  <VRadio
                    v-model="serviceForm.portMappingType.value"
                    :value="'static'"
                    label="Static"
                    name="outlined_radio"
                    color="primary"
                    @update="updatePortMappiong(serviceForm.portMappingType.value)"
                  />
                </VControl>
              </VField>
            </div>
            <div
              v-if="serviceForm.portMappingType.value !== 'static'"
              class="column is-6"
            >
              <VField>
                <div class="d-flex">
                  <label>{{ t('origin.origin_scheme') }}</label>
                  <div
                    v-tooltip.right="`${t('service.tooltip.origin_scheme')}`"
                    class="ml-2"
                  >
                    <i class="icon-tooltip fas fa-question-circle"></i>
                  </div>
                </div>
                <VControl
                  :has-error="serviceForm.originscheme.error == true ? true : false"
                >
                  <div class="select">
                    <select
                      v-model="serviceForm.originscheme.value"
                      @change="updatePort(serviceForm.originscheme.value)"
                      @blur="handleBlur"
                    >
                      <option value="http">http</option>
                      <option value="https">https</option>
                    </select>
                  </div>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <template v-if="serviceForm.portMappingType.value !== 'static'">
                <VField>
                  <div class="d-flex">
                    <label>{{ t('origin.port_number') }}</label>
                  </div>
                  <VControl
                    :has-error="
                      portExceed || serviceForm.originPort.error == true ? true : false
                    "
                  >
                    <input
                      v-model="serviceForm.originPort.value"
                      type="number"
                      class="input"
                    />
                  </VControl>
                  <p v-if="portExceed" class="help text-danger">
                    {{ t('ssl.warning.port_out_of_range') }}
                  </p>
                  <p v-if="serviceForm.originPort.error" class="help text-danger">
                    {{ t('ssl.warning.enter_https_port') }}
                  </p>
                </VField>
              </template>
            </div>
            <div class="column is-12 d-flex">
              <div class="button-wrap">
                <VButton class="cancel" color="white" bold raised fullwidth @click="back">
                  {{ t('service.cancelText') }}
                </VButton>
              </div>
              <div class="button-wrap">
                <VButton color="primary" type="submit" bold raised fullwidth>
                  {{ t('service.nextText') }}
                </VButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
