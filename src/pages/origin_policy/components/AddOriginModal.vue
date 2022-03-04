<script setup lang="ts">
import { ref, reactive, defineEmits, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { getOriginOption } from '/@src/api/formOptions'
import store from '/@src/stores/index'

const { t } = useI18n()
const emit = defineEmits(['add-origin-to-policy'])

const props = defineProps({
  originPolicyForm: {
    type: Object,
    default: () => {},
  },
})

const originAddressForm = reactive({
  host: { value: '', error1: false, error2: false },
  isBackupHost: false,
  isHostEnabled: true,
  weight: 1,
})

const originOptions = ref([])
const showOriginsModal = ref(false)

const addOriginToPolicy = async () => {
  if (originAddressForm.host.value === '') {
    originAddressForm.host.error1 = true
  } else {
    originAddressForm.host.error1 = false
    let addressFormCopy = { ...originAddressForm }
    if (
      addressFormCopy.host.value !== null &&
      props.originPolicyForm.originsOptions.find(
        (e: any) => e.host == addressFormCopy.host.value
      ) == undefined
    ) {
      emit('add-origin-to-policy', [
        ...props.originPolicyForm.originsOptions.map((oo) =>
          JSON.parse(JSON.stringify(oo))
        ),
        {
          ...addressFormCopy,
          host: originAddressForm.host.value,
        },
      ])
      showOriginsModal.value = false
      originAddressForm.host = { value: '', error1: false, error2: false }
    } else {
      if (
        props.originPolicyForm.originsOptions.find(
          (e: any) => e.host == addressFormCopy.host.value
        ) !== undefined
      ) {
        originAddressForm.host.error2 = true
      } else {
        originAddressForm.host.error2 = false
      }
    }
  }
}

onBeforeMount(async () => {
  await getOriginOption(store.state.queryGroupName).then((res) => {
    originOptions.value = res.data.options
  })
})
</script>

<template>
  <VModal
    :open="showOriginsModal"
    title="Add Origin"
    size="small"
    actions="right"
    @close="showOriginsModal = false"
  >
    <template #content>
      <form class="" @submit.prevent="addOriginToPolicy">
        <VField>
          <label>{{ t('origin.origin') }}</label>
          <VControl :has-error="originAddressForm.host.error1 == true ? true : false">
            <Multiselect
              v-model="originAddressForm.host.value"
              :options="originOptions"
              placeholder="a.b.c.d"
              :searchable="true"
              :create-tag="true"
              :max="5"
            />
            <p v-if="originAddressForm.host.error1" class="help text-danger">
              {{ t('origin.warning.enter_origin_address_text') }}
            </p>
            <p v-if="originAddressForm.host.error2" class="help text-danger">
              {{ t('origin.warning.origin_used') }}
            </p>
          </VControl>
        </VField>
        <VField>
          <label>Weight</label>
          <VControl>
            <input
              v-model="originAddressForm.weight"
              type="number"
              class="input"
              :max="100"
              @change="
                () => {
                  if (originAddressForm.weight > 100 || originAddressForm.weight < 0) {
                    originAddressForm.weight = 100
                  }
                }
              "
            />
          </VControl>
        </VField>
        <VField>
          <label>Enabled </label>
          <VControl class="has-switch">
            <input
              v-model="originAddressForm.isHostEnabled"
              type="checkbox"
              class="is-switch"
            />
            <i aria-hidden="true"></i>
          </VControl>
        </VField>
        <VField>
          <label>As Backup </label>
          <VControl class="has-switch">
            <input
              v-model="originAddressForm.isBackupHost"
              type="checkbox"
              class="is-switch"
            />
            <i aria-hidden="true"></i>
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton color="primary" raised @click="addOriginToPolicy">{{
        t('service.confirmText')
      }}</VButton>
    </template>
  </VModal>

  <div>
    <VButton class="m-b-5" color="primary" @click="showOriginsModal = true"
      ><div style="color: white">{{ t('service.add') }}</div></VButton
    >
  </div>
</template>
