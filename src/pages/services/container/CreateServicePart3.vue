<script setup lang="ts">
// import { useWindowScroll } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import store from '/@src/stores'
import serviceStore from '/@src/stores/service'
import { integer } from '@vee-validate/rules'

// const port_number = ref(80)
// const system_cert = ref('value_1')
// const { y } = useWindowScroll()

const { t } = useI18n()
const emit = defineEmits(['step_forward', 'step_back'])
const props = defineProps({
  step: {
    type: integer,
    default: undefined,
  },
})

const cname = ref('')
const appProfileName = ref('')
const getCName = computed(() => {
  get_cname()
  return cname.value
})

const getAppProfileName = () => {
  appProfileName.value = serviceStore.state.service_detail.appProfileName
}

const get_cname = () => {
  cname.value = serviceStore.state.cname
}

const setAppProfileName = () => {
  getAppProfileName()
  return appProfileName.value
}

const clickServiceLine = (service: string) => {
  store.commit('SET_APP_PROFILE_NAME', service)
}

// const stepBack = () => {
//   emit('step_back')
// }
const stepForward = () => {
  emit('step_forward')
}

watch(
  () => props.step,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (count, prevCount) => {
    if (count == 3) {
      get_cname()
      getAppProfileName()
    }
  }
)
</script>

<template>
  <form class="form-layout" style="max-width: 1200px" @submit.prevent>
    <div class="form-outer">
      <div class="form-header stuck-header">
        <div class="form-header-inner">
          <div class="left">
            <h3>{{ t('service.assignedText') }} CNAME</h3>
          </div>
        </div>
      </div>
      <div class="form-body">
        <!--Fieldset-->
        <div class="form-fieldset" style="padding-top: 0">
          <div class="fieldset-heading">
            <h4>{{ t('service.assignend_success_text') }}</h4>
          </div>
          <div class="subtitle">{{ getCName }}</div>
        </div>
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="columns is-multiline">
            <div class="button-wrap">
              <VButton color="default" bold raised fullwidth @click="stepForward">
                {{ t('service.create_another_line') }}
              </VButton>
            </div>
            <div class="button-wrap">
              <RouterLink
                :to="{
                  name: 'service.overview',
                  query: {
                    appProfileName: setAppProfileName(),
                  },
                }"
              >
                <VButton
                  color="primary"
                  bold
                  raised
                  fullwidth
                  @click="clickServiceLine(setAppProfileName())"
                >
                  {{ t('service.back_to_overview') }}
                </VButton>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
