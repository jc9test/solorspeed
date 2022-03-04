<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formInputs, appliedSelectedColumn } from '../data/column_selector_data'
import FormBuilder from '/@src/components/general/FormBuilder.vue'
import store from '/@src/stores/index'

const { t } = useI18n()

const isSelectColumnOpen = ref(false)

const adjustColumn = () => {
  store.commit('SET_HTML_COLUMN_SELECTION', appliedSelectedColumn.value)
  isSelectColumnOpen.value = false
}

const changeSelectedColumn = (e: any) => {
  appliedSelectedColumn.value = e
}
</script>

<template>
  <div class="filter-btn">
    <V-IconButton
      color="primary"
      style="color: #fff"
      class="filter-icon"
      icon="feather:columns"
      @click="isSelectColumnOpen = true"
    />
  </div>

  <VModal
    :title="t('eventLog.select_column')"
    :open="isSelectColumnOpen"
    actions="right"
    @close="isSelectColumnOpen = false"
  >
    <template #content>
      <div class="checkboxes">
        <FormBuilder
          :no-labels="true"
          :form-inputs="formInputs"
          @check-box-changed="changeSelectedColumn"
        />
      </div>
    </template>

    <template #action>
      <VButton color="primary" raised @click="adjustColumn">{{
        t('main.saveText')
      }}</VButton>
    </template>
  </VModal>
</template>

<style lang="scss" scoped>
.checkboxes {
  display: flex;
  flex-direction: column;
}

.filter-icon {
}
</style>
