<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useHead } from '@vueuse/head'
import { ref, onMounted, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getGroupNamesOption,
  getServiceGroupNameOptions,
  getServerNamesOptions,
  getOriginOption,
  getHttpPortOptions,
  getHttpsPortOptions,
} from '/@src/api/formOptions'
import { pageTitle } from '/@src/state/sidebarLayoutState'
import store from '/@src/stores/index'

import CreateServicePart1 from './container/CreateServicePart1.vue'
import CreateServicePart2 from './container/CreateServicePart2.vue'
import CreateServicePart3 from './container/CreateServicePart3.vue'

const { locale, t } = useI18n()
const step = ref(1)
const allGroupNames = ref([])
const userServiceGroups = ref([])
const userDomains = ref([])
const userDomainReduce = ref([])
const originOptions = ref([])
const originOptionReduce = ref([])
const httpPort = ref([])
const httpsPort = ref([])
const clear = ref(false)

const goStep = (value: number) => {
  step.value += value
}

const stepBack = (value: number) => {
  step.value -= value
}

const restartNew = () => {
  step.value = 1
  clear.value = true
}

onBeforeMount(() => {
  getGroupNamesOption().then((res) => {
    allGroupNames.value = res.data.options
  })
  getServiceGroupNameOptions(store.state.queryGroupName).then((res) => {
    userServiceGroups.value = res.data.options
  })
  getServerNamesOptions(store.state.queryGroupName).then((res) => {
    userDomains.value = res.data.options
    userDomainReduce.value = userDomains.value.slice(0, 30)
  })
  getOriginOption(store.state.queryGroupName).then((res) => {
    originOptions.value = res.data.options
    originOptionReduce.value = originOptions.value.slice(0, 30)
  })
  getHttpPortOptions(`${store.state.queryGroupName}&origins=***`).then((res) => {
    httpPort.value = res.data.options
  })
  getHttpsPortOptions(`${store.state.queryGroupName}&origins=***`).then((res) => {
    httpsPort.value = res.data.options
  })
})

pageTitle.value = 'addSite'
useHead({
  title: 'Add Site',
})
</script>

<template>
  <div class="page-content-inner">
    <div id="solarspeed-signup" class="signup-wrapper" style="background: transparent">
      <div class="signup-steps" :class="[step === 0 && 'is-hidden']">
        <div class="steps-container">
          <div
            class="step-icon is-active"
            :class="[step >= 1 && 'is-active', step < 1 && 'is-inactive']"
          >
            <div class="inner">1</div>
            <span class="step-label">{{
              `${t('service.createText')} ${t('service.serviceText')}`
            }}</span>
            <span class="step-label" style="margin-top: 1.25rem; opacity: 0.7"
              >{{ `${t('service.add')} ${t('service.service_name')}` }} &
              {{ t('service.origin_details') }}</span
            >
          </div>
          <div
            class="step-icon"
            :class="[step >= 2 && 'is-active', step < 2 && 'is-inactive']"
          >
            <div class="inner">2</div>
            <span class="step-label">{{ t('service.ssl/tls') }}</span>
            <span class="step-label" style="margin-top: 1.25rem; opacity: 0.7"
              >HTTP/HTTPS {{ t('service.settingText') }}</span
            >
          </div>
          <div
            class="step-icon"
            :class="[step >= 3 && 'is-active', step < 3 && 'is-inactive']"
          >
            <div class="inner">3</div>
            <span class="step-label">{{ t('service.confirmText') }}</span>
            <span class="step-label" style="margin-top: 1.25rem; opacity: 0.7"
              >{{ t('service.confirmText') }} CNAME</span
            >
          </div>
          <progress class="progress" :value="step - 1" :max="2">25%</progress>
        </div>
      </div>

      <img
        :class="[step > 0 && 'is-hidden']"
        class="card-bg"
        src="/images/backgrounds/signup/solarspeed-signup.png"
        alt=""
      />

      <div class="hero is-fullheight">
        <div class="hero-body" style="margin-top: 8rem; align-items: unset">
          <div class="container">
            <!-- Step 1 - Create Service Line  -->
            <div
              class="columns signup-columns"
              style="justify-content: center"
              :class="[step !== 1 && 'is-hidden']"
            >
              <CreateServicePart1
                :package="userServiceGroups"
                :http-port="httpPort"
                :https-port="httpsPort"
                :origins="originOptions"
                :step="step"
                :clear="clear"
                @step_forward="goStep(1)"
                @step_back="stepBack(1)"
              />
            </div>
            <!-- Step 2 - Add Domain Name & Certificates -->
            <div
              class="columns signup-columns"
              style="justify-content: center"
              :class="[step !== 2 && 'is-hidden']"
            >
              <CreateServicePart2
                :http-port="httpPort"
                :https-port="httpsPort"
                :step="step"
                @step_forward="goStep(1)"
                @step_back="stepBack(1)"
              />
            </div>
            <!-- Step 3 - Show CNAME / Success Page -->
            <div
              class="columns signup-columns"
              style="justify-content: center"
              :class="[step !== 3 && 'is-hidden']"
            >
              <CreateServicePart3 :step="step" @step_forward="restartNew()" />
              <!-- <CreateServicePart3 :step="step" @step_forward="step = 1" /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <V-Button color="default" @click="step--" raised>Prev</V-Button>
    <V-Button color="primary" @click="purgeClickNext()" raised>{{
      step !== 3 ? 'Next' : 'Submit'
    }}</V-Button> -->
  </div>
</template>
