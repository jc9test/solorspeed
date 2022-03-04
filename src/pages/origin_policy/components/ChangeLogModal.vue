<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const props = defineProps({
  isChangeLogShow: {
    type: Boolean,
    default: () => false,
  },
  objectLogData: {
    type: Array,
    default: () => [],
  },
})
const { t } = useI18n()

const logDiffData = ref()

const isChangeLogContentShow = ref(false)

const openLogs = (log: any) => {
  isChangeLogContentShow.value = true
  logDiffData.value = log
}

const columns = {
  username: t('originPolicy.username'),
  submitTime: t('originPolicy.submitTime'),
  action: t('originPolicy.action'),
  content: t('originPolicy.content'),
} as const

const emit = defineEmits(['close-log-records'])
</script>

<template>
  <VModal
    :open="props.isChangeLogShow"
    :title="t('originPolicy.log')"
    actions="right"
    size="large"
    @close="emit('close-log-records')"
  >
    <template #content>
      <VFlexTable
        v-if="props.objectLogData"
        class="change-log-table"
        :data="objectLogData"
        :columns="columns"
        rounded
      >
        <template #body>
          <TransitionGroup name="list" tag="div" class="flex-list-inner">
            <!--Table item-->
            <div v-for="log in props.objectLogData" :key="log" class="flex-table-item">
              <VFlexTableCell v-if="columns.groupName" :datath="columns.groupName">
                <span class="item-name dark-inverted">604</span>
              </VFlexTableCell>

              <VFlexTableCell
                class="flex-table-cell"
                :data-th="t('originPolicy.username')"
              >
                <span class="light-text">{{ log.username }}</span>
              </VFlexTableCell>

              <VFlexTableCell
                class="flex-table-cell"
                :data-th="t('originPolicy.submitTime')"
              >
                <span class="light-text">{{ log.submitTime }}</span>
              </VFlexTableCell>

              <VFlexTableCell class="flex-table-cell" :data-th="t('originPolicy.action')">
                <span class="light-text">{{ log.actionName }}</span>
              </VFlexTableCell>

              <VFlexTableCell
                class="flex-table-cell"
                :data-th="t('originPolicy.content')"
              >
                <span
                  class="light-text table-button"
                  @click="openLogs(log.diffData)"
                  @keydown="openLogs(log.diffData)"
                >
                  <i class="iconify" data-icon="feather:eye"></i>
                </span>
              </VFlexTableCell>
            </div>
          </TransitionGroup>
        </template>
      </VFlexTable>
    </template>
  </VModal>
  <VModal
    :open="isChangeLogContentShow"
    :title="t('originPolicy.diffData')"
    size="medium"
    actions="right"
    @close="isChangeLogContentShow = false"
  >
    <template #content>
      <pre class="change-log-content">{{ logDiffData }}</pre>
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
.change-log-table {
  padding-top: 20px;
}
.change-log-content {
  margin-top: 20px;
}
</style>
