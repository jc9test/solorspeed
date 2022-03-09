<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['close', 'add'])
const props = defineProps({
  isModalShow: {
    type: Boolean,
    default: false,
  },
  firewallList: {
    type: Array,
    default: () => [],
  },
})

const oriFirewallList = ref([])
const firewallList = ref([])
const searchInput = ref('')
const viewContent = ref('')
const isModalShow = computed(() => {
  return props.isModalShow
})

const toggleStatus = (item) => {
  item.isEnabled = !item.isEnabled
  let temp = oriFirewallList.value.find((e) => e.value === item.value)
  temp.isEnabled = !temp.isEnabled
}
const getAddedList = () => {
  return oriFirewallList.value.filter((e) => e.isEnabled == true)
}

const onClickPreviewModal = (item: object) => {
  if (item) {
    viewContent.value = item
  } else {
    viewContent.value = ''
  }
}

watch(searchInput, () => {
  if (searchInput.value != '') {
    let temp = oriFirewallList.value.filter((e) => e.value.includes(searchInput.value))
    firewallList.value = JSON.parse(JSON.stringify(temp))
  } else {
    firewallList.value = JSON.parse(JSON.stringify(oriFirewallList.value))
  }
})
watch(isModalShow, () => {
  if (isModalShow.value == true) {
    searchInput.value = ''
    let list = []

    props.firewallList.filter((val) => {
      list.push({
        ...val,
        isEnabled: false,
      })
    })

    firewallList.value = list
    oriFirewallList.value = JSON.parse(JSON.stringify(firewallList.value))
  }
})
</script>

<template>
  <slot></slot>
  <VModal
    :title="`${t('service.add')} ${t('waf.rule')}`"
    :open="isModalShow"
    size="medium"
    actions="right"
    noscroll
    @close="emit('close')"
  >
    <template #content>
      <form class="h-400">
        <div class="essential">
          <VControl icon="feather:search">
            <input
              v-model="searchInput"
              class="input custom-text-filter"
              style="margin-bottom: 20px"
              :placeholder="`${t('filter.searchText')} ${t('waf.ruleName')}`"
              @keypress.enter.prevent
            />
          </VControl>
          <div class="flex-table">
            <div class="flex-table-header table-col">
              <span class="col-view">{{ t('waf.content') }}</span>
              <span class="col-rule">{{ t('waf.rule') }}</span>
              <span class="col-action">{{ t('waf.action') }}</span>
              <span class="col-status">{{ t('waf.status') }}</span>
            </div>
            <div
              v-for="(item, index) in firewallList"
              :key="item + index"
              class="flex-list-inner"
            >
              <div class="flex-table-item table-col">
                <div class="flex-table-cell col-view">
                  <VIconButton
                    icon="feather:eye"
                    @click="onClickPreviewModal(item)"
                  ></VIconButton>
                </div>
                <div class="flex-table-cell col-rule" data-th="Policy">
                  <span class="light-text">{{ item.label }}</span>
                </div>
                <div class="flex-table-cell col-action" data-th="Action">
                  <span class="light-text">{{ item.description.action }}</span>
                </div>
                <div class="flex-table-cell col-status" data-th="Status">
                  <VIconButton
                    v-if="!item.isEnabled"
                    circle
                    icon="fa:plus"
                    @click="toggleStatus(item)"
                  />
                  <VIconButton
                    v-else
                    :outlined="true"
                    color="primary"
                    circle
                    icon="fa:check"
                    class="checked"
                    @click="toggleStatus(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #action>
      <VButton color="primary" raised @click="emit('add', getAddedList())">
        {{ t('main.saveText') }}
      </VButton>
    </template>
  </VModal>
  <VModal
    :open="viewContent != ''"
    :title="viewContent.value || ''"
    size="medium"
    actions="right"
    @close="onClickPreviewModal"
  >
    <template #content>
      <pre>{{ viewContent.description }}</pre>
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
// .is-dark pre {
//   background: lighten($dark-sidebar, 10%);
//   color: $white;
//   border-radius: 5px;
// }
// .checked:deep(.iconify) {
//   color: #fff !important;
// }
// .modal-form {
//   height: 400px;
//   padding: 0 !important;
// }
// .essential {
//   padding-bottom: 20px;
// }
// .table-col {
//   .col-view,
//   .col-status {
//     flex: 0.5;
//     display: flex !important;
//     justify-content: center;
//   }
//   .col-rule,
//   .col-action {
//     flex: 1;
//   }
//   .col-status {
//     display: flex !important;
//     justify-content: center;
//   }
//   .button {
//     margin-right: 0 !important;
//   }
// }
</style>
