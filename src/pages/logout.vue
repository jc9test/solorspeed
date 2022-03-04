<script setup="props, { emit }" lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { _logout } from '/@src/api/user'
// import user from '../store/user'
import store from '../stores'

const router = useRouter()
const logout = () => {
  _logout()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .then((response) => {
      store.commit('SET_USER_DATA', {})
      store.commit('SET_EVENTLOG_COLUMN_SELECTION', [])
      // user.mutations.SET_USER_DATA(user.state, {})
      router.push({ name: 'login' })
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((errors) => {
      store.commit('SET_USER_DATA', {})
      // user.mutations.SET_USER_DATA(user.state, {})
      router.push({ name: 'login' })
    })
}
onMounted(() => {
  logout()
})
</script>

<template>
  <!-- Empty div should keep to ensure that the login is redirected successfully. -->
  <div></div>
</template>
