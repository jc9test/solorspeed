<script setup lang="ts">
//form v-model
const props = defineProps({
  title: {
    type: String,
    default: () => {},
  },
  desc: {
    type: String,
    default: () => {},
  },
})
</script>

<template>
  <div>
    <span class="light-text">
      {{ title }}
    </span>
    <div class="meta" style="margin: 0.5rem 0 2.5rem 0">
      <span class="dark-inverted" style="font-weight: bold">{{ props.desc }}. </span>
    </div>
  </div>
</template>
