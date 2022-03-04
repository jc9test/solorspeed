<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const props = defineProps({
  isRequestHeaderShow: {
    type: Boolean,
    default: () => false,
  },
  contentJson: {
    type: Object,
    default: () => {},
  },
})
const { t } = useI18n()

const emit = defineEmits(['close-log-records'])
</script>

<template>
  <VModal
    :open="props.isRequestHeaderShow"
    :title="t('eventLog.req_headers')"
    size="large"
    actions="right"
    @close="emit('close-log-records')"
  >
    <template #content>
      <pre class="request-header-content">{{ contentJson }}</pre>
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
.is-dark pre {
  background: lighten($dark-sidebar, 10%);
  color: $white;
  border-radius: 5px;
}
.request-header-content {
  margin-top: 20px;
}
</style>
