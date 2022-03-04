<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watch, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import numeral from 'numeral'
import store from '/@src/stores/index'
import EditDashboardFilterModal from '/@src/pages/dashboard/EditDashboardFilterModal.vue'

const { t } = useI18n()
const { dashboardQueryFilters, updateDashboardQueryFilters } = inject(
  'dashboardQueryFilters'
)
const currentItemNumber = ref(5)
const changeItemDropdown = ref()
const itemNumber = ref(5)

function changeItemNumber(num: number) {
  currentItemNumber.value = num
  itemNumber.value = num
  if (changeItemDropdown.value) {
    changeItemDropdown.value.close?.()
  }
}

function clearFilter(item) {
  updateDashboardQueryFilters('REMOVE_FILTER', item)
}

const isEditFilterShow = ref(false)
const selectedValue = ref()
const toggleEditFilterModal = (item) => {
  isEditFilterShow.value = !isEditFilterShow.value
  if (item) {
    selectedValue.value = JSON.parse(JSON.stringify(item))
  }
}
const updateFilter = (updatedFilter) => {
  selectedValue.value = updatedFilter
  toggleEditFilterModal()
}
</script>

<template>
  <h2 class="dark-inverted">{{ t('dashboard.overview') }}</h2>
  <DashboardQueryFilter />

  <V-Field grouped multiline>
    <V-Control v-for="filter in dashboardQueryFilters" :key="filter">
      <abbr :title="filter.chartFilterValue">
        <V-Tags addons>
          <V-Tag
            :label="filter.chartFilterLabel"
            color="primary"
            class="clickable"
            @click="toggleEditFilterModal(filter)"
          />
          <V-Tag remove @click="clearFilter(filter)" />
        </V-Tags>
      </abbr>
    </V-Control>
  </V-Field>

  <EditDashboardFilterModal
    v-if="selectedValue"
    :dashboard-query-filters="dashboardQueryFilters"
    :selected="selectedValue"
    :is-edit-filter-show="isEditFilterShow"
    @close="toggleEditFilterModal"
    @edit="updateFilter"
  ></EditDashboardFilterModal>

  <div class="dashboard-request">
    <div class="columns is-multiline charts">
      <div class="column column is-12">
        <V-Card radius="regular">
          <div class="cards-header">
            <div class="card-title">
              <!-- <p>Request</p> -->
              <h3 class="dark-inverted">{{ t('dashboard.requestSummary') }}</h3>
              <span class="light-text">{{ t('dashboard.requestTitleText') }}</span>
            </div>
          </div>

          <div class="selection">
            <V-Tabs
              class="tab"
              selected="all"
              :tabs="[
                { label: `${t('dashboard.all')}`, value: 'all' },
                { label: `${t('dashboard.referer')}`, value: 'referer' },
                { label: `${t('dashboard.domainNameText')}`, value: 'domain' },
                { label: `${t('dashboard.country')}`, value: 'country' },
                { label: `${t('dashboard.path')}`, value: 'path' },
                { label: `${t('dashboard.status_code')}`, value: 'statusCode' },
                {
                  label: `${t('dashboard.origin_status_code')}`,
                  value: 'originStatusCode',
                },
                { label: `${t('dashboard.http_method')}`, value: 'httpMethod' },
                { label: `${t('dashboard.user_agent')}`, value: 'userAgent' },
              ]"
            >
              <template #tab="{ activeValue }">
                <div v-if="activeValue === 'all'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="none"
                    chart-metric-group-by-terms=""
                    :has-filter="false"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'referer'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="req_headers.referer.keyword"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'host'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="req_headers.host.keyword"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'domain'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="server_name.keyword"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'country'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="country.keyword"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'path'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="uri.keyword"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'statusCode'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="status.keyword"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'originStatusCode'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="upstream_status.keyword"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'httpMethod'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="request_method.keyword"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'userAgent'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="req_headers.user-agent.keyword"
                    numeral-format="'0.0a'"
                  />
                </div>
              </template>
            </V-Tabs>
          </div>
        </V-Card>
      </div>

      <div class="column column is-12">
        <V-Card radius="regular">
          <div class="cards-header">
            <div class="card-title">
              <h3 class="dark-inverted">
                {{ t('dashboard.requestsByCountry') }}
              </h3>
            </div>
          </div>

          <div class="columns is-multiline cards country">
            <div class="country-left column column is-6">
              <div class="country-map">
                <CountryMap
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="country.keyword"
                />
              </div>
            </div>

            <div class="country-right column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  title=""
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="country.keyword"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>
          </div>
        </V-Card>
      </div>

      <!-- cards -->

      <div class="column column is-12 cards">
        <V-Card radius="regular">
          <div class="cards-header">
            <div class="card-title">
              <h3 class="dark-inverted">
                {{ t('dashboard.requestsBySource') }}
              </h3>
            </div>

            <V-Dropdown
              ref="changeItemDropdown"
              :title="`${currentItemNumber.toFixed()} ${t('dashboard.items')}`"
              right
              down
            >
              <template #content>
                <a class="dropdown-item" @click="changeItemNumber(3)" @keypress="bar">
                  3 {{ t('dashboard.items') }}
                </a>
                <a class="dropdown-item" @click="changeItemNumber(5)" @keypress="bar">
                  5 {{ t('dashboard.items') }}
                </a>
                <a class="dropdown-item" @click="changeItemNumber(10)" @keypress="bar">
                  10 {{ t('dashboard.items') }}
                </a>
              </template>
            </V-Dropdown>
          </div>

          <div class="columns is-multiline cards">
            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.ip')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="cus_realy_addr.keyword"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.domainNameText')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="server_name.keyword"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.path')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="uri.keyword"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.user_agent')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="req_headers.user-agent.keyword"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.referer')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="req_headers.referer.keyword"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>
          </div>
        </V-Card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  font-family: $font-alt;
  color: $dark-text;
  font-weight: 600;
  font-size: 1.4rem;
  margin: 25px 0 10px 0;
}

.tags {
  .is-primary {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

//tabs

.dashboard-request {
  .selection {
    // display: flex;
    margin: 30px 0 15px 0;

    .tab-wrapper {
      .tabs-inner {
        .tabs {
          background-color: transparent;

          ul {
            border: none;
            flex-wrap: wrap;
          }
        }
      }
    }

    .dropdown.is-right {
      .dropdown-menu {
        right: 0;
      }
    }

    .dropdown {
      .dropdown-trigger {
        span {
          .dropdown.is-dots {
            .is-trigger {
              svg {
                height: 27px;
              }
            }
          }
        }
      }
    }
  }

  .tabs {
    background-color: transparent;
    max-width: 200px;

    ul {
      flex-wrap: wrap;
    }
  }
}

.tabs ul {
  flex-wrap: wrap;
}

.cards-header {
  margin-bottom: 20px;

  .card-title {
    h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: $dark-text;
    }
  }
}
// =================
//  country
// =================

.country-map {
  position: relative;
}

.country-right {
  // margin-left: 40px;

  .country-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .country-item-right {
      display: flex;
      align-items: center;
      width: 50%;

      span {
        margin-right: 20px;
      }
    }
  }
}

.clickable {
  cursor: pointer;
}
</style>
