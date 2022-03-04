<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { Field, useForm } from 'vee-validate'
import * as yup from 'yup'

import { useDarkmode } from '/@src/stores/darkmode'
import useNotyf from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'

const darkmode = useDarkmode()
const router = useRouter()
const notif = useNotyf()

const isLoading = ref(false)
const { locale, t } = useI18n()

// Define a validation schema
const schema = yup.object({
  promotional: yup.mixed(),
  name: yup.string().required(t('signup.errors.name.required')),
  email: yup
    .string()
    .required(t('signup.errors.email.required'))
    .email(t('signup.errors.email.format')),
  password: yup
    .string()
    .required(t('signup.errors.password.required'))
    .min(8, t('signup.errors.password.length')),
  passwordCheck: yup
    .string()
    .required(t('signup.errors.passwordCheck.required'))
    .oneOf([yup.ref('password')], t('signup.errors.passwordCheck.match')),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

const onSignup = handleSubmit(async (values) => {
  console.log('handleSignup values')
  console.table(values)

  if (!isLoading.value) {
    isLoading.value = true

    await sleep(800)

    notif.dismissAll()
    notif.success('Welcome, Erik Kovalsky')

    router.push({ name: '' })
    isLoading.value = false
  }
})

useHead({
  title: 'Signup',
})
</script>

<template>
  <div class="auth-wrapper-inner columns is-gapless">
    <!-- Form section -->
    <div class="column is-5">
      <div class="hero is-fullheight is-white">
        <div class="hero-heading">
          <!-- <label
            class="dark-mode ml-auto"
            tabindex="0"
            @keydown.space.prevent="(e) => (e.target as HTMLLabelElement).click()"
          >
            <input
              type="checkbox"
              :checked="!darkmode.isDark"
              @change="darkmode.onChange"
            />
            <span></span>
          </label> -->
          <div class="auth-logo">
            <RouterLink :to="{ name: 'index' }">
              <!-- <AnimatedLogo class="top-logo" width="36px" height="36px" /> -->
              <img src="/images/auth/logo-solarspeed.svg" alt="logo" class="logo" />
            </RouterLink>
            <Toolbar />
          </div>
          <LanguagesPanel />
        </div>
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-12">
                <div class="auth-content">
                  <h2>{{ t('signup.title') }}</h2>
                  <p>{{ t('signup.subtitle') }}</p>
                  <RouterLink :to="{ name: 'login' }">
                    {{ t('signup.loginText') }}
                  </RouterLink>
                </div>
                <div class="auth-form-wrapper">
                  <!-- Login Form -->
                  <form @submit="onSignup">
                    <div id="signin-form" class="login-form">
                      <!-- Input -->
                      <Field v-slot="{ field, errorMessage }" name="username">
                        <VField>
                          <VControl
                            icon="feather:user"
                            :has-error="Boolean(errorMessage)"
                          >
                            <input
                              v-bind="field"
                              class="input"
                              type="text"
                              :placeholder="t('signup.username')"
                              autocomplete="name"
                            />
                            <p v-if="errorMessage" class="help is-danger">
                              {{ errorMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </Field>

                      <!-- Input -->
                      <Field v-slot="{ field, errorMessage }" name="email">
                        <VField>
                          <VControl
                            icon="feather:mail"
                            :has-error="Boolean(errorMessage)"
                          >
                            <input
                              v-bind="field"
                              class="input"
                              type="text"
                              :placeholder="t('signup.email')"
                              autocomplete="email"
                            />
                            <p v-if="errorMessage" class="help is-danger">
                              {{ errorMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </Field>

                      <!-- Input -->
                      <Field v-slot="{ field, errorMessage }" name="password">
                        <VField>
                          <VControl
                            icon="feather:lock"
                            :has-error="Boolean(errorMessage)"
                          >
                            <input
                              v-bind="field"
                              class="input"
                              type="password"
                              :placeholder="t('signup.password')"
                              autocomplete="new-password"
                            />
                            <p v-if="errorMessage" class="help is-danger">
                              {{ errorMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </Field>

                      <!-- Input -->
                      <Field v-slot="{ field, errorMessage }" name="passwordCheck">
                        <VField>
                          <VControl
                            icon="feather:lock"
                            :has-error="Boolean(errorMessage)"
                          >
                            <input
                              v-bind="field"
                              class="input"
                              type="password"
                              :placeholder="t('signup.password')"
                            />
                            <p v-if="errorMessage" class="help is-danger">
                              {{ errorMessage }}
                            </p>
                          </VControl>
                        </VField>
                      </Field>

                      <!-- Submit -->

                      <VField>
                        <VControl class="login">
                          <VButton type="submit" color="primary" bold fullwidth raised>
                            {{ t('signup.signupText') }}
                          </VButton>
                        </VControl>
                      </VField>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image section (hidden on mobile) -->
    <div class="column login-column is-7 is-hidden-mobile hero-banner">
      <div class="hero login-hero is-fullheight is-app-grey">
        <div class="hero-body">
          <div class="columns">
            <div class="column is-10 is-offset-1">
              <img class="light-image login-image" src="/images/auth/login.svg" alt="" />
              <img class="dark-image login-image" src="/images/auth/login.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="hero-footer">
          <p class="has-text-centered"></p>
        </div>
      </div>
    </div>
  </div>
</template>
