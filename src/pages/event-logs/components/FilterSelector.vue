<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { formReferences, formInputs } from '../data/filter_selector_data'
import FormBuilder from '/@src/components/general/FormBuilder.vue'
import { generateSearchFilter } from '/@src/utils/search-filter'

const { t } = useI18n()
//form v-model
const props = defineProps({
  filters: {
    type: Array,
    default: () => [],
  },
})

const isFilterOpen = ref(false)

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
}

const searchFilterOptions = ref(props.filters)
const emit = defineEmits(['search-filter-called'])
const handleSearch = () => {
  searchFilterOptions.value = generateSearchFilter(searchFilterOptions.value, formInputs)
  emit('search-filter-called', searchFilterOptions.value)
}

onMounted(() => {})
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

      <!-- <div :class="props.hasFilter ? 'filter-dot' : 'dot'"></div> -->
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
              <div class="field">
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
              </div>
              <div class="field">
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
              </div>
            </div>
          </FormBuilder>
        </form>
      </template>

      <template #action>
        <VButton @click="initFormItem"> {{ t('main.clearText') }} </VButton>

        <VButton color="primary" raised @click="handleSearch">
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
