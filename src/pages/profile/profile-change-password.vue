<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'

import { resetPassword } from '/@src/api/user'

const { t } = useI18n()
const notyf = useNotyf()
const { y } = useWindowScroll()

const isLoading = ref(false)
// const twoFactor = ref(true)
// const notifications = ref(false)
// const notificationsLow = ref(false)
// const marketing = ref(false)
// const partners = ref(false)

const isScrolling = computed(() => {
  return y.value > 30
})

const password = reactive({
  oldPassword: { value: 'password', error: false, empty: false },
  newPassword: { value: '', error: false, empty: false },
  repeatPassword: { value: '', error: false, empty: false },
})

const onSave = async () => {
  if (
    password.oldPassword.value !== '' &&
    password.newPassword.value !== '' &&
    password.repeatPassword.value !== ''
  ) {
    if (password.newPassword.value !== password.oldPassword.value) {
      password.oldPassword.error = false
      password.newPassword.error = false
      password.repeatPassword.error = false

      password.oldPassword.empty = false
      password.newPassword.empty = false
      password.repeatPassword.empty = false

      if (password.newPassword.value === password.repeatPassword.value) {
        isLoading.value = true
        await sleep()
        try {
          let data = await resetPassword({
            password: password.newPassword.value,
          })
          if (data.data.success === false) {
            throw Error(data.data.message)
          } else {
            notyf.success('Your changes have been successfully saved!')
            password.repeatPassword.value = ''
            password.newPassword.value = ''
          }
        } catch (err) {
          notyf.error(err.message)
        }
      } else {
        password.repeatPassword.empty = false
        password.repeatPassword.error = true
      }
    } else {
      password.newPassword.empty = false
      password.newPassword.error = true
    }
  } else if (password.newPassword.value === '') {
    password.newPassword.empty = true
  } else if (password.repeatPassword.value === '') {
    password.repeatPassword.empty = true
  }

  isLoading.value = false
}
</script>

<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
      <div class="form-head-inner">
        <div class="left">
          <h3>{{ t('setting.change_password') }}</h3>
          <p>{{ t('setting.password_content') }}</p>
        </div>
        <div class="right">
          <div class="buttons">
            <V-Button :to="{ name: 'profile-change-password' }" light dark-outlined>
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
          <h4>{{ t('setting.change_password') }}</h4>
          <p>{{ t('setting.password_content') }}</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:unlock">
                <input
                  v-model="password.oldPassword.value"
                  type="password"
                  class="input"
                  :placeholder="t('setting.old_password')"
                  autocomplete="current-password"
                  disabled
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:lock">
                <input
                  v-model="password.newPassword.value"
                  type="password"
                  class="input"
                  :placeholder="t('setting.new_password')"
                  autocomplete="new-password"
                />
                <p v-if="password.newPassword.error" class="help text-danger">
                  {{ t('setting.warning.passord_duplicate') }}
                </p>
                <p v-if="password.newPassword.empty" class="help text-danger">
                  {{ t('setting.warning.passord_enter') }}
                </p>
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:lock">
                <input
                  v-model="password.repeatPassword.value"
                  type="password"
                  class="input"
                  :placeholder="t('setting.password_repeat')"
                  autocomplete="new-password"
                />
                <p v-if="password.repeatPassword.error" class="help text-danger">
                  {{ t('setting.warining.passord_motmatch') }}
                </p>

                <p v-if="password.repeatPassword.empty" class="help text-danger">
                  {{ t('setting.warning.passord_repeat') }}
                </p>
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
