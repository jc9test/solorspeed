<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { VAvatarProps } from '/@src/components/base/avatar/VAvatar.vue'
import * as listData from '/@src/data/layouts/flex-list-v2'
const { t } = useI18n()

export interface ProjectData {
  id: number
  name: string
  customer: string
  duration: string
  picture: string
  industry: string
  status: string
  team: VAvatarProps[]
}

const projects = listData.projects as ProjectData[]

const props = withDefaults(
  defineProps<{
    activeTab?: 'active' | 'closed'
  }>(),
  {
    activeTab: 'active',
  }
)

const isDeleteModalShow = ref(false)
const isChangeLogContentShow = ref(false)
const logDiffData = ref()
const itemDeleted = ref({})

const getChangeLog = (log: any) => {
  isChangeLogContentShow.value = true
  logDiffData.value = log
}

const deleteIconClicked = (log: any) => {
  isDeleteModalShow.value = true
  logDiffData.value = log
}
const page = ref(42)
const filters = ref('')
const tab = ref(props.activeTab)

const columns = {
  groupName: 'Group Name',
  policyName: 'Policy Name',
  origins: 'Origins',
  loadBalancerMethod: 'Load Balancer Method',
  healthCheckMode: 'Health Check Mode',
  status: 'Status',
  log: 'Log',
  action: {
    label: 'Actions',
    align: 'end',
  },
} as const

const filteredData = computed(() => {
  if (!filters.value) {
    return projects
  } else {
    const filterRe = new RegExp(filters.value, 'i')

    return projects.filter((item) => {
      return (
        item.name.match(filterRe) ||
        item.customer.match(filterRe) ||
        item.industry.match(filterRe) ||
        item.status.match(filterRe) ||
        item.duration.match(filterRe)
      )
    })
  }
})
</script>

<template>
  <div>
    <div class="flex-list-wrapper flex-list-v2">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        v-if="tab === 'active' && filteredData.length === 0"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-4.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <!--Active Tab-->
      <VFlexTable
        v-if="filteredData.length"
        :data="filteredData"
        :columns="columns"
        rounded
      >
        <template #body>
          <TransitionGroup name="list" tag="div" class="flex-list-inner">
            <!--Table item-->
            <div v-for="item in filteredData" :key="item.id" class="flex-table-item">
              <VFlexTableCell>
                <span class="item-name dark-inverted">604</span>
              </VFlexTableCell>
              <VFlexTableCell>
                <span class="light-text">angussss123</span>
              </VFlexTableCell>
              <VFlexTableCell>
                <span class="success-text">8.8.8.8,w:1</span>
              </VFlexTableCell>
              <VFlexTableCell>
                <span class="light-text">ipHash</span>
              </VFlexTableCell>
              <VFlexTableCell>
                <span class="light-text">tcp</span>
              </VFlexTableCell>
              <VFlexTableCell>
                <span class="light-text">in progress</span>
              </VFlexTableCell>

              <!-- eye icon for getting change log -->
              <VFlexTableCell>
                <span
                  class="light-text table-button"
                  @click="getChangeLog"
                  @keydown="getChangeLog"
                >
                  <i class="iconify" data-icon="feather:eye"></i>
                </span>
              </VFlexTableCell>

              <!-- vertical dots icon for more options -->
              <VFlexTableCell :column="{ align: 'end' }">
                <VDropdown class="end-action" icon="feather:more-vertical" spaced right>
                  <template #content>
                    <a href="#" role="menuitem" class="dropdown-item is-media">
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-pencil"></i>
                      </div>
                      <div class="meta">
                        <span>Edit</span>
                        <!-- <EditFormOriginPolicy
                    :item-data="item"
                    :is-edit-form-show="isEditFormShow"
                    @getData="getTableData"
                    @startRecall="startRecall"
                  /> -->
                      </div>
                    </a>

                    <hr class="dropdown-divider" />

                    <a
                      role="menuitem"
                      href="#"
                      class="dropdown-item is-media"
                      @click="deleteIconClicked(item)"
                      @keydown="deleteIconClicked(item)"
                    >
                      <div class="icon">
                        <i aria-hidden="true" class="lnil lnil-trash"></i>
                      </div>
                      <div class="meta">
                        <span>{{ t('main.deleteText') }}</span>
                      </div>
                    </a>
                  </template>
                </VDropdown>
              </VFlexTableCell>
            </div>
          </TransitionGroup>
        </template>
      </VFlexTable>

      <!--Table Pagination-->
      <ListPagination
        v-if="filteredData.length > 5"
        v-model:current-page="page"
        :item-per-page="10"
        :total-items="873"
        :max-links-displayed="7"
        no-router
      />

      <VModal
        :open="isChangeLogContentShow"
        size="small"
        actions="center"
        @close="isChangeLogContentShow = false"
      >
        <template #content>
          <VPlaceholderSection
            title="Go Premium"
            subtitle="Unlock more features and business tools by going premium"
          />
        </template>
        <template #action>
          <VButton color="primary" raised>Confirm</VButton>
        </template>
      </VModal>
      <VModal
        :open="isDeleteModalShow"
        :title="itemDeleted ? `${t('main.removeText')} entry` : t('main.removeText')"
        size="small"
        actions="right"
        @close="isDeleteModalShow = false"
      >
        <template #content>
          <div>{{ t('main.delete_message') }}</div>
        </template>
        <template #action>
          <VButton color="primary" raised>
            {{ t('main.confirmText') }}
          </VButton>
        </template>
      </VModal>
    </div>
  </div>
</template>

<style lang="scss">
.table-button {
  transition: all 0.4s;
  cursor: pointer;
  &:hover {
    color: #06d6a0;
  }
}
</style>
