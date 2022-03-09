<script setup lang="ts">
import { computed, ref, onBeforeMount, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import store from '/@src/stores/index'
import { getFormOptions } from '/@src/api/formOptions'
import { validateEssentialForm } from '/@src/pages/services-detail/validation/validate'

const { t } = useI18n()
const emit = defineEmits(['clickDropdown', 'submitData'])
const props = defineProps({
  overviewData: {
    type: Object,
    default: () => {},
  },
  essentialDropdown: {
    type: Boolean,
    default: () => false,
  },
})

const isLoading = ref(false)
const isFirstLoad = ref(true)
const userServiceGroups = ref([])
const essentialFormData = ref({
  serviceGroupName: { value: '', error: false },
  tags: { value: [], error: false },
  desc: { value: '', error: false },
})
const service_detail = computed(() => {
  return store.state.service.service_detail
})
const overviewData = computed(() => {
  return props.overviewData
})
const essentialDropdown = computed(() => {
  return props.essentialDropdown
})

const updateEssentialFormData = () => {
  if (isFirstLoad.value) {
    essentialFormData.value.serviceGroupName.value =
      service_detail.value?.serviceGroupName
    essentialFormData.value.tags.value = service_detail.value?.tags
    essentialFormData.value.desc.value = service_detail.value?.description
    isFirstLoad.value = false
  }
}
const submitEssential = async () => {
  isLoading.value = true
  const submit_data = {
    ...overviewData.value,
    serviceGroupName: essentialFormData.value.serviceGroupName.value,
    tags: Object.values(essentialFormData.value.tags.value),
    description: essentialFormData.value.desc.value,
  }

  const validation = await validateEssentialForm(submit_data, essentialFormData.value)

  if (!validation.status) {
    essentialFormData.value = validation.essentialFormData
  } else {
    emit('submitData', submit_data)
    emit('clickDropdown')
  }

  isLoading.value = false
}

onBeforeMount(async () => {
  await getFormOptions(`servicegroupnames?groupName=${store.state.queryGroupName}`).then(
    (res) => {
      userServiceGroups.value = res.data.options
    }
  )
})

watch(overviewData, () => {
  updateEssentialFormData()
  console.log({ 'Essential - overviewData': overviewData })
})
</script>

<template>
  <div class="tile-grid-item service-detail-card-body">
    <div class="tile-grid-item-inner" style="display: block">
      <div class="columns">
        <div class="column meta is-2">
          <span class="dark-inverted service-detail-card-title">
            {{ t('service.essential') }}
          </span>
        </div>
        <div class="vertical-divider" />
        <div class="horizontal-divider" />

        <!-- Display Value -->
        <div v-if="!essentialDropdown" class="column is-9">
          <div class="columns container">
            <div class="column meta is-6">
              <span class="dark-inverted service-detail-card-label">
                {{ t('service.packageName') }}
              </span>
              <div class="m-t-5">
                <span>{{ essentialFormData?.serviceGroupName.value }}</span>
              </div>
            </div>
          </div>
          <div class="columns container">
            <div class="column meta is-12">
              <span class="dark-inverted service-detail-card-label">
                {{ t('service.tag') }}
              </span>
              <div>
                <template v-if="essentialFormData.tags.value.length > 0">
                  <template v-for="tag in essentialFormData.tags.value" :key="tag">
                    <VTag
                      rounded
                      color="primary"
                      class="m-r-5"
                      style="margin-bottom: 0.25rem; margin-top: 0.25rem"
                      :label="tag"
                    />
                  </template>
                </template>
                <template v-else>
                  <span>-</span>
                </template>
              </div>
            </div>
          </div>
          <div class="columns container">
            <div class="column meta is-12">
              <span class="dark-inverted service-detail-card-label">
                {{ t('service.desc') }}
              </span>
              <div class="m-t-5 service-desc">
                <template v-if="essentialFormData.desc.value.length > 0">
                  <span>{{ essentialFormData?.desc.value }}</span>
                </template>
                <span v-else>-</span>
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
                    {{ t('service.packageName') }}
                  </span>
                  <VControl :has-error="essentialFormData.serviceGroupName.error">
                    <Multiselect
                      v-model="essentialFormData.serviceGroupName.value"
                      :options="userServiceGroups"
                      placeholder="Select group name"
                      :searchable="true"
                    />
                    <p
                      v-if="essentialFormData.serviceGroupName.error"
                      class="help text-danger"
                    >
                      {{ t('service.warning.select_customer_name') }}
                    </p>
                  </VControl>
                </div>
                <div>
                  <div class="d-flex">
                    <span class="dark-inverted service-detail-card-label">
                      {{ t('service.tag') }}
                    </span>
                  </div>
                  <VControl>
                    <Multiselect
                      v-model="essentialFormData.tags.value"
                      :options="essentialFormData.tags.value"
                      placeholder="Tags"
                      mode="tags"
                      :max="10"
                      :searchable="true"
                      :create-tag="true"
                    />
                  </VControl>
                </div>
              </div>
            </div>
            <div class="field m-l-10">
              <span class="dark-inverted service-detail-card-label">
                {{ t('service.desc') }}
              </span>
              <textarea
                v-model="essentialFormData.desc.value"
                class="textarea"
                rows="4"
              ></textarea>
            </div>
          </form>

          <div class="right" style="float: right; margin-top: 2.5rem">
            <VButton @click="emit('clickDropdown')">
              <div class="light-text">
                {{ t('service.cancelText') }}
              </div>
            </VButton>
            <VButton :loading="isLoading" color="primary" @click="submitEssential">
              <div>{{ t('service.saveText') }}</div>
            </VButton>
          </div>
        </div>
      </div>
      <div class="btn-edit">
        <div
          class="is-trigger dropdown-trigger"
          @click="emit('clickDropdown')"
          @keypress="emit('clickDropdown')"
        >
          <VIcon icon="feather:settings" class="setting-btn" />
        </div>
      </div>
    </div>
  </div>
</template>
