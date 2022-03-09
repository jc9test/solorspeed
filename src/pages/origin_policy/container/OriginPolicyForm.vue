<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import FormBuilder from '/@src/components/general/FormBuilder.vue'
import AddOriginModal from '../components/AddOriginModal.vue'
import FormOrigin from '../components/FormOrigin.vue'
import store from '/@src/stores/index'
import { checkDocumentExist, ipValidate } from '/@src/api/formValidate'
import { _createData, _updateData } from '/@src/api/esdata'
import useNotyf from '/@src/composable/useNotyf'
import { checkFormValidation, checkOriginOption } from '../validation/validations'
import { getFormOptions } from '/@src/api/formOptions'

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
  showFormPolicyModal: {
    type: Boolean,
    default: false,
  },
  formInputs: {
    type: Object,
    default: ref([]),
  },
  formReferences: {
    type: Object,
    default: ref({}),
  },
  originPolicyData: {
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

const entry = ref(props.originPolicyData)
const isLoading = ref(false)
const originError = ref(false)
const formInput = ref(props.formInputs)
const performValidation = ref(false)
const reRender = ref(false)

const emit = defineEmits(['show-form-policy', 'getData'])
const closeFormPolicy = () => {
  emit('show-form-policy', false)
  reRender.value = false
}

const handleSubmit = async () => {
  // isLoading.value = true
  const validatedInputs = checkFormValidation(props.formReferences, props.action)
  originError.value = checkOriginOption(entry.value.originsOptions).error
  if (validatedInputs.formInputs) {
    formInput.value = validatedInputs.formInputs
    performValidation.value = true
    if (validatedInputs.isFormValid && !originError.value) {
      const currValues = props.renderSubmitValues()
      let origins = currValues.originsOptions.map((o: any) => o.host)
      let option = {
        topic: 'originPolicyId',
        fieldVal: currValues.originPolicyName.value,
        groupName: store.state.queryGroupName,
      }
      await checkDocumentExist(option).then(async (res) => {
        if (res.data.success === true) {
          await ipValidate('origin', origins).then(async (result) => {
            if (!result.data.success) {
            } else {
              try {
                let newPolicy = currValues
                if (props.action == 'create') {
                  _createData('rcm-originpolicies', newPolicy).then(async (result) => {
                    notification(result)
                  })
                } else {
                  _updateData('rcm-originpolicies', newPolicy).then(async (result) => {
                    notification(result)
                  })
                }
              } catch (err) {
                console.log(err)
              }
            }
          })
        }
      })
      isLoading.value = false
    } else {
    }
  }
}

const notification = (result: any) => {
  if (result.data.success) {
    closeFormPolicy()
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

const addOriginHandler = (data: any) => {
  entry.value = props.renderValues()
  entry.value.originsOptions = data
  props.refUpdater(entry.value)
}
const handleDeleteOrigin = (origins: any) => {
  entry.value = props.renderValues()
  entry.value.originsOptions = origins
  props.refUpdater(entry.value)
}
watch(
  () => props.originPolicyData,
  () => {
    if (props.originPolicyData) {
      entry.value = props.refUpdater(props.originPolicyData)
      originError.value = false
      if (props.action === 'edit') {
        reRender.value = true
      }
    }
  }
)

const fetchOptions = async () => {
  reRender.value = true

  await getFormOptions(`groupnames`).then((res) => {
    formInput.value = props.attributeUpdater({
      key: 'groupName',
      attributeName: 'options',
      value: res.data.options,
    })
    reRender.value = false
  })
}

onBeforeMount(() => {
  fetchOptions()
})
</script>

<template>
  <VModal
    :open="showFormPolicyModal"
    :title="props.action === 'create' ? 'Add Origin Policy' : 'Edit Origin Policy'"
    size="large"
    actions="right"
    @close="closeFormPolicy"
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
          <div v-if="slotProps.sequence === 2" class="field">
            <div>
              <label>{{ t('origin.origin') }} *</label>

              <div v-tooltip.right="`${t('origin.tooltip.origin')}`" class="ml-2">
                <i class="icon-tooltip fas fa-question-circle"></i>
              </div>
              <template
                v-for="origin_policy in entry.originsOptions"
                :key="origin_policy"
              >
                <div class="m-t-5">
                  <FormOrigin
                    v-model:origins-options="entry.originsOptions"
                    :item-data="origin_policy"
                    @delete-origin="(origins: any) => handleDeleteOrigin(origins)"
                  />
                </div>
              </template>
            </div>
            <AddOriginModal
              :origin-policy-form="entry"
              @add-origin-to-policy="addOriginHandler"
            />
            <p v-if="originError" class="help text-danger">
              {{ t('origin.warning.at_least_one_origin') }}
            </p>
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
