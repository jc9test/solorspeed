<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watch, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import store from '/@src/stores/index'
import EditDashboardFilterModal from '/@src/pages/dashboard/EditDashboardFilterModal.vue'
import { DashboardQueryFiltersPayload } from '/@types/dashboard'

const { t } = useI18n()
const { dashboardQueryFilters, updateDashboardQueryFilters } = inject(
  'dashboardQueryFilters'
) as DashboardQueryFiltersPayload
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
  <h2 class="dark-inverted">{{ t('dashboard.data_usage') }}</h2>
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

  <div class="dashboard-data-transfer">
    <div class="columns is-multiline charts">
      <!-- summary -->

      <div class="column column is-12">
        <V-Card radius="regular">
          <div class="cards-header">
            <div class="card-title">
              <h3 class="dark-inverted">
                {{ t('dashboard.dataUsageSummary') }}
              </h3>
            </div>
          </div>

          <div class="selection">
            <V-Tabs
              class="tab"
              selected="all"
              :tabs="[
                { label: `${t('dashboard.all')}`, value: 'all' },
                {
                  label: `${t('dashboard.referer')}`,
                  value: 'referer',
                },
                {
                  label: `${t('dashboard.domainNameText')}`,
                  value: 'domain',
                },
                { label: `${t('dashboard.country')}`, value: 'country' },
                { label: `${t('dashboard.path')}`, value: 'path' },
                { label: `${t('dashboard.status_code')}`, value: 'statusCode' },
                { label: `${t('dashboard.user_agent')}`, value: 'userAgent' },
                {
                  label: `${t('dashboard.http_method')}`,
                  value: 'httpMethod',
                },
              ]"
            >
              <template #tab="{ activeValue }">
                <div v-if="activeValue === 'all'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="none"
                    chart-metric-group-by-terms=""
                    :has-filter="false"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'referer'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="req_headers.referer.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'domain'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="server_name.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'cacheStatus'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="upstream_cache_status.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'originStatusCode'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="upstream_status.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'country'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="country.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'host'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="req_headers.host.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'httpMethod'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="request_method.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'path'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="uri.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'contentType'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="req_headers.accept.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'statusCode'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="status.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>

                <div v-else-if="activeValue === 'userAgent'">
                  <LineChart
                    chart-metric="dataUsage"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="req_headers.user-agent.keyword"
                    numeral-format="'0.0b'"
                  />
                </div>
              </template>
            </V-Tabs>
          </div>
        </V-Card>
      </div>

      <!-- cards -->

      <div class="column column is-12 cards">
        <V-Card radius="regular" class="requestCards">
          <div class="cards-header">
            <div class="card-title">
              <h3 class="dark-inverted">
                {{ t('dashboard.dataUsageBySource') }}
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
                  chart-metric="dataUsage"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="cus_realy_addr.keyword"
                  numeral-format="'0.0b'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.domainNameText')"
                  chart-metric="dataUsage"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="server_name.keyword"
                  numeral-format="'0.0b'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.path')"
                  chart-metric="dataUsage"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="uri.keyword"
                  numeral-format="'0.0b'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.status_code')"
                  chart-metric="dataUsage"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="status.keyword"
                  numeral-format="'0.0b'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.country')"
                  chart-metric="dataUsage"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="country.keyword"
                  numeral-format="'0.0b'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.content_type')"
                  chart-metric="dataUsage"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="req_headers.accept.keyword"
                  numeral-format="'0.0b'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.user_agent')"
                  chart-metric="dataUsage"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="req_headers.user-agent.keyword"
                  numeral-format="'0.0b'"
                />
              </V-Card>
            </div>

            <!-- <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  
                  :item-number="itemNumber"
                  :title="t('dashboard.host')"
                  chart-metric="dataUsage"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="req_headers.host.keyword"
                  numeral-format="'0.0b'"
                />
              </V-Card>
            </div> -->
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

.cache-status-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-bottom: 30px;

  .header-item {
    min-width: 15%;
    display: flex;
    justify-content: space-around;

    &:last-child {
      .line {
        border-right: 1px solid $white;
      }
    }

    .line {
      float: left;
      width: 50px;
      height: 40px;
      // background: #c0c4cc;
      border-right: 1px solid #c0c4cc;
    }

    &:hover button {
      display: block;
    }

    &:hover .overview-header-detail-header {
      display: none;
    }

    button {
      margin: 10px 0 20px 0;
      display: none;
    }

    .item-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 60px;

      .title-with-dot {
        display: flex;
        align-items: center;

        .dot {
          height: 10px;
          width: 10px;
          min-width: 10px;
          border-radius: $radius-rounded;
          background: $primary;
          margin: 0 5px 0 0;
        }
      }

      span {
        font-weight: bold;
        font-size: 1.5rem;

        &:last-child {
          font-weight: 400;
          font-size: 1rem;
          border: 1px solid $primary;
          border-radius: 5px;
          padding: 0 8px;

          &:hover {
            background-color: $primary;
            color: $white;
          }
        }
      }

      .overview-header-detail {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
      }

      .overview-header-hover-button {
        position: absolute;
        display: flex;
      }

      .cache-status-header-detail {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .cache-status-detail-header {
          font-weight: bold;
          font-size: 1.5rem;
        }
      }
    }
  }
}

.is-dark {
  .cache-status-header {
    color: $white;

    .overview-header-hover-button {
      span {
        color: $dark-dark-text;
      }
    }
  }
}

//====================
// cache status
//====================

.cache-status-bars {
  display: flex;
  margin: 0 30px;

  .cache-status-bar {
    display: flex;
    flex-direction: column;
    height: 45px;
    flex-basis: 20%;
    text-align: center;

    span {
      color: $white;
    }

    &:first-child {
      flex-basis: 50%;
    }

    &:last-child {
      flex-basis: 30%;
    }
  }
}

// =================
//  summary
// =================

//tabs

.dashboard-data-transfer {
  .selection {
    // display: flex;
    margin: 30px 0 15px 0;

    .tab-wrapper {
      .tabs-inner {
        .tabs {
          background-color: transparent;

          ul {
            border: none;
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
  }
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
//  cards
// =================

.requestCards {
  .cards-header {
    display: flex;
    justify-content: space-between;
  }
}

.cards {
  .cards-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cards-item {
    .card-item-title {
      font-weight: 500;
      margin-bottom: 8px;
    }

    .card-detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      &:hover .progress {
        display: none;
      }

      // &:hover .hover-buttons {
      //   display: block;
      //   height: 50px;
      //   // margin: 0;
      // }

      &:hover .card-detail-item-num {
        display: none;
      }

      .card-detail-item-left {
        // margin: 0;
        min-width: 50%;
      }

      .card-detail-item-right {
        position: relative;
        display: flex;
        align-items: center;

        .progress {
          margin-bottom: 0;
          min-width: 125px;
        }

        .card-detail-item-num {
          margin-right: 10px;
        }

        .hover-filter-btn {
          margin: 0;
          display: block;
        }

        .hover-buttons {
          // display: flex;

          button {
            span {
              border: 1px solid $primary;
              border-radius: 5px;
              padding: 0 8px;
            }

            &:hover span {
              background-color: $primary;
              color: $white;
            }
          }
        }
      }
    }
  }
}

.hover-buttons {
  display: none;
}

.card-detail-item:hover .hover-buttons {
  display: block;
  display: flex;
}

@media only screen and (max-width: 1000px) {
  .overview-header,
  .cache-status-header {
    flex-direction: column;

    .header-item {
      margin: 5px 0;
      border-bottom: 1px solid $lighter-grey;
      width: 100%;
      justify-content: center;

      span {
        margin-bottom: 5px;
      }

      &::after {
        content: '';
        border-left: none;
      }

      .line {
        display: none;
      }
    }
  }

  .flex-list-inner {
    .r-card {
      .table-card-item {
        span {
          &:first-child {
            min-width: 35%;
          }
        }
      }
    }
  }
}
.clickable {
  cursor: pointer;
}
</style>
