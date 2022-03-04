<script setup lang="ts">
import { ref, onMounted, reactive, onBeforeMount } from 'vue'
import { policyOptions } from '../container/overview-render'
import { useI18n } from 'vue-i18n'
import { getOriginOption } from '/@src/api/formOptions'
import store from '/@src/stores/index'

const { t } = useI18n()
const props = defineProps({
  itemData: {
    type: Object,
    default: () => {},
  },
  originsOptions: {
    type: Array,
    default: () => {},
  },
  isEditFormShow: {
    type: Boolean,
    default: false,
  },
  btnExist: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['delete-origin'])

const originOption = ref(props.originsOptions)
const originOptions = ref([])
const showEditOriginsModal = ref(false)

const originData = ref([])

const initialOriginAddressForm = reactive({
  host: { value: '', error1: false, error2: false },
  isBackupHost: false,
  isHostEnabled: true,
  weight: 1,
})

const originAddressForm = reactive({
  host: { value: '', error1: false, error2: false },
  isBackupHost: false,
  isHostEnabled: true,
  weight: 1,
})

const editOriginToPolicy = async () => {
  if (originAddressForm.host.value === '') {
    originAddressForm.host.error1 = true
  } else {
    originAddressForm.host.error1 = false
    let addressFormCopy = { ...originAddressForm }
    if (addressFormCopy.host.value !== null) {
      addressFormCopy.host = originAddressForm.host.value
      if (
        addressFormCopy.value !== 'edit' &&
        originOption.value.find((e) => e.host == addressFormCopy.host.value) == undefined
      ) {
        if (initialOriginAddressForm.host.value != addressFormCopy.host) {
          originOption.value.forEach((oo, index) => {
            if (oo.host == initialOriginAddressForm.host.value)
              originOption.value.splice(index, 1)
          })
        }
        originOption.value.push(addressFormCopy)
      } else {
        originOption.value.forEach((oo: any, index) => {
          if (oo.host == initialOriginAddressForm.host.value)
            originOption.value.splice(index, 1)
        })
        originOption.value.push(addressFormCopy)
      }
      showEditOriginsModal.value = false
      originAddressForm.host = { value: '', error1: false, error2: false }
    } else {
      if (
        originOption.value.find((e) => e.host == addressFormCopy.host.value) !== undefined
      ) {
        originAddressForm.host.error2 = true
      } else {
        originAddressForm.host.error2 = false
      }
    }
  }
}
const deleteOrigin = async (host: any) => {
  if (originAddressForm.host.value === '') {
    originAddressForm.host.error1 = true
  } else {
    originAddressForm.host.error1 = false
    originOption.value.forEach((oo: any, index) => {
      if (oo.host == host) {
        originOption.value.splice(index, 1)
        emit('delete-origin', originOption.value)
      }
    })
  }
}

const updatePolicyOptions = () => {
  policyOptions.data.data = originData.value.map((origin) => [
    true,
    origin.originPolicyName,
    tableData.value.usedOriginPolicies.find(
      (e) => e.originPolicyName == origin.originPolicyName
    ) !== null
      ? 'inactive'
      : 'active',
    true,
  ])
}

const viewOrigin = (origin: object) => {
  originAddressForm.value = 'edit'
  originAddressForm.host.value = origin.host
  originAddressForm.isBackupHost = origin.isBackupHost
  originAddressForm.isHostEnabled = origin.isHostEnabled
  originAddressForm.weight = origin.weight

  initialOriginAddressForm.host.value = originAddressForm.host.value
  initialOriginAddressForm.isBackupHost = originAddressForm.isBackupHost
  initialOriginAddressForm.isHostEnabled = originAddressForm.isHostEnabled
  initialOriginAddressForm.weight = originAddressForm.weight
}

onBeforeMount(async () => {
  await getOriginOption(store.state.queryGroupName).then((res) => {
    originOptions.value = res.data.options
  })
})
onMounted(() => {
  updatePolicyOptions()
  viewOrigin(props.itemData)
})
</script>

<template>
  <VTag
    rounded
    color="primary"
    class="m-r-5 originTag"
    style="margin-bottom: 0.25rem; margin-top: 0.25rem"
    :label="props.itemData.host"
    @click="showEditOriginsModal = true"
  />
  <div class="icon">
    <i
      aria-hidden="true"
      class="lnil lnil-trash"
      @click="deleteOrigin(props.itemData.host)"
    ></i>
  </div>
  <div style="display: flex">
    <p>weight: {{ props.itemData.weight }},</p>
    <p>
      enabled:
      {{ props.itemData.isHostEnabled }},
    </p>
    <p>
      as backup:
      {{ props.itemData.isBackupHost }}
    </p>
  </div>
  <!-- <transition appear> -->
  <VModal
    :open="showEditOriginsModal"
    title="Edit Origin"
    size="small"
    actions="right"
    @close="showEditOriginsModal = false"
  >
    <template #content>
      <form class="" @submit.prevent="editOriginToPolicy">
        <VField>
          <label>{{ t('origin.origin') }}</label>
          <VControl :has-error="originAddressForm.host.value == 'true' ? true : false">
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
      <VButton color="primary" raised @click="editOriginToPolicy">{{
        t('service.confirmText')
      }}</VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
.originTag {
  cursor: pointer;
}
</style>
