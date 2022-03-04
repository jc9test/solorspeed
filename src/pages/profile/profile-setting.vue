<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useNotyf from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'
import store from '/@src/stores/index'
import { setUserAvatar } from '/@src/api/user'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const isLoading = ref(false)
const showAvatar = ref(false)
// const isUploading = ref(false)
// const experience = ref('')
// const firstJob = ref('')
// const selectedAvatar = ref('')
// const flexibility = ref('')
// const remote = ref('')
// const skills = ref(['software', 'saas', 'engineering'])
// const skillsOptions = [
//   { value: 'software', label: 'Software' },
//   { value: 'saas', label: 'SaaS' },
//   { value: 'engineering', label: 'Engineering' },
// ]
const userName = ref(store.state.userData.username),
  userEmail = ref(store.state.userData.email),
  userAvatar = ref(store.state.userData.avatarName)

const avatarImg = ref('/images/avatars/' + userAvatar.value + '.svg')

const avatarItems = ref([{ avatarName: 'two-ponytails-hair-lady-with-green-glasses' }])

for (let i = 0; i < avatarItems.value.length; i++) {
  avatarItems.value[i].avatarPath =
    '/images/avatars/' + avatarItems.value[i].avatarName + '.svg'
}

const notyf = useNotyf()
// const { y } = useWindowScroll()

// const isScrolling = computed(() => {
//   return y.value > 30
// })

const profile = reactive({
  username: { value: userName.value },
  email: { value: userEmail.value },
})

// const onAddFile = (error: any, file: any) => {
//   if (error) {
//     console.error(error)
//     return
//   }
// }
// const onRemoveFile = (error: any, file: any) => {
//   if (error) {
//     console.error(error)
//     return
//   }
// }

const selectAvatar = (name: String) => {
  userAvatar.value = name
}

const resetAvatar = () => {
  showAvatar.value = false
  userAvatar.value = store.state.userData.avatarName
}

watch(userAvatar, () => {
  avatarImg.value = '/images/avatars/' + userAvatar.value + '.svg'
})

const onSave = async () => {
  isLoading.value = true
  await sleep()
  if (userAvatar.value != store.state.userData.avatarName) {
    try {
      let data = await setUserAvatar({
        avatarName: userAvatar.value,
      })
      if (data.data.success === false) {
        throw Error(data.data.message)
      } else {
        store.state.userData.avatarName = userAvatar.value
        await notyf.success(t('setting.notif.change_success'))
        await sleep()
        router.go(router.currentRoute)
      }
    } catch (err) {
      notyf.error(err.message)
    }
  } else {
    notyf.success(t('setting.notif.change_success'))
  }
  showAvatar.value = false
  isLoading.value = false
}
</script>

<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header">
      <div class="form-head-inner">
        <div class="left">
          <h3>{{ t('setting.profile_info') }}</h3>
          <p>{{ t('setting.profile_content') }}</p>
        </div>
        <div class="right">
          <div class="buttons">
            <VButton
              :to="{ name: 'home-profile' }"
              light
              dark-outlined
              @click="resetAvatar"
            >
              {{ t('main.cancelText') }}
            </VButton>
            <VButton color="primary" raised :loading="isLoading" @click="onSave">
              {{ t('main.saveText') }}
            </VButton>
          </div>
        </div>
      </div>
    </div>
    <div class="form-body">
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>{{ t('setting.profile_picture') }}</h4>
          <!-- <p>This is how others will recognize you</p> -->
        </div>

        <VAvatar size="xl" class="profile-v-avatar">
          <template #avatar>
            <img
              class="avatar"
              :src="avatarImg"
              alt=""
              @error.once="$event.target.src = 'https://via.placeholder.com/150x150'"
            />
            <!-- <V-FilePond
              v-else
              class="profile-filepond"
              name="profile_filepond"
              :chunk-retry-delays="[500, 1000, 3000]"
              label-idle="<i class='lnil lnil-cloud-upload'></i>"
              :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
              :image-preview-height="140"
              :image-resize-target-width="140"
              :image-resize-target-height="140"
              image-crop-aspect-ratio="1:1"
              style-panel-layout="compact circle"
              style-load-indicator-position="center bottom"
              style-progress-indicator-position="right bottom"
              style-button-remove-item-position="left bottom"
              style-button-process-item-position="right bottom"
              @addfile="onAddFile"
              @removefile="onRemoveFile"
            /> -->
            <V-IconButton
              v-if="!showAvatar"
              icon="feather:edit-2"
              class="edit-button is-edit"
              circle
              @click="showAvatar = true"
              @keydown="showAvatar = true"
            />
            <V-IconButton
              v-else
              icon="feather:arrow-left"
              class="edit-button is-back"
              circle
              @click="resetAvatar"
              @keydown="resetAvatar"
            />
          </template>
        </VAvatar>
      </div>

      <div class="avatar-list" :class="{ 'show-avatar': showAvatar === true }">
        <span
          v-for="avatar in avatarItems"
          :key="avatar"
          style="cursor: pointer"
          @click="selectAvatar(avatar.avatarName)"
          @keydown="selectAvatar(avatar.avatarName)"
        >
          <VAvatar size="xl" class="profile-v-avatar">
            <template #avatar>
              <img
                class="avatar"
                :src="avatar.avatarPath"
                alt=""
                @error.once="$event.target.src = 'https://via.placeholder.com/150x150'"
              />
            </template>
          </VAvatar>
        </span>
      </div>
      <!--Fieldset-->
      <div class="fieldset">
        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:user">
                <input
                  v-model="profile.username.value"
                  type="text"
                  class="input"
                  :placeholder="t('setting.username')"
                  autocomplete="given-name"
                  disabled
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:mail">
                <input
                  v-model="profile.email.value"
                  type="text"
                  class="input"
                  :placeholder="t('setting.username')"
                  autocomplete="email"
                  disabled
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
