<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import store from '/@src/stores/index'

const router = useRouter()
const { locale, t } = useI18n()
const userAvatar = ref(store.state.userData.avatarName),
  userName = ref(store.state.userData.username)

const avatarImg = computed(() => {
  return '/images/avatars/' + userAvatar.value + '.svg'
})

const logout = () => {
  // router.push({ name: 'logout' })
  router.push({ name: 'login' })
}
</script>

<template>
  <VDropdown right spaced class="user-dropdown profile-dropdown">
    <template #button="{ toggle }">
      <a
        tabindex="0"
        class="is-trigger dropdown-trigger"
        aria-haspopup="true"
        @click="toggle"
        @keypress="bar"
      >
        <!-- @keydown.space.prevent="toggle" -->
        <VAvatar :picture="avatarImg" />
      </a>
    </template>

    <template #content>
      <div class="dropdown-head">
        <VAvatar size="large" :picture="avatarImg" />

        <div class="meta">
          <span>{{ userName }}</span>
          <!-- <span>Product Manager</span> -->
        </div>
      </div>

      <a href="/user/profile" role="menuitem" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-user-alt"></i>
        </div>
        <div class="meta">
          <span>Profile</span>
        </div>
      </a>

      <!-- <hr class="dropdown-divider" /> -->

      <RouterLink
        :to="{ name: 'profile-change-password' }"
        class="dropdown-item is-media"
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-cog"></i>
        </div>
        <div class="meta">
          <span>{{ t('setting.change_password') }}</span>
        </div>
      </RouterLink>

      <RouterLink :to="{ name: 'profile-security' }" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-shield"></i>
        </div>
        <div class="meta">
          <span>{{ t('setting.security') }}</span>
        </div>
      </RouterLink>

      <RouterLink :to="{ name: 'profile-subscription' }" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-credit-cards"></i>
        </div>
        <div class="meta">
          <span>{{ t('setting.subscription') }}</span>
        </div>
      </RouterLink>

      <!-- <hr class="dropdown-divider" /> -->

      <div class="dropdown-item is-button">
        <VButton
          class="logout-button"
          icon="feather:log-out"
          color="primary"
          role="menuitem"
          raised
          fullwidth
          @click="logout"
        >
          Logout
        </VButton>
      </div>
    </template>
  </VDropdown>
</template>
