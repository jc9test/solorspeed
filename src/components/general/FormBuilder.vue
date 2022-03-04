<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { initialiseVisibility } from '/@src/utils/form-builder'
const { t } = useI18n()
const props = defineProps({
  formInputs: {
    type: Array,
    default: () => [],
  },
  noLabels: {
    type: Boolean,
    default: () => false,
  },
  reRender: {
    type: Boolean,
    default: () => false,
  },
  performValidation: {
    type: Boolean,
    default: () => false,
  },
})

const emit = defineEmits([
  'central-changed',
  'check-box-changed',
  'file-changed',
  'validation-performed',
])

const valueChanged = (value: any, input: any) => {
  console.log({ action: 'central change listener triggered' })

  let returnValue = value instanceof Event ? value.target.value : value

  emit('central-changed', { value, input })

  if (input.type === 'file') {
    handleFileChange(returnValue, input)
  } else {
    renderedInputs.value = props.formInputs.filter((observer) => {
      return conditionalRendering(observer, input, returnValue)
    })
  }
}

const multiselectChanged = (value: any, input: any) => {
  valueChanged(value, input)
}

const checkBoxChanged = (e: any) => {
  emit('check-box-changed', e)
}

const handleFileChange = (value: any, input: any) => {
  console.log({ action: 'file change listener triggered' })
  emit('file-changed', value, input)
  input.value = value.target.files[0]
}

const conditionalRendering = (observer: any, input: any, value: any) => {
  const condition = observer.conditional_visibility
  if (condition && condition.observing === input.key) {
    const visibility = value === condition.value
    observer.visibility = visibility
    return visibility
  } else {
    return observer.visibility
  }
}

const renderedInputs = ref(props.formInputs)

onMounted(() => {
  renderedInputs.value = initialiseVisibility({
    formInputs: props.formInputs,
    renderedInputs: renderedInputs.value,
  })
})

watch(
  () => props.reRender,
  () => {
    if (props.reRender) {
      console.log(props.formInputs)
      renderedInputs.value = initialiseVisibility({
        formInputs: props.formInputs,
        renderedInputs: renderedInputs.value,
      })
    }
  }
)
watch(
  () => props.performValidation,
  () => {
    emit('validation-performed')
  }
)
</script>

<template>
  <form class="modal-form">
    <div
      v-for="(input, index) in renderedInputs"
      :key="input.key"
      class="flex-table-item"
    >
      <slot :sequence="index" :input="input"></slot>
      <VField @change="(e: any) => valueChanged(e, input)">
        <h4 v-if="input.type === 'onlyLabels'">{{ t(input.label) }}</h4>
        <label v-if="!props.noLabels && input.type !== 'onlyLabels'"
          >{{ t(input.label) }}
          <span v-if="input.required">*</span>
          <span
            v-if="input.questionTooltip"
            v-tooltip.right="`${input.tooltip}`"
            class="ml-2"
          >
            <i class="icon-tooltip fas fa-question-circle"></i>
          </span>
        </label>

        <div v-if="input.type === 'string'">
          <input
            v-model="input.ref"
            :placeholder="t(input.placeholder || '')"
            type="text"
            class="input"
          />
        </div>

        <div v-if="input.type === 'textarea'">
          <VControl :has-error="input.error">
            <textarea
              v-model="input.ref"
              class="textarea"
              rows="4"
              :placeholder="t(input.placeholder || '')"
            ></textarea>
          </VControl>
        </div>

        <div v-if="input.type === 'number'">
          <VControl :has-error="input.error">
            <input
              v-model="input.ref"
              :placeholder="t(input.placeholder || '')"
              type="number"
              class="input"
            />
          </VControl>
        </div>

        <div v-else-if="input.type === 'date'">
          <v-date-picker v-model="input.ref" is-range color="green" trim-weeks>
            <template #default="{ inputValue, inputEvents }">
              <div class="columns v-calendar-combo">
                <div class="column is-6">
                  <VControl icon="feather:calendar">
                    <input
                      :placeholder="t('filter.start_date')"
                      :value="inputValue.start"
                      class="input form-datepicker"
                      v-on="inputEvents.start"
                    />
                  </VControl>
                </div>
                <div class="column is-6">
                  <VControl icon="feather:calendar">
                    <input
                      :placeholder="t('filter.end_date')"
                      :value="inputValue.end"
                      class="input form-datepicker"
                      v-on="inputEvents.end"
                    />
                  </VControl>
                </div>
              </div>
            </template>
          </v-date-picker>
        </div>

        <div v-else-if="input.type === 'radio'">
          <VControl class="radio-button-container">
            <div v-for="radio in input.radioOptions" :key="radio.label">
              <VRadio
                v-model="input.ref"
                :value="radio.value"
                :label="radio.label"
                :name="input.key"
                color="primary"
              />
            </div>
          </VControl>
        </div>

        <div v-else-if="input.type === 'checkbox'">
          <VCheckbox
            v-model="input.ref"
            :value="input.value"
            :label="t(input.label)"
            color="primary"
            @toggled="checkBoxChanged"
          />
        </div>

        <div v-else-if="input.type === 'file' && input.mode !== 'single'">
          <VControl>
            <div class="file">
              <label class="file-label">
                <input
                  :ref="input.key"
                  class="file-input"
                  type="file"
                  :name="input.key"
                  :accept="input.fileFormats.map((ff) => ff.format).join(', ')"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                  </span>
                  <span class="file-label">
                    {{ input.fileFormats.map((ff) => ff.label).join(', ') }}
                  </span>
                </span>
              </label>
            </div>
          </VControl>
          <span>{{ input?.value?.name }}</span>
        </div>

        <div v-else-if="input.type === 'file' && input.mode === 'single'">
          <div class="control max-width">
            <VControl :has-error="input.error">
              <div class="file has-name">
                <label class="file-label">
                  <input
                    class="file-input max-width"
                    type="file"
                    :name="input.key"
                    accept=".html"
                  />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-cloud-upload-alt"></i>
                    </span>
                    <span class="file-label"> Choose a file… </span>
                  </span>
                  <span class="file-name light-text">
                    {{
                      input?.value ||
                      input?.value?.name ||
                      `${input.fileFormats[0].label.toUpperCase()} File only`
                    }}
                  </span>
                </label>
              </div>
            </VControl>
          </div>
          <span v-if="input.error" class="missing-alert">
            {{ t('html.fileError') }}
          </span>
        </div>

        <div v-else-if="input.type === 'switch'">
          <VControl>
            <VSwitchSegment
              v-model="input.ref"
              style="justify-content: flex-start"
              label-true="On"
              label-false="Off"
              color="primary"
            />
          </VControl>
        </div>

        <div v-else-if="input.type === 'select'">
          <VControl>
            <div class="select">
              <select v-model="input.ref" :disabled="input.disabled">
                <option
                  v-for="option in input.options"
                  :key="option.key"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </VControl>
        </div>

        <div v-else-if="input.type === 'multiselect'">
          <VControl>
            <Multiselect
              v-model="input.ref"
              :placeholder="
                t(input.placeholder || '') || input.ref || t('filter.select_group')
              "
              :disabled="input.disabled"
              :options="input.options"
              :mode="input.mode"
              :can-deselect="false"
              :can-clear="false"
              @change="(value: any) => multiselectChanged(value, input)"
            />
          </VControl>
        </div>
        <span v-if="input.error" class="missing-alert">
          {{ t(input.errorMsg) }}
        </span>
      </VField>
    </div>
    <slot name="lastInput"></slot>
  </form>
</template>

<style lang="scss">
.radio-button-container {
  display: flex;
  flex-wrap: wrap;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-card-body {
  padding-top: 0px !important;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  h4 {
    margin-top: 15px;
    margin-bottom: 15px;
  }
}

.flex-table-item {
  &:first-of-type {
    h4 {
      margin-top: 0px;
    }
  }
}

.radio {
  padding-left: 0px;
}
.missing-alert {
  font-size: 0.75rem;
  color: $danger !important;
  padding-left: 10px;
}
</style>
