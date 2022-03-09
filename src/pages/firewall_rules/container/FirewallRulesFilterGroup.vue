<script setup lang="ts">
import { computed } from 'vue'
import { formInputs } from '../data/filter_selector_data'

const props = defineProps({
  filters: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:filters'])

const clearFilter = (filter) => {
  const input = formInputs.find((x) => x.key === filter.key)
  input.ref.value = ''
  emit(
    'update:filters',
    props.filters.filter((x) => x.key !== filter.key)
  )
}

const filters = computed(() => {
  return props.filters.map((x) => {
    const { key, type, value } = x
    const input = formInputs.find((y) => y.key === key)!

    let tagValue

    switch (type) {
      case 'select':
        tagValue = input.options.find((y) => value === y.value)?.label
        break
      default:
        tagValue = value
        break
    }

    const tag = `${input.title}: ${tagValue}`
    return { key, value, type, tag }
  })
})
</script>

<template>
  <V-Field grouped multiline>
    <V-Control v-for="filter in filters" :key="filter">
      <abbr :title="filter.tag">
        <V-Tags addons>
          <V-Tag :label="filter.tag" color="primary" class="clickable" />
          <V-Tag remove @click="clearFilter(filter)" />
        </V-Tags>
      </abbr>
    </V-Control>
  </V-Field>
</template>

<style lang="scss">
.tags {
  .is-primary {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
