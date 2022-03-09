<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { getFormOptions } from '/@src/api/formOptions'
import countryCode from '/@src/data/json/countryCode.json'
import store from '/@src/stores/index'
import { validateOriginForm } from '/@src/pages/services-detail/validation/validate'

const { t } = useI18n()
const emit = defineEmits(['clickDropdown', 'submitData'])
const props = defineProps({
  overviewData: {
    type: Object,
    default: () => {},
  },
  originDropdown: {
    type: Boolean,
    default: () => false,
  },
})

const countries = countryCode
const isLoading = ref(false)
const isFirstLoad = ref(true)
const originFormData = ref({
  originPort: { value: 80, error: false },
  originsAddress: { value: [], error: false },
  originscheme: { value: '', error: false },
  httpPort: { value: [80], error: false },
  httpsPort: { value: [443], error: false },
  useOriginPolicy: { value: false, error: false },
  usedOriginPolicies: { value: [], error: false },
  portMappingType: { value: 'default', error: false },
})
const originPoliciesRegionExists = ref([])
const originAddressOptions = ref([])
// Used Origin Policy
const applyOriginPolicyModal = ref({
  name: 'add',
  visible: false,
})
const applyOriginPolicyData = ref({
  index: null,
  regionName: {
    value: [],
    error: false,
    exist: false,
  },
  originPolicyName: {
    value: null,
    error: false,
  },
})
const originPolicyList = ref([])
const overviewData = computed(() => {
  return props.overviewData
})
const originDropdown = computed(() => {
  return props.originDropdown
})

const updateOriginFormData = () => {
  if (isFirstLoad.value) {
    originFormData.value.originPort.value = overviewData.value?.originPort
    originFormData.value.originsAddress.value = overviewData.value?.origins
    originFormData.value.originscheme.value = overviewData.value?.originscheme
    originFormData.value.httpPort.value = overviewData.value?.httpPort
    originFormData.value.httpsPort.value = overviewData.value?.httpsPort
    originFormData.value.useOriginPolicy.value = overviewData.value?.useOriginPolicy
    originFormData.value.usedOriginPolicies.value = overviewData.value?.usedOriginPolicies
    originFormData.value.portMappingType.value = overviewData.value?.portMappingType
    isFirstLoad.value = false

    // Filter Origin Policies Region Name into single Array
    let usedOriginPolicies = originFormData.value.usedOriginPolicies.value
    if (usedOriginPolicies.length > 0) {
      let regionNameArrRaw = usedOriginPolicies.map((x) => {
        return Object.values(x.regionName)
      })
      originPoliciesRegionExists.value = [].concat(
        ...regionNameArrRaw.filter(Array.isArray)
      )
    }
  }
}
const checkOriginPort = () => {
  if (
    originFormData.value.originPort.value > 0 &&
    originFormData.value.originPort.value < 65535
  ) {
    originFormData.value.originPort.error = false
  } else {
    originFormData.value.originPort.error = true
  }
}
const onClickOriginScheme = (scheme: string) => {
  originFormData.value.originscheme.value = scheme
  originFormData.value.originPort.error = false

  if (originFormData.value.originscheme.value == 'http') {
    originFormData.value.originPort.value = 80
  } else {
    originFormData.value.originPort.value = 443
  }
}
const onClickEditOriginPolicies = (policy: object, index: int) => {
  applyOriginPolicyModal.value.name = 'edit'
  applyOriginPolicyModal.value.visible = true

  applyOriginPolicyData.value.index = index
  applyOriginPolicyData.value.regionName.value = policy.regionName
  applyOriginPolicyData.value.originPolicyName.value = policy.originPolicyName
}
const onClickDeleteOriginPolicies = (policy: object, index: int) => {
  let removeData = originFormData.value.usedOriginPolicies.value.filter(
    (e, i) => i !== index
  )
  originFormData.value.usedOriginPolicies.value = removeData
}
const closeOriginPolicyModal = () => {
  applyOriginPolicyData.value = {
    index: null,
    regionName: {
      value: [],
      error: false,
      exist: false,
    },
    originPolicyName: {
      value: null,
      error: false,
    },
  }
  applyOriginPolicyModal.value.name = 'add'
  applyOriginPolicyModal.value.visible = false
}
const submitNewOriginPolicies = () => {
  let validate = true

  if (applyOriginPolicyData.value.regionName.value.length === 0) {
    applyOriginPolicyData.value.regionName.error = true
    validate = false
  }

  if (!applyOriginPolicyData.value.originPolicyName.value) {
    applyOriginPolicyData.value.originPolicyName.error = true
    validate = false
  }

  // Check duplicates Region Name
  if (validate) {
    let selectRegionName = applyOriginPolicyData.value.regionName.value
    const origin_exists = selectRegionName.filter((val) =>
      originPoliciesRegionExists.value.includes(val)
    )

    if (origin_exists.length > 0) {
      applyOriginPolicyData.value.regionName.exist = true
      validate = false
    }
  }

  if (validate) {
    originFormData.value.usedOriginPolicies.value.push({
      regionName: Object.values(applyOriginPolicyData.value.regionName.value),
      originPolicyName: applyOriginPolicyData.value.originPolicyName.value,
    })
    closeOriginPolicyModal()
  }
}
const submitUpdateOriginPolicies = () => {
  let validate = true

  if (!applyOriginPolicyData.value.originPolicyName.value) {
    applyOriginPolicyData.value.originPolicyName.error = true
    validate = false
  }

  if (validate && applyOriginPolicyData.value.index >= 0) {
    originFormData.value.usedOriginPolicies.value[
      applyOriginPolicyData.value.index
    ].originPolicyName = applyOriginPolicyData.value.originPolicyName.value

    closeOriginPolicyModal()
  }
}
const submitOrigin = async () => {
  isLoading.value = true

  const submit_data = {
    ...overviewData.value,
    originPort: originFormData.value.originPort.value,
    origins: Object.values(originFormData.value.originsAddress.value),
    originscheme: originFormData.value.originscheme.value,
    httpPort: Object.values(originFormData.value.httpPort.value),
    httpsPort: Object.values(originFormData.value.httpsPort.value),
    useOriginPolicy: originFormData.value.useOriginPolicy.value,
    usedOriginPolicies: Object.values(originFormData.value.usedOriginPolicies.value),
    portMappingType: originFormData.value.portMappingType.value,
  }

  const validation = await validateOriginForm(submit_data, originFormData.value)

  if (!validation.status) {
    originFormData.value = validation.originData
  } else {
    emit('submitData', submit_data)
    emit('clickDropdown')
  }

  isLoading.value = false
}

onMounted(async () => {
  await getFormOptions(`origins?groupName=${store.state.queryGroupName}`).then((res) => {
    originAddressOptions.value = res.data.options
  })
  await getFormOptions(
    `/originpolicynames?groupName=${store.state.queryGroupName}&originPolicyName=***`
  ).then((res) => {
    originPolicyList.value = res.data.options
  })
})

watch(overviewData, () => {
  updateOriginFormData()
})
</script>

<template>
  <!-- <div v-if="originFormData.length > 0" ref="originRef" class="column is-12"> -->

  <div class="tile-grid-item service-detail-card-body">
    <div class="tile-grid-item-inner" style="display: block">
      <div class="columns" style="display: flex">
        <div class="column meta is-2">
          <span class="dark-inverted service-detail-card-title">
            {{ t('origin.origin') }}
          </span>
        </div>
        <div class="vertical-divider" />
        <div class="horizontal-divider" />

        <!-- Display Value -->
        <div v-if="!originDropdown" class="column is-9">
          <div class="columns container">
            <div class="column meta is-6">
              <span class="dark-inverted service-detail-card-label">
                {{ t('origin.used_origin_policy') }}
              </span>
              <div class="m-t-5">
                <span style="color: #a2a5b9">
                  {{ originFormData.useOriginPolicy.value ? 'On' : 'Off' }}
                </span>
              </div>
            </div>
          </div>
          <!-- OriginPolicy === false -->
          <div v-if="!originFormData.useOriginPolicy.value" class="columns container">
            <div class="column meta is-6">
              <span class="dark-inverted service-detail-card-label">
                {{ t('origin.address') }}
              </span>

              <div class="m-t-5">
                <template
                  v-for="origin in originFormData.originsAddress.value"
                  :key="origin"
                >
                  <VTag
                    rounded
                    color="primary"
                    class="m-r-5"
                    style="margin-bottom: 0.25rem; margin-top: 0.25rem"
                    :label="origin"
                  />
                </template>
              </div>
            </div>
          </div>
          <!-- OriginPolicy === true -->
          <div v-if="originFormData.useOriginPolicy.value" class="columns container">
            <div class="column meta is-12">
              <span class="dark-inverted service-detail-card-label">
                {{ t('origin.applied_origin_policy') }}
              </span>
              <div class="m-t-5">
                <template v-if="originFormData.usedOriginPolicies.value.length > 0">
                  <div
                    v-for="(originApply, index) in originFormData.usedOriginPolicies
                      .value"
                    :key="originApply"
                    class="mt-2"
                  >
                    <div v-if="index != 0" class="horizontal-divider"></div>
                    <div :class="{ 'p-t-10': index != 0 }">
                      <div>
                        <span class="region">
                          {{ originApply.regionName.join(', ') }}
                        </span>
                      </div>
                      <div>
                        <span style="color: #a2a5b9">
                          {{ t('origin.policy') }} : {{ originApply.originPolicyName }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else> - </template>
              </div>
            </div>
          </div>
          <!-- OriginPolicy === false -->
          <div v-if="!originFormData.useOriginPolicy.value" class="columns container">
            <div class="column meta is-6">
              <span class="dark-inverted service-detail-card-label">
                {{ t('origin.origin_scheme') }}
              </span>
              <div class="m-t-5">
                <template v-if="originFormData.originscheme.value">
                  <VTag
                    rounded
                    color="primary"
                    class="m-r-5"
                    style="margin-bottom: 0.25rem; margin-top: 0.25rem"
                    :label="originFormData.originscheme.value"
                  />
                </template>
                <span v-else>-</span>
              </div>
            </div>
            <div class="column meta is-6">
              <span class="dark-inverted service-detail-card-label">
                {{ t('origin.origin_port') }}
              </span>
              <div class="m-t-5">
                <VTag
                  rounded
                  color="primary"
                  class="m-r-5"
                  style="margin-bottom: 0.25rem; margin-top: 0.25rem"
                  :label="originFormData.originPort.value"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Edit Value -->
        <div v-else class="column is-9">
          <form>
            <div class="columns container">
              <div class="column meta is-12">
                <div class="field">
                  <span class="dark-inverted service-detail-card-label">
                    {{ t('origin.used_origin_policy') }}
                  </span>
                  <VControl>
                    <VSwitchSegment
                      v-model="originFormData.useOriginPolicy.value"
                      style="justify-content: flex-start"
                      label-true="On"
                      label-false="Off"
                      color="primary"
                    />
                  </VControl>
                </div>
                <div v-if="originFormData.useOriginPolicy.value">
                  <div class="d-flex">
                    <span class="dark-inverted service-detail-card-label">
                      {{ t('origin.applied_origin_policy') }}
                    </span>
                    <VIconButton
                      :outlined="true"
                      color="primary"
                      circle
                      icon="feather:plus"
                      class="setting-btn add-btn"
                      @click="applyOriginPolicyModal.visible = true"
                    ></VIconButton>
                  </div>
                  <template v-if="originFormData.usedOriginPolicies.value.length > 0">
                    <div
                      v-for="(originApply, index) in originFormData.usedOriginPolicies
                        .value"
                      :key="originApply"
                      class="mt-2"
                    >
                      <div v-if="index != 0" class="horizontal-divider"></div>
                      <div class="d-flex between" :class="{ 'p-t-10': index != 0 }">
                        <div>
                          <div>
                            <span class="region">
                              {{ originApply.regionName.join(', ') }}
                            </span>
                          </div>
                          <span style="color: #a2a5b9">
                            {{ t('origin.policy') }} :
                            {{ originApply.originPolicyName }}
                          </span>
                        </div>
                        <div>
                          <VIconButton
                            :outlined="true"
                            circle
                            icon="feather:edit-2"
                            class="setting-btn"
                            @click="onClickEditOriginPolicies(originApply, index)"
                          />
                          <VIconButton
                            :outlined="true"
                            circle
                            icon="fa:trash"
                            class="setting-btn"
                            @click="onClickDeleteOriginPolicies(originApply, index)"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <span>-</span>
                  </template>
                </div>
              </div>
            </div>
            <!-- Used Origin Policy === false  -->
            <div v-if="!originFormData.useOriginPolicy.value">
              <div class="columns container">
                <div class="column meta is-12">
                  <span class="dark-inverted service-detail-card-label">
                    {{ t('origin.address') }}
                  </span>
                  <VControl :has-error="originFormData.originsAddress.error">
                    <Multiselect
                      v-model="originFormData.originsAddress.value"
                      :options="originAddressOptions"
                      placeholder="a.b.c.d"
                      mode="tags"
                      :searchable="true"
                      :create-tag="true"
                      style="margin-top: 1rem"
                    />
                  </VControl>
                  <p v-if="originFormData.originsAddress.error" class="help text-danger">
                    {{ t('origin.warning.at_least_one_origin') }}
                  </p>
                </div>
              </div>
              <div class="columns container">
                <div class="column meta is-12">
                  <span class="dark-inverted service-detail-card-label">
                    {{ t('origin.port_mapping_type') }} *
                  </span>
                  <VControl>
                    <VRadio
                      v-model="originFormData.portMappingType.value"
                      :value="'default'"
                      label="Default"
                      name="outlined_radio"
                      color="primary"
                    />
                    <VRadio
                      v-model="originFormData.portMappingType.value"
                      :value="'static'"
                      label="Static"
                      name="outlined_radio"
                      color="primary"
                    />
                  </VControl>
                </div>
              </div>
              <div class="columns container">
                <div class="column meta is-6">
                  <span class="dark-inverted service-detail-card-label">
                    {{ t('origin.origin_scheme') }}
                  </span>
                  <div class="edit" style="margin-top: 1rem">
                    <VButton
                      rounded
                      bold
                      :color="
                        originFormData.originscheme.value == 'http'
                          ? 'primary'
                          : undefined
                      "
                      @click="onClickOriginScheme('http')"
                    >
                      HTTP
                    </VButton>
                    <VButton
                      rounded
                      bold
                      :color="
                        originFormData.originscheme.value == 'https'
                          ? 'primary'
                          : undefined
                      "
                      @click="onClickOriginScheme('https')"
                    >
                      HTTPS
                    </VButton>
                  </div>
                </div>
                <div class="column meta is-6">
                  <div v-if="originFormData.portMappingType.value == 'default'">
                    <span class="dark-inverted service-detail-card-label">
                      {{ t('origin.origin_port') }}
                    </span>
                    <div class="edit" style="margin-top: 1rem">
                      <VControl :has-error="originFormData.originPort.error">
                        <input
                          v-model="originFormData.originPort.value"
                          type="number"
                          class="input"
                          @change="checkOriginPort()"
                          @blur="checkOriginPort()"
                        />
                        <p
                          v-if="originFormData.originPort.error"
                          class="help text-danger"
                        >
                          {{ t('origin.warning.origin_port_out_of_range') }}
                        </p>
                      </VControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div class="right" style="float: right; margin-top: 2.5rem">
            <VButton @click="emit('clickDropdown')">
              <div class="light-text">{{ t('service.cancelText') }}</div>
            </VButton>
            <VButton :loading="false" color="primary" @click="submitOrigin()">
              <div>{{ t('service.saveText') }}</div>
            </VButton>
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

  <!-- Origin Policies Modal  -->
  <VModal
    :open="applyOriginPolicyModal.visible"
    :title="
      applyOriginPolicyModal.name === 'add'
        ? `${t('origin.add_region_policy')}`
        : `${t('origin.edit_region_policy')}`
    "
    size="small"
    actions="right"
    noscroll
    @close="closeOriginPolicyModal"
  >
    <template #content>
      <div class="column meta is-12 p-0 pb-2">
        <span class="dark-inverted service-detail-card-label">
          {{ t('origin.region') }}
        </span>
        <VControl>
          <Multiselect
            v-model="applyOriginPolicyData.regionName.value"
            :options="countries"
            placeholder="Region"
            mode="tags"
            :searchable="true"
            style="margin-top: 1rem"
            :disabled="applyOriginPolicyModal.name !== 'add'"
          />
        </VControl>
        <p v-if="applyOriginPolicyData.regionName.error" class="help text-danger">
          {{ t('origin.warning.at_least_one_region') }}
        </p>
        <p v-if="applyOriginPolicyData.regionName.exist" class="help text-danger">
          {{ t('origin.warning.region_exist') }} :
          <!-- {{ applyOriginPolicyData.regionName.value.join(', ') }} -->
          {{
            countries
              .filter(({ value }) =>
                applyOriginPolicyData.regionName.value.includes(value)
              )
              .map(({ label }) => label)
          }}
        </p>
      </div>
      <div class="column meta is-12 p-0 p-b-130">
        <span class="dark-inverted service-detail-card-label">
          {{ t('origin.policy') }}
        </span>
        <VControl>
          <Multiselect
            v-model="applyOriginPolicyData.originPolicyName.value"
            :options="originPolicyList"
            placeholder="Policy"
            mode="single"
            :searchable="true"
            style="margin-top: 1rem"
          />
        </VControl>
        <p v-if="applyOriginPolicyData.originPolicyName.error" class="help text-danger">
          {{ t('origin.warning.at_least_one_policy') }}
        </p>
      </div>
    </template>
    <template #action>
      <VButton
        raised
        :loading="isLoading"
        color="primary"
        @click="
          applyOriginPolicyModal.name == 'add'
            ? submitNewOriginPolicies()
            : submitUpdateOriginPolicies()
        "
      >
        {{
          applyOriginPolicyModal.name == 'add' ? t('service.add') : t('service.saveText')
        }}
      </VButton>
    </template>
  </VModal>
</template>
