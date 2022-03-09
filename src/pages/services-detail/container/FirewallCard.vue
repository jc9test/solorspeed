<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Draggable from 'vuedraggable'

import { getEsData } from '/@src/api/esdata'
import { getFormOptions } from '/@src/api/formOptions'
import store from '/@src/stores/index'
import FirewallRulesAddFormModal from '/@src/pages/services-detail/container/FirewallRulesAddFormModal.vue'
import FirewallRulesForm from '/@src/pages/firewall_rules/container/FirewallRulesForm.vue'
import {
  formReferences,
  formInputs,
  refUpdater,
  renderSubmitValues,
  renderValues,
  inputAttributeUpdater,
} from '/@src/pages/firewall_rules/data/edit_firewall_rule_data'

const { t } = useI18n()
const emit = defineEmits(['clickDropdown', 'submitData'])

const props = defineProps({
  overviewData: {
    type: Object,
    default: () => {},
  },
  firewallDropdown: {
    type: Boolean,
    default: () => false,
  },
})

const isLoading = ref(false)
const isShow = ref(false)
const tableData = ref([])
const viewContent = ref('')
const firewallRulesList = ref([])
const unUsedFirewallRulesList = ref([])
const editRowShowMore = ref(false)
const addFirewallModal = ref(false)
const firewallTableList = ref([])
const firewallFormData = ref({
  usedWafRules: { value: [], error: false },
})
const overviewData = computed(() => {
  return props.overviewData
})
const firewallDropdown = computed(() => {
  return props.firewallDropdown
})

// Update and Get Detail
const updateFirewallFormData = async () => {
  let tempList = []
  let usedWafRules = overviewData.value?.usedWafRules
  let overviewFirewallRulesValue = usedWafRules?.map((val) => val.value) ?? []

  await getFormOptions(`wafrules?groupName=${store.state.queryGroupName}`).then((res) => {
    let fullFirewallList = res.data.options
    firewallRulesList.value = fullFirewallList

    usedWafRules.map((val) => {
      fullFirewallList.filter((list) => {
        if (overviewFirewallRulesValue.includes(list.value) && list.value == val.value) {
          tempList.push({
            ...list,
            isEnabled: val.isEnabled,
          })

          // ! Remove Firewall Rules value, prevent duplicates
          // ? Firewall Rules value, is it can be the same ?
          let index = overviewFirewallRulesValue.indexOf(list.value)
          if (index !== -1) {
            overviewFirewallRulesValue.splice(index, 1)
          }
        }
      })
    })

    firewallFormData.value.usedWafRules.value = tempList
    refreshFirewallTableList()
  })
}
const getUnusedFirewallRules = () => {
  let tempList = []
  let fullFirewallList = firewallRulesList.value
  let overviewFirewallRulesValue =
    overviewData.value?.usedWafRules?.map((val) => val.value) ?? []

  fullFirewallList.filter((list) => {
    if (!overviewFirewallRulesValue.includes(list.value)) {
      tempList.push(list)
    }
  })
  unUsedFirewallRulesList.value = tempList
}

const getFirewallData = (ruleName) => {
  var firewallOptions = {
    isFuzzySearch: false,
    esIndex: 'rcm-wafrules',
    from: 0,
    size: 1,
    sort: [],
    filters: [{ key: 'ruleName', type: 'string', value: ruleName }],
    searchView: '',
  }

  getEsData(firewallOptions)
    .then((res) => {
      tableData.value = res.data.mapData[0]
      console.log({ 'getFirewallData - success': tableData.value })
    })
    .catch((err) => {
      tableData.value = []
      console.log({ 'getFirewallData - error': err })
    })
}

// OnClick Action
const onClickAddFirewallModal = () => {
  addFirewallModal.value = !addFirewallModal.value
}
const onClickEditModal = (item: object) => {
  isShow.value = !isShow.value
  if (item) {
    getFirewallData(item.value)
    console.log({ FirewallCard: item })
  }
}
const onClickPreviewModal = (item: object) => {
  if (item) {
    viewContent.value = item
  } else {
    viewContent.value = ''
  }
}
const onClickFirewallListShowMore = () => {
  editRowShowMore.value = !editRowShowMore.value
  refreshFirewallTableList()
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showFormRules = (value: boolean, data = null) => {
  isShow.value = value
  // if (data) {
  //   firewallRulesData.value = data
  // }
}

const refreshFirewallTableList = () => {
  let tempList = []
  let firewallList = firewallFormData.value.usedWafRules.value

  firewallList.filter((item) => {
    if (!editRowShowMore.value && tempList.length >= 10) {
      return
    } else {
      let exists = tempList.find((val) => val.value == item.value)
      if (!exists) {
        tempList.push(item)
      }
    }
  })

  firewallTableList.value = tempList
}
const sortFirewallTableList = () => {
  let tempList = firewallTableList.value
  let firewallList = firewallFormData.value.usedWafRules.value

  firewallList.filter((item) => {
    let exists = tempList.find((val) => val.value == item.value)
    if (!exists) {
      tempList.push(item)
    }
  })

  firewallFormData.value.usedWafRules.value = tempList
}

// Save and Submit
const updateFirewallRule = (item: object, action: String) => {
  let tempList = []
  let currentFirewallData = Object.values(
    { ...firewallFormData.value.usedWafRules.value } ?? []
  )

  if (action == 'update') {
    currentFirewallData.map((val) => {
      if (val.value == item.value) {
        tempList.push({
          ...val,
          isEnabled: !val.isEnabled,
        })
      } else {
        tempList.push({ ...val })
      }
    })
  } else if (action == 'delete') {
    tempList = currentFirewallData.filter((val) => val.value !== item.value)
  }

  firewallFormData.value.usedWafRules.value = tempList
  refreshFirewallTableList()
}
const submitNewFirewallRules = (addList) => {
  onClickAddFirewallModal()
  let tempList = []

  for (let rule of addList) {
    tempList.push(rule)
    // firewallFormData.value.usedWafRules.value.push(rule)
  }
  firewallFormData.value.usedWafRules.value = tempList.concat(
    firewallFormData.value.usedWafRules.value
  )

  refreshFirewallTableList()
}
const submitWAF = () => {
  isLoading.value = true
  let usedWafRules = []

  firewallFormData.value.usedWafRules.value.map((val) => {
    usedWafRules.push({
      value: val.value,
      isEnabled: val.isEnabled,
    })
  })

  const submit_data = {
    ...overviewData.value,
    usedWafRules: usedWafRules,
  }

  emit('submitData', submit_data)
  emit('clickDropdown')
  isLoading.value = false
}

// onMounted(async () => {
//   getFirewallData()
// })

watch(overviewData, () => {
  // Get existing firewall detail
  updateFirewallFormData()
})
watch(firewallRulesList, () => {
  // Get unused firewall detail
  getUnusedFirewallRules()
})
</script>

<template>
  <div class="tile-grid-item service-detail-card-body">
    <div class="tile-grid-item-inner" style="display: block">
      <div class="columns" style="display: flex">
        <div class="column meta is-2">
          <span
            class="dark-inverted"
            style="
              font-size: 16px;
              vertical-align: -webkit-baseline-middle;
              vertical-align: text-top;
            "
          >
            {{ t('service.waf_rules') }}
          </span>
        </div>
        <div class="vertical-divider" />
        <div class="horizontal-divider" />

        <!-- Display Value -->
        <div v-if="!firewallDropdown" class="column is-9">
          <div class="columns container">
            <div class="column meta is-12">
              <span class="dark-inverted" style="color: gray">
                {{ t('waf.appliedRule') }}
              </span>
              <div class="m-t-5" :class="firewallDropdown ? 'is-hidden' : ''">
                <div v-if="firewallFormData.usedWafRules.value.length > 0">
                  <template v-for="rule in firewallFormData.usedWafRules.value">
                    <VTag
                      v-if="rule.isEnabled == true"
                      :key="rule"
                      rounded
                      color="primary"
                      class="m-r-5"
                      style="margin-bottom: 0.25rem; margin-top: 0.25rem"
                      :label="rule.value"
                    />
                  </template>
                </div>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Edit Value -->
        <div v-else class="column is-9">
          <div class="columns container">
            <div class="column meta is-12">
              <div class="d-flex between">
                <div style="display: flex; align-items: center">
                  <span class="dark-inverted" style="color: gray">
                    {{ t('waf.appliedRule') }}
                  </span>
                  <FirewallRulesAddFormModal
                    v-if="firewallRulesList.length > 0"
                    :is-modal-show="addFirewallModal"
                    :firewall-list="unUsedFirewallRulesList"
                    @close="onClickAddFirewallModal"
                    @add="submitNewFirewallRules"
                  >
                    <VIconButton
                      :outlined="true"
                      color="primary"
                      circle
                      icon="feather:plus"
                      class="add-btn"
                      @click="onClickAddFirewallModal"
                    >
                    </VIconButton>
                  </FirewallRulesAddFormModal>
                </div>
              </div>
              <div class="flex-table" style="margin-top: 1rem">
                <div class="flex-table-header table-col">
                  <span class="col-edit small">{{ t('service.edit') }}</span>
                  <span class="col-view small">{{ t('waf.content') }}</span>
                  <span class="col-rule">{{ t('waf.rule') }}</span>
                  <span class="col-action">{{ t('waf.action') }}</span>
                  <span class="col-status">{{ t('waf.status') }}</span>
                  <span class="col-delete small">{{ t('main.deleteText') }}</span>
                </div>
                <transition-group name="list" tag="div">
                  <Draggable
                    v-if="firewallFormData.usedWafRules.value.length > 0"
                    v-model="firewallTableList"
                    item-key="label"
                    class="flex-list-inner"
                    @change="sortFirewallTableList"
                  >
                    <template #item="{ element }">
                      <div class="flex-table-item table-col">
                        <div class="flex-table-cell col-edit" data-th="View">
                          <VIconButton
                            icon="feather:settings"
                            @click="onClickEditModal(element)"
                          ></VIconButton>
                        </div>
                        <div class="flex-table-cell col-view">
                          <VIconButton
                            icon="feather:eye"
                            @click="onClickPreviewModal(element)"
                          ></VIconButton>
                        </div>
                        <div class="flex-table-cell col-rule" data-th="Policy">
                          <span class="dark-text">{{ element.value }}</span>
                        </div>
                        <div class="flex-table-cell col-action" data-th="Action">
                          <span class="dark-text">
                            {{ element?.description?.action ?? '' }}
                          </span>
                        </div>
                        <div class="flex-table-cell col-status" data-th="Status">
                          <VIconButton
                            v-if="
                              !firewallFormData.usedWafRules.value.find(
                                (e) => e.label == element.label
                              ).isEnabled
                            "
                            circle
                            icon="fa:plus"
                            @click="updateFirewallRule(element, 'update')"
                          />
                          <VIconButton
                            v-else
                            :outlined="true"
                            color="primary"
                            circle
                            icon="fa:check"
                            @click="updateFirewallRule(element, 'update')"
                          />
                        </div>
                        <div class="flex-table-cell col-delete">
                          <VIconButton
                            icon="feather:trash-2"
                            @click="updateFirewallRule(element, 'delete')"
                          >
                          </VIconButton>
                        </div>
                      </div>
                    </template>
                  </Draggable>
                  <div v-else class="flex-table-item">
                    <div class="flex-table-cell" style="justify-content: center">
                      <span style="color: grey">No Data</span>
                    </div>
                  </div>
                  <div
                    v-if="firewallFormData.usedWafRules.value.length > 10"
                    class="showbtn"
                  >
                    <VButton color="primary" @click="onClickFirewallListShowMore">
                      <div v-if="editRowShowMore">{{ t('service.show_less') }}</div>
                      <div v-else>{{ t('service.show_more') }}</div>
                    </VButton>
                  </div>
                </transition-group>
              </div>
            </div>
          </div>
          <div class="columns container">
            <div class="column meta is-12">
              <div class="right" style="float: right; margin-top: 2rem">
                <VButton @click="emit('clickDropdown')">
                  <div class="light-text">
                    {{ t('service.cancelText') }}
                  </div>
                </VButton>
                <VButton color="primary" @click="submitWAF()">
                  <div>{{ t('service.saveText') }}</div>
                </VButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-edit">
        <div
          class="is-trigger dropdown-trigger"
          style="display: flex; justify-content: space-evenly"
          @click="emit('clickDropdown')"
          @keypress="emit('clickDropdown')"
        >
          <VIcon icon="feather:settings" class="setting-btn" />
        </div>
      </div>
    </div>
  </div>

  <!-- <EditFormWaf
    :item-data="getWafData()"
    :is-edit-form-show="isShow"
    :btn-exist="true"
    @get-data="getWafRulesList('edit')"
    @close="onClickEditModal"
  /> -->
  <FirewallRulesForm
    :show-form-rules-modal="isShow"
    :form-inputs="formInputs"
    :firewall-rules-data="tableData"
    :ref-updater="refUpdater"
    :attribute-updater="inputAttributeUpdater"
    :render-values="renderValues"
    :render-submit-values="renderSubmitValues"
    :form-references="formReferences"
    action="edit"
    @show-form-rules="showFormRules"
    @get-data="getData"
  />

  <!-- <FirewallRulesForm
    :show-form-rules-modal="showFormRulesModal"
    :form-inputs="formInputs"
    :firewall-rules-data="firewallRulesData"
    :ref-updater="refUpdater"
    :attribute-updater="inputAttributeUpdater"
    :render-values="renderValues"
    :render-submit-values="renderSubmitValues"
    :form-references="formReferences"
    action="edit"
    @show-form-rules="showFormRules"
    @get-data="getData"
  /> -->

  <VModal
    :open="viewContent != ''"
    :title="viewContent.value || ''"
    size="medium"
    actions="right"
    noscroll
    @close="onClickPreviewModal"
  >
    <template #content>
      <pre>{{ viewContent.description }}</pre>
    </template>
  </VModal>
</template>
