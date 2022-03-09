<script setup lang="ts">
import { inject } from 'vue'
import { useHead } from '@vueuse/head'
import useNotyf from '/@src/composable/useNotyf'
import SidebarLayout from '/@src/layouts/SidebarLayout.vue'
import serviceStore from '/@src/stores/service'

useHead({
  title: 'Home',
})

const socket = inject('socket')
const notif = useNotyf()

// Listeners for default socket events
socket.on('connect', function () {
  console.log({ action: 'socket', val: 'Connected to WS server' })
  console.log(socket)
})
socket.on('connect_error', function (err) {
  // console.log('connect_error')
  console.log({ 'socket - connect_error': err })
})
socket.on('connect_timeout', function () {
  console.log('connect_timeout')
})
socket.on('connecting', function () {
  console.log('connecting')
})
socket.on('disconnect', function () {
  console.log('disconnect')
})
socket.on('error', function () {
  console.log('error')
})
socket.on('ping', function () {
  // console.log('ping')
})
socket.on('pong', function () {
  // console.log('pong')
})
socket.on('reconnect', function () {
  console.log('reconnect')
})
socket.on('reconnect_attempt', function () {
  console.log('reconnect_attempt')
})
socket.on('reconnect_error', function () {
  console.log('reconnect_error')
})
socket.on('reconnect_failed', function () {
  console.log('reconnect_failed')
})
socket.on('reconnecting', function () {
  console.log('reconnecting')
})
// Listeners for custom socket events
socket.onevent = function (packet) {
  let socketType = packet.data[0]
  let socketData = packet.data[1]
  console.log({ action: 'received packet onevent', packet })

  switch (socketType) {
    case 'updateslbclients':
      console.log({ action: 'Update Slb Clients', data: packet.data[1] })
      break
    case 'updateedgeclients':
      console.log({ action: 'Update Edge Clients', data: packet.data[1] })
      break
    case 'updateLineTestResult':
      console.log({ action: 'Update Line Test Result', data: packet.data[1] })
      // switch (result.type) {
      //   case 'TaskAccept':
      //     break
      //   case 'NewData':
      //     break
      //   case 'TaskEnd':
      //     break
      //   case 'TaskErr':
      //     break
      // }
      break
    case 'socketNotice':
      console.log({ action: 'Socket Notice', data: packet.data[1] })

      if (socketData?.success) {
        let refreshServiceDetail = socketData.cmBusEvents.filter((val) => {
          if (val.componentName == 'AppProfile' && val.busEvent == 'reloadTable') {
            return true
          }
        })

        if (refreshServiceDetail) {
          notif.success(`Successful update ${refreshServiceDetail[0].componentName}`)
          // console.log({ 'socketNotice - refreshServiceDetail': refreshServiceDetail })
          serviceStore.mutations.SET_REFRESH_TABLE(serviceStore.state, true)
        }
      }

      break
    case 'termData':
      console.log({ action: 'Term Data', data: packet.data[1] })
      break
    default:
      break
  }
}

// -- Testing function --

// setTimeout(() => {
//   socket.emit('getslbclients')
//   socket.emit('getedgeclients')
//   socket.emit('termData', {})
//   socket.emit('termResize', { termCols: [], termRows: [] })
//   socket.emit('node_connect', {
//     nodeType: '',
//     hostname: '',
//     sshKeyName: '',
//     sshUser: '',
//     sshHost: '',
//     sshPort: '',
//     sshAuthMethod: '',
//     sshPassword: '',
//     termCols: [],
//     termRows: [],
//   })
// }, 1000)
</script>

<template>
  <SidebarLayout theme="labels-hover">
    <div class="page-content-inner">
      <RouterView v-slot="{ Component }" :key="currentDomain">
        <!-- <transition name="fade-slow" mode="out-in"> -->
        <component :is="Component" />
        <!-- </transition> -->
      </RouterView>
    </div>
  </SidebarLayout>
</template>
