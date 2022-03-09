<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formReferences, formInputs } from '../data/filter_selector_data'
import FormBuilder from '/@src/components/general/FormBuilder.vue'

const { t } = useI18n()

const props = defineProps({
  filters: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:filters'])

const isFilterOpen = ref(false)
const hasFilters = computed(() => props.filters.length > 0)

function initFormItem() {
  formReferences.reqID.value = ''
  formReferences.serverName.value = ''
  formReferences.timestamp.value = ''
  formReferences.groupName.value = ''
  formReferences.serviceGroup.value = ''
  formReferences.host.value = ''
  formReferences.tbAction.value = ''
  formReferences.tbType.value = ''
  formReferences.tbRule.value = ''
  formReferences.tbReason.value = ''
  formReferences.curRealyAddr.value = ''
  formReferences.country.value = ''
  formReferences.requestMethod.value = ''
  formReferences.status.value = ''
  formReferences.scheme.value = ''
  formReferences.serverPort.value = ''
  formReferences.uri.value = ''
  formReferences.args.value = ''
  formReferences.reqHeaders.value = ''
  formReferences.requestTime.value = ''
  formReferences.requestTimeGt.value = ''
  formReferences.requestTimeLt.value = ''
  formReferences.upstreamResponseTime.value = ''
  formReferences.upstreamResponseTimeGt.value = ''
  formReferences.upstreamResponseTimeLt.value = ''
  formReferences.upstreamStatus.value = ''
  formReferences.serverProtocol.value = ''
  formReferences.proxyType.value = ''
  formReferences.isp.value = ''
  formReferences.originHostResolve.value = ''
  filters.value = []
}

const filters = computed({
  get: () => props.filters,
  set: (x) => emit('update:filters', x),
})

const TYPES = ['string', 'range', 'date', 'multiselect']

const updateFilters = () => {
  const _filters = filters.value.filter((x) => x.key !== 'group')
  // XD This is O(n^2)
  // Doing two pass to retain order
  // existing filters
  const prev = _filters.map((x) => {
    const input = formInputs.find((y) => y.key === x.key)
    return input?.ref.value === x.value ? x : { ...x, value: input?.ref.value }
  })
  // newly added filters
  const rest = formInputs
    .filter((x) => !prev.find((y) => y.key === x.key) && x.ref.value && x.key !== 'group')
    .map((x) => {
      const { key, ref } = x
      const type = TYPES.includes(x.type)
        ? x.type === 'multiselect'
          ? 'select' // convert multiselect to select for api
          : x.type
        : 'string'

      return { key, type, value: ref.value }
    })
  filters.value = [...prev, ...rest].filter((x) => x.value)
}
</script>

<template>
  <div class="filter-form-originPolicy">
    <div class="filter-btn">
      <V-IconButton
        color="primary"
        style="color: #fff"
        class="filter-icon"
        icon="feather:sliders"
        @click="isFilterOpen = !isFilterOpen"
      />

      <div :class="hasFilters ? 'filter-dot' : 'dot'" />
    </div>

    <VModal
      :open="isFilterOpen"
      :title="`Event Log ${t('filter.filter')}`"
      size="big"
      actions="right"
      @close="isFilterOpen = false"
    >
      <template #content>
        <form class="modal-form">
          <FormBuilder v-slot="slotProps" :form-inputs="formInputs">
            <div v-if="slotProps.sequence === 19" class="field">
              <VField class="field">
                <label>{{ t('eventLog.request_time') }}</label>
                <div class="gtlt-time-container">
                  <VControl>
                    gt
                    <input
                      v-model="formReferences.requestTimeGt"
                      type="number"
                      class="input"
                    />
                  </VControl>
                  <VControl>
                    lt
                    <input
                      v-model="formReferences.requestTimeLt"
                      type="number"
                      class="input"
                    />
                  </VControl>
                </div>
              </VField>
              <VField class="field">
                <label>{{ t('eventLog.upstream_response_time') }}</label>
                <div class="gtlt-time-container">
                  <VControl>
                    gt
                    <input
                      v-model="formReferences.upstreamResponseTimeGt"
                      type="number"
                      class="input"
                    />
                  </VControl>
                  <VControl>
                    lt
                    <input
                      v-model="formReferences.upstreamResponseTimeLt"
                      type="number"
                      class="input"
                    />
                  </VControl>
                </div>
              </VField>
            </div>
          </FormBuilder>
        </form>
      </template>

      <template #action>
        <VButton @click="initFormItem"> {{ t('main.clearText') }} </VButton>

        <VButton color="primary" raised @click="updateFilters">
          {{ t('filter.searchText') }}
        </VButton>
      </template>
    </VModal>
  </div>
</template>

<style lang="scss">
.filter-btn {
  position: relative;
  margin-right: 10px;
}

.filter-dot {
  width: 8px;
  height: 8px;
  background-color: $danger;
  border-radius: 20px;
  position: absolute;
  right: 31%;
  top: -8%;
}

.gtlt-time-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  .control {
    width: 50%;
  }
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.radio {
  padding-left: 0px;
}
</style>
