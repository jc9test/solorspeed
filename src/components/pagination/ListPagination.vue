<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  itemPerPage: {
    type: Number,
    required: true,
    default: 10,
  },
  totalItems: {
    type: Number,
    required: true,
    default: 100,
  },
  maxItem: {
    type: Number,
    // required: true,
    default: 10000,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  maxLinksDisplayed: {
    type: Number,
    default: 5,
  },
  itemStartFrom: {
    type: Number,
    default: 1,
  },
})

const lastPage = computed(() => Math.ceil(props.maxItem / props.itemPerPage) || 1)

const totalPageDisplayed = computed(() =>
  lastPage.value > props.maxLinksDisplayed - 2
    ? props.maxLinksDisplayed - 2
    : lastPage.value
)

const pages = computed(() => {
  const _pages = []
  let firstButton = props.currentPage - Math.floor(totalPageDisplayed.value / 2)
  let lastButton =
    firstButton + (totalPageDisplayed.value - Math.ceil(totalPageDisplayed.value % 2))

  if (firstButton < 1) {
    firstButton = 1
    lastButton = firstButton + (totalPageDisplayed.value - 1)
  }

  if (lastButton > lastPage.value) {
    lastButton = lastPage.value
    firstButton = lastButton - (totalPageDisplayed.value - 1)
  }

  for (let page = firstButton; page <= lastButton; page += 1) {
    _pages.push(page)
  }

  return _pages
})

const showFirstLink = computed(() => pages.value[0] > 1)
const showLastLink = computed(() => pages.value[pages.value.length - 1] < lastPage.value)

const itemNumber = ref(10)
const changeItemNumberDropdown = ref()
const currentPage = ref(props.currentPage)
const itemEndTo = computed(() => {
  return currentPage.value === lastPage.value && props.totalItems === props.maxItem
    ? props.totalItems
    : props.itemStartFrom + itemNumber.value - 1
})

function changeItemHandler(value) {
  itemNumber.value = value

  if (props.itemStartFrom + itemNumber.value > props.maxItem) {
    currentPage.value = 1
    changeItemNumberDropdown.value.close?.()
    emit('update:currentPage', 1)
    emit('update:itemPerPage', value)
    emit('getData')
  } else if (itemNumber.value) {
    changeItemNumberDropdown.value.close?.()
    emit('update:itemPerPage', value)
    emit('getData')
  }
}

function changePageHandler(page) {
  currentPage.value = page
  emit('update:currentPage', page)
  emit('getData')
}

function changePageToPrev() {
  if (currentPage.value > 1) {
    currentPage.value = currentPage.value - 1
    emit('update:currentPage', currentPage.value)
    emit('getData')
  }
}

function changePageToNext() {
  if (currentPage.value < lastPage.value) {
    currentPage.value = currentPage.value + 1
    emit('update:currentPage', currentPage.value)
    emit('getData')
  }
}

const pageFromParent = computed(() => {
  return props.currentPage
})
watch(pageFromParent, () => {
  currentPage.value = pageFromParent.value
})

const emit = defineEmits(['update:currentPage', 'update:itemPerPage', 'getData'])
</script>

<template>
  <div class="list-bottom">
    <div class="left">
      <label>
        <span class="light-text">
          <!-- showing {{ itemStartFrom }} to {{ itemEndTo }} of
          {{ totalItems }} entries -->
          {{ t('main.showing') }} {{ itemStartFrom }} {{ t('main.to') }} {{ itemEndTo }}
          {{ t('main.of') }} {{ totalItems }}
          {{ t('main.entries') }}
        </span>
      </label>

      <label>
        <V-Dropdown ref="changeItemNumberDropdown" :title="itemNumber.toString()" left up>
          <template #content>
            <a
              class="dropdown-item"
              @click="changeItemHandler(10)"
              @keydown="changeItemHandler(10)"
            >
              10
            </a>
            <a
              class="dropdown-item"
              @click="changeItemHandler(20)"
              @keydown="changeItemHandler(20)"
            >
              20</a
            >
            <a
              class="dropdown-item"
              @click="changeItemHandler(30)"
              @keydown="changeItemHandler(30)"
            >
              30
            </a>
            <a
              class="dropdown-item"
              @click="changeItemHandler(40)"
              @keydown="changeItemHandler(40)"
            >
              40
            </a>
          </template>
        </V-Dropdown>
        <span class="light-text">{{ t('main.entries') }} {{ t('main.per_page') }}</span>
      </label>
    </div>

    <div class="right">
      <nav
        role="navigation"
        class="flex-pagination pagination is-rounded"
        aria-label="pagination"
        data-filter-hide
      >
        <ul class="pagination-list">
          <div
            v-if="lastPage > 1"
            class="pagination-previous has-chevron"
            @click="changePageToPrev"
            @keydown="changePageToPrev"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-left"></i>
          </div>

          <li v-if="showFirstLink">
            <div
              class="pagination-link"
              aria-label="Goto page 1"
              @click="changePageHandler(1)"
              @keydown="changePageHandler(1)"
            >
              1
            </div>
          </li>

          <li v-if="pages[0] > 2">
            <span class="pagination-ellipsis">…</span>
          </li>

          <li v-for="page in pages" :key="page">
            <div
              class="pagination-link"
              :aria-label="`Goto page ${page}`"
              :aria-current="currentPage === page ? 'page' : ''"
              :class="[currentPage === page && 'is-current']"
              @click="changePageHandler(page)"
              @keydown="changePageHandler(page)"
            >
              {{ page }}
            </div>
          </li>

          <li v-if="pages[pages.length - 1] < lastPage - 1">
            <span class="pagination-ellipsis">…</span>
          </li>

          <li v-if="showLastLink">
            <div
              class="pagination-link"
              :aria-label="`Goto page ${lastPage}`"
              @click="changePageHandler(lastPage)"
              @keydown="changePageHandler(lastPage)"
            >
              {{ lastPage }}
            </div>
          </li>

          <div
            v-if="lastPage > 1"
            class="pagination-next has-chevron"
            @click="changePageToNext"
            @keydown="changePageToNext"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:chevron-right"></i>
          </div>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-previous,
.pagination-next {
  order: 0;
  cursor: pointer;
}

.pagination-link {
  cursor: pointer;
}

.left {
  display: flex;
  align-items: center;

  label {
    display: flex;
    align-items: center;
    margin-right: 10px;

    span {
      margin-left: 10px;
    }
  }
}

.column {
  padding-left: 0;
}

@media only screen and (max-width: 1050px) {
  .list-bottom {
    flex-direction: column;
    margin-top: 20px;
    gap: 5px;
  }
}

@media only screen and (max-width: 480px) {
  .left {
    flex-direction: column;
  }
}
</style>
