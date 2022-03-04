<script setup lang="ts">
import { computed, ref, onBeforeMount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import FormBuilder from '/@src/components/general/FormBuilder.vue'
import { default as countriesList } from '/@src/data/json/countryCode.json'
import { checkFormValidation } from '../validation/validations'
import { _createData, _updateData } from '/@src/api/esdata'
import { fetchFormOptions as fetchCreateFormOptions } from '../data/create_firewall_rule_data'
import { fetchFormOptions as fetchEditFormOptions } from '../data/edit_firewall_rule_data'

const { t } = useI18n()
const notif = useNotyf()
const props = defineProps({
  page: {
    type: String,
    default: '',
  },
  action: {
    type: String,
    default: 'create',
  },
  showFormRulesModal: {
    type: Boolean,
    default: undefined,
  },
  formInputs: {
    type: Object,
    default: ref([]),
  },
  formReferences: {
    type: Object,
    default: ref({}),
  },
  firewallRulesData: {
    type: Object,
    default: ref([]),
  },
  renderValues: {
    type: Function,
    default: () => () => {},
  },
  renderSubmitValues: {
    type: Function,
    default: () => () => {},
  },
  refUpdater: {
    type: Function,
    default: () => () => {},
  },
  attributeUpdater: {
    type: Function,
    default: () => () => {},
  },
})

const entry = ref(props.firewallRulesData)
const isLoading = ref(false)
const formInput = ref(props.formInputs)
const reRender = ref(false)
const performValidation = ref(false)
const showFormRulesModal = computed(() => {
  return props.showFormRulesModal
})

const emit = defineEmits(['show-form-rules', 'getData'])
const closeFirewallForm = () => {
  emit('show-form-rules', false)
  reRender.value = false
}

const handleSubmit = () => {
  const validatedInputs = checkFormValidation(props.formReferences, props.action)
  if (validatedInputs.formInputs) {
    formInput.value = validatedInputs.formInputs
    performValidation.value = true
    if (validatedInputs.isFormValid) {
      const currValues = props.renderSubmitValues()
      let newRules = currValues
      if (props.action === 'create') {
        _createData('rcm-wafrules', newRules).then(async (result) => {
          notification(result)
        })
      } else {
        _updateData('rcm-wafrules', newRules).then(async (result) => {
          notification(result)
        })
      }
    }
  }
}

const notification = (result: any) => {
  if (result.data.success) {
    closeFirewallForm()
    emit('getData')
    if (result.data.taskNo != '') {
      if (props.action === 'create') {
        notif.success('Create successful!')
      } else {
        notif.success('Update successful!')
      }
    } else {
      notif.error('Action Failed!')
    }
  } else {
    notif.error(result.data.message)
  }
}

const handleValidationPerformed = () => {
  performValidation.value = false
}

const country = ref(entry.value.wafCountry)

function switchCountry() {
  entry.value = props.renderValues()
  let _country = []

  for (let item of countriesList) {
    if (!country.value?.includes(item.value)) {
      _country.push(item.value)
    }
  }

  country.value = _country
  entry.value.wafCountry = country.value
  props.refUpdater(entry.value)
  _country = []
}

watch(
  () => props.firewallRulesData,
  () => {
    if (props.firewallRulesData) {
      entry.value = props.refUpdater(props.firewallRulesData)
      country.value = entry.value.wafCountry
      if (props.action === 'edit') {
        reRender.value = true
      }
    }
  }
)

onBeforeMount(async () => {
  if (props.action === 'create') {
    formInput.value = await fetchCreateFormOptions()
  } else if (props.action === 'edit') {
    formInput.value = await fetchEditFormOptions()
  }
})
</script>

<template>
  <VModal
    :open="showFormRulesModal"
    :title="props.action === 'create' ? 'Add Firewall Rules' : 'Edit Firewall Rules'"
    size="large"
    actions="right"
    @close="closeFirewallForm"
  >
    <template #content>
      <form v-if="entry" class="modal-form" @submit.prevent="handleSubmit">
        <FormBuilder
          v-slot="slotProps"
          :form-inputs="formInput"
          :re-render="reRender"
          :perform-validation="performValidation"
          @validation-performed="handleValidationPerformed"
        >
          <div v-if="slotProps.input.key === 'wafIsp'" class="field">
            <VField>
              <label
                >{{ t('waf.wafCountry') }}

                <span v-tooltip.right="`${t('waf.tooltip.sourceCountry')}`" class="ml-2">
                  <i class="icon-tooltip fas fa-question-circle"></i>
                </span>
              </label>

              <VControl>
                <div class="country-section">
                  <div @click="switchCountry" @keydown="switchCountry">
                    <i class="lnir lnir-switch country-btn"></i>
                  </div>

                  <Multiselect
                    v-model="country"
                    mode="tags"
                    placeholder="Select"
                    :options="countriesList"
                  />
                </div>
              </VControl>
            </VField>
          </div>
        </FormBuilder>
      </form>
    </template>
    <template #action>
      <VButton color="primary" raised :loading="isLoading" @click="handleSubmit">{{
        t('service.confirmText')
      }}</VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
.missing-alert {
  font-size: 0.75rem;
  color: $danger !important;
  padding-left: 10px;
}

.add-btn {
  margin-left: 0.5rem;
  height: 0;
  padding: 10px;
  position: relative;
  top: -2px;
}

.country-section {
  display: flex;
  align-items: flex-start;

  .country-btn {
    height: 35px;
    width: 35px;
    background: #ededed;
    border-radius: 5px;
    margin-right: 10px;
    padding: 11px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
