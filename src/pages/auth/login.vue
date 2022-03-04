<script setup="props, { emit }" lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed, reactive, ref, toRefs, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'

import { useDarkmode } from '/@src/stores/darkmode'
import { useUserSession } from '/@src/stores/userSession'
import useNotyf from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'

import { useI18n } from 'vue-i18n'
import { _login, getUserData } from '/@src/api/user'
import store from '/@src/stores/index'

type StepId = 'login' | 'forgot-password'
const step = ref<StepId>('login')
const isPasswordShow = ref(false)
const isLoading = ref(false)
const darkmode = useDarkmode()
const router = useRouter()
const route = useRoute()
const notif = useNotyf()
const userSession = useUserSession()
const redirect = route.query.redirect as string

const { locale, t } = useI18n()

const loginForm = reactive({
  username: { value: '', error: false },
  password: { value: '', error: false },
  otpToken: { value: '', error: false },
})

const handleLogin = async () => {
  if (!isLoading.value) {
    isLoading.value = true
    if (
      loginForm.username.value !== '' &&
      loginForm.password.value !== '' &&
      loginForm.otpToken.value !== ''
    ) {
      loginForm.username.error = false
      loginForm.password.error = false
      loginForm.otpToken.error = false
      let login_payload = {
        username: loginForm.username.value,
        password: loginForm.password.value,
        otpToken: loginForm.otpToken.value.toString(),
      }
      console.log(login_payload)
      try {
        await _login(login_payload)
        try {
          let userDataResult = await getUserData()
          let userData = userDataResult.data

          store.commit('SET_USER_DATA', userData)
          router.push({ name: 'index' })
        } catch (err) {
          notif.error(err)
        }
      } catch (err) {
        notif.error(t(err))
      }
    } else {
      if (loginForm.username.value == '') {
        loginForm.username.error = true
      } else {
        loginForm.username.error = false
      }

      if (loginForm.password.value == '') {
        loginForm.password.error = true
      } else {
        loginForm.password.error = false
      }
      if (loginForm.otpToken.value == '') {
        loginForm.otpToken.error = true
      } else {
        loginForm.otpToken.error = false
      }
    }

    isLoading.value = false
  }
}

useHead({
  title: 'Login',
})
</script>

<template>
  <div class="auth-wrapper-inner columns is-gapless">
    <!-- Image section (hidden on mobile) -->
    <div class="column login-column is-8 h-hidden-mobile h-hidden-tablet-p hero-banner">
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

    <!-- Form section -->
    <div class="column is-4">
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
              <!-- <AnimatedLogo width="36px" height="36px" /> -->
              <img src="/images/auth/logo-solarspeed.svg" alt="logo" class="logo" />
            </RouterLink>
            <Toolbar />
          </div>
          <LanguagesPanel />
        </div>
        <div class="hero-body">
          <div class="container is-form">
            <div class="columns">
              <div class="column is-12">
                <div class="auth-content">
                  <h2>Welcome Back.</h2>
                  <p>Please sign in to your account</p>
                  <RouterLink :to="{ name: 'signup' }">
                    I do not have an account yet
                  </RouterLink>
                </div>
                <div class="auth-form-wrapper">
                  <!-- Login Form -->
                  <!-- <form @submit.prevent="handleLogin"> -->
                  <form
                    :class="[step !== 'login' && 'is-hidden']"
                    @submit.prevent="handleLogin()"
                  >
                    <div class="login-form">
                      <!-- Username -->
                      <VField>
                        <VControl icon="feather:user">
                          <input
                            v-model="loginForm.username.value"
                            class="input"
                            type="text"
                            placeholder="Username"
                            autocomplete="username"
                          />
                          <p v-if="loginForm.username.error" class="help text-danger">
                            {{ t('login.warning.enter_username') }}
                          </p>
                        </VControl>
                      </VField>

                      <!-- Password -->
                      <V-Field class="password">
                        <V-Control icon="feather:lock">
                          <input
                            v-model="loginForm.password.value"
                            class="input"
                            :type="isPasswordShow ? 'text' : 'password'"
                            placeholder="Password"
                            autocomplete="current-password"
                          />
                          <p v-if="loginForm.password.error" class="help text-danger">
                            {{ t('login.warning.enter_password') }}
                          </p>
                        </V-Control>

                        <div @click="isPasswordShow = !isPasswordShow" @keydown="bar">
                          <div v-if="isPasswordShow">
                            <i class="iconify" data-icon="feather:eye"></i>
                          </div>

                          <div v-if="!isPasswordShow">
                            <i class="iconify" data-icon="feather:eye-off"></i>
                          </div>
                        </div>
                      </V-Field>

                      <!-- OTP Token -->
                      <V-Field>
                        <V-Control icon="feather:lock">
                          <input
                            v-model="loginForm.otpToken.value"
                            class="input"
                            type="tel"
                            placeholder="Token"
                          />
                          <p v-if="loginForm.otpToken.error" class="help text-danger">
                            {{ t('login.warning.enter_token') }}
                          </p>
                        </V-Control>
                      </V-Field>

                      <!-- Switch -->
                      <!-- <VControl class="setting-item">
                        <label for="remember-me" class="form-switch is-primary">
                          <input id="remember-me" type="checkbox" class="is-switch" />
                          <i aria-hidden="true"></i>
                        </label>
                        <div class="setting-meta">
                          <label for="remember-me">
                            <span>Remember Me</span>
                          </label>
                        </div>
                      </VControl> -->

                      <!-- Submit -->
                      <VControl class="login">
                        <VButton
                          :loading="isLoading"
                          color="primary"
                          type="submit"
                          bold
                          fullwidth
                          raised
                        >
                          {{ t('login.signInText') }}
                        </VButton>
                      </VControl>

                      <div class="forgot-link has-text-centered">
                        <!-- <a>{{ t('login.forget_password_text') }}</a> -->
                        <a
                          id="forgot-btn"
                          @click="step = 'forgot-password'"
                          @keypress="bar"
                        >
                          {{ t('login.forget_password_text') }}
                        </a>
                      </div>
                    </div>
                  </form>

                  <!-- forgot password form -->
                  <form
                    :class="[step !== 'forgot-password' && 'is-hidden']"
                    class="login-wrapper"
                    @submit.prevent
                  >
                    <p class="recover-text">
                      {{ t('login.forget_password_context') }}
                    </p>
                    <div class="control has-validation">
                      <input type="text" class="input" autocomplete="email" />
                      <small class="error-text">{{ t('login.warning.required') }}</small>
                      <div class="auth-label">{{ t('login.email') }}</div>
                      <div class="autv-icon">
                        <i aria-hidden="true" class="lnil lnil-envelope"></i>
                      </div>
                      <div class="validation-icon is-success">
                        <V-IconWrap icon="feather:check" />
                      </div>
                      <div class="validation-icon is-error">
                        <V-IconWrap icon="feather:x" />
                      </div>
                    </div>
                    <div class="button-wrap">
                      <V-Button
                        color="white"
                        size="big"
                        lower
                        rounded
                        @click="step = 'login'"
                      >
                        {{ t('login.signInText') }}
                      </V-Button>
                      <V-Button
                        color="primary"
                        size="big"
                        type="submit"
                        lower
                        rounded
                        solid
                        @click="step = 'login'"
                      >
                        {{ t('login.confirmText') }}
                      </V-Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
