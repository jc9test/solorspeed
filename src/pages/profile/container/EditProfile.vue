<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import store from '/@src/stores/index'

const { t } = useI18n()
const userAvatar = ref(store.state.userData.avatarName),
  userName = ref(store.state.userData.username)

const avatarImg = ref('/images/avatars/' + userAvatar.value + '.svg')
</script>
<template>
  <div class="page-content-inner">
    <!--Edit Profile-->
    <div class="account-wrapper">
      <div class="columns">
        <!--Navigation-->
        <div class="column is-4">
          <div class="account-box is-navigation">
            <VBlock :title="userName" subtitle="" center>
              <template #icon>
                <VAvatar
                  size="large"
                  :picture="avatarImg"
                  badge="/images/icons/flags/united-states-of-america.svg"
                />
              </template>
            </VBlock>

            <div class="account-menu">
              <RouterLink :to="{ name: 'profile-general' }" class="account-menu-item">
                <i aria-hidden="true" class="lnil lnil-user-alt"></i>
                <span>{{ t('setting.profile_setting') }}</span>
                <span class="end">
                  <i aria-hidden="true" class="fas fa-arrow-right"></i>
                </span>
              </RouterLink>

              <RouterLink
                :to="{ name: 'profile-change-password' }"
                class="account-menu-item"
              >
                <i aria-hidden="true" class="lnil lnil-cog"></i>
                <span>{{ t('setting.change_password') }}</span>
                <span class="end">
                  <i aria-hidden="true" class="fas fa-arrow-right"></i>
                </span>
              </RouterLink>

              <RouterLink :to="{ name: 'profile-security' }" class="account-menu-item">
                <i aria-hidden="true" class="lnil lnil-shield"></i>
                <span>{{ t('setting.security') }}</span>
                <span class="end">
                  <i aria-hidden="true" class="fas fa-arrow-right"></i>
                </span>
              </RouterLink>
              <RouterLink
                :to="{ name: 'profile-subscription' }"
                class="account-menu-item"
              >
                <i aria-hidden="true" class="lnil lnil-credit-cards"></i>
                <span>{{ t('setting.subscription') }}</span>
                <span class="end">
                  <i aria-hidden="true" class="fas fa-arrow-right"></i>
                </span>
              </RouterLink>
              <RouterLink :to="{ name: 'logout' }" class="account-menu-item">
                <i aria-hidden="true" class="lnil lnil-exit"></i>
                <span>{{ t('main.logout') }}</span>
                <span class="end">
                  <i aria-hidden="true" class="fas fa-arrow-right"></i>
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="column is-8">
          <RouterView v-slot="{ Component }">
            <component :is="Component" />
          </RouterView>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'src/scss/pages/profile/_user-profile.scss';
</style>
