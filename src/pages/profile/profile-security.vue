<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'

const { t } = useI18n()
const notyf = useNotyf()
const { y } = useWindowScroll()

const isLoading = ref(false)
const twoFactor = ref(true)
// const notifications = ref(false)
// const notificationsLow = ref(false)
// const marketing = ref(false)
// const partners = ref(false)

const isScrolling = computed(() => {
  return y.value > 30
})
const onSave = async () => {
  isLoading.value = true
  await sleep()
  notyf.success('Your changes have been successfully saved!')
  isLoading.value = false
}
</script>

<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
      <div class="form-head-inner">
        <div class="left">
          <h3>{{ t('setting.security') }}</h3>
          <p>{{ t('setting.security_content') }}</p>
        </div>
        <div class="right">
          <div class="buttons">
            <V-Button :to="{ name: 'profile-general' }" light dark-outlined>
              {{ t('main.cancelText') }}
            </V-Button>
            <V-Button color="primary" raised :loading="isLoading" @click="onSave">
              {{ t('main.saveText') }}
            </V-Button>
          </div>
        </div>
      </div>
    </div>
    <form class="form-body" @submit.prevent="onSave">
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>{{ t('setting.2factor_auth') }}</h4>
          <p>{{ t('setting.2factor_content') }}</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl>
                <VSwitchBlock
                  v-model="twoFactor"
                  :label="t('setting.2factor_content')"
                  color="primary"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div v-if="twoFactor" class="column is-12">
            <VField>
              <VControl icon="feather:smartphone">
                <input
                  type="text"
                  class="input"
                  :placeholder="t('setting.phone_number')"
                  autocomplete="tel"
                  inputmode="tel"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
