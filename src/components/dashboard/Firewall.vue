<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watch, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import store from '/@src/stores/index'
import EditDashboardFilterModal from '/@src/pages/dashboard/EditDashboardFilterModal.vue'

const firewallFilter = [
  {
    chartFilterKey: 'tb_type.keyword',
    chartFilterOperator: 'is',
    chartFilterValue: '01', //waf
    chartFilterEnabled: true,
    chartFilterLabel: 'tb_type.keyword:01',
  },
]

const tbReasonFilter = [
  {
    chartFilterKey: 'tb_reason.keyword',
    chartFilterOperator: 'is',
    chartFilterValue: 'rate*',
    chartFilterEnabled: true,
    chartFilterLabel: 'tb_reason.keyword:rate*',
  },
]

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
  <h2 class="dark-inverted">{{ t('dashboard.firewall') }}</h2>
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
      <!-- summary -->

      <div class="column column is-12">
        <V-Card radius="regular">
          <div class="cards-header">
            <div class="card-title">
              <h3 class="dark-inverted">{{ t('dashboard.eventByAction') }}</h3>
            </div>
          </div>

          <div class="selection">
            <V-Tabs
              class="tab"
              selected="action"
              :tabs="[
                { label: `${t('dashboard.action')}`, value: 'action' },
                { label: `${t('dashboard.domainNameText')}`, value: 'domain' },
                { label: `${t('dashboard.country')}`, value: 'counrty' },
                { label: `${t('dashboard.isp')}`, value: 'isp' },
                { label: `${t('dashboard.ip')}`, value: 'ip' },
                { label: `${t('dashboard.path')}`, value: 'path' },
                {
                  label: `${t('dashboard.http_version')}`,
                  value: 'httpVersion',
                },
                { label: `${t('dashboard.http_method')}`, value: 'httpMethod' },
                {
                  label: `${t('dashboard.firewall_rules')}`,
                  value: 'firewallRules',
                },
              ]"
            >
              <template #tab="{ activeValue }">
                <div v-if="activeValue === 'action'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="tb_action.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'host'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="req_headers.host.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'domain'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="server_name.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'counrty'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="country.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'isp'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="isp.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'ip'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="cus_realy_addr.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'path'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="uri.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'userAgent'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="req_headers.user-agent.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'firewallRules'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="tb_rule.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'rateLimitRules'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="tb_rule.keyword"
                    :chart-query-filters="tbReasonFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'httpMethod'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="request_method.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>

                <div v-else-if="activeValue === 'httpVersion'">
                  <LineChart
                    chart-metric="count"
                    chart-metric-group-by="terms"
                    chart-metric-group-by-terms="server_protocol.keyword"
                    :chart-query-filters="firewallFilter"
                    numeral-format="'0.0a'"
                  />
                </div>
              </template>
            </V-Tabs>
          </div>
          <div></div>
        </V-Card>
      </div>

      <!-- event by service -->

      <!-- <div class="column column is-12">
        <V-Card radius="regular">
          <div class="cards-header">
            <div class="card-title">
              <h3 class="dark-inverted">Event By Service</h3>
            </div>
          </div>

          <div class="event-service-header">
            <div
              v-for="(item, index) in eventByService"
              :key="index"
              class="header-item"
            >
              <div class="item-inner">
                <div class="title-with-dot">
                  <div class="dot"></div>
                  <p>{{ item.title }}</p>
                </div>

                <div class="event-service-detail">
                  <span class="dark-inverted event-service-detail">{{
                    item.number
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="service-event-bars">
            <div class="service-event-bar" style="background-color: #41b883">
              <span>Acess Rules: Country</span>
              <span>50%</span>
            </div>

            <div class="service-event-bar" style="background-color: #93e088">
              <span>Firewall Rules</span>
              <span>20%</span>
            </div>

            <div class="service-event-bar" style="background-color: #37c3ff">
              <span>WAF</span>
              <span>30%</span>
            </div>
          </div>
        </V-Card>
      </div> -->

      <!-- cards -->

      <div class="column column is-12 cards">
        <V-Card radius="regular" class="requestCards">
          <div class="cards-header">
            <div class="card-title">
              <h3 class="dark-inverted">
                {{ t('dashboard.topEventBySource') }}
              </h3>
            </div>

            <V-Dropdown
              ref="changeItemDropdown"
              :title="`${currentItemNumber.toFixed()} Items`"
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
                  :chart-query-filters="firewallFilter"
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
                  :chart-query-filters="firewallFilter"
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
                  :chart-query-filters="firewallFilter"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.status_code')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="status.keyword"
                  :chart-query-filters="firewallFilter"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.firewall_rules')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="tb_rule.keyword"
                  :chart-query-filters="firewallFilter"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.action')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="tb_action.keyword"
                  :chart-query-filters="firewallFilter"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.country')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="country.keyword"
                  :chart-query-filters="firewallFilter"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.isp')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="isp.keyword"
                  :chart-query-filters="firewallFilter"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  :item-number="itemNumber"
                  :title="t('dashboard.http_method')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="request_method.keyword"
                  :chart-query-filters="firewallFilter"
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
                  :chart-query-filters="firewallFilter"
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
                  :chart-query-filters="firewallFilter"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div>

            <!-- <div class="column column is-6">
              <V-Card class="cards-item" radius="regular">
                <RawCard
                  
                  :item-number="itemNumber"
                  :title="t('dashboard.host')"
                  chart-metric="count"
                  chart-metric-group-by="terms"
                  chart-metric-group-by-terms="req_headers.host.keyword"
                  :chart-query-filters="firewallFilter"
                  numeral-format="'0.0a'"
                />
              </V-Card>
            </div> -->
          </div>
        </V-Card>
      </div>

      <ActivityLog />
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

// =================
//  summary
// =================

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

// overview

.overview-header {
  .header-item {
    &:first-child {
      &::after {
        content: '';
        display: none;
      }
    }
    &::after {
      content: '';
      margin-top: -100px;
      margin-left: -40px;
      padding-left: 15px;
      border-left: 1px solid #c0c4cc;
      height: 50px;
      display: inline-block;
      vertical-align: middle;
    }
  }
}

.overview-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 30px;

  .header-item {
    width: 10%;

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
  }
}

.is-dark {
  .overview-header {
    color: $white;

    .overview-header-hover-button {
      span {
        color: $dark-dark-text;
      }
    }
  }
}

// =================
//  country
// =================

.country-content {
  display: flex;

  .country-left,
  .country-right {
    width: 50%;
  }

  .country-right {
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
}

//===================
// event by service
//===================

// .header-item {
//   &:first-child {
//     &::after {
//       content: '';
//       display: none;
//     }
//   }
//   &::after {
//     content: '';
//     margin-top: -100px;
//     margin-left: -66px;
//     padding-left: 15px;
//     border-left: 1px solid #c0c4cc;
//     height: 50px;
//     display: inline-block;
//     vertical-align: middle;
//   }
// }

.event-service-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 10px;

  .header-item {
    width: 10%;

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
      }
    }
  }
}

// bar

.service-event-bars {
  display: flex;
  margin: 0 30px;

  .service-event-bar {
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

//================
// table
//================

.home {
  .flex-table-header {
    span {
      &:first-child {
        margin-left: 10px;
      }
    }
  }
}

.flex-list-inner {
  .flex-table-item {
    .flex-table-cell {
      .date {
        display: flex;
        align-items: center;
      }

      .iconify {
        font-size: 1.7rem;
        cursor: pointer;
        margin: 5px 7px 0 0;
        padding: 5px;

        &:hover {
          background: $fade-grey;
          border-radius: 20px;
        }
      }
    }
  }
}

.flex-list-inner {
  .r-card {
    display: flex;
    margin-bottom: 6px;
    // justify-content: space-between;

    .table-card-items-left,
    .table-card-items-right {
      width: 50%;
    }

    .table-card-items-left {
      margin-right: 30px;
    }

    .table-card-item {
      display: flex;
      word-break: break-all;
      margin-bottom: 10px;

      span {
        &:first-child {
          min-width: 25%;
          font-weight: 500;
          flex-wrap: wrap;
        }
      }
    }
  }
}

@media only screen and (max-width: 1000px) {
  .overview-header,
  .event-service-header {
    flex-direction: column;

    .header-item {
      width: 100%;
    }

    .header-item {
      margin: 5px 0;
      border-bottom: 1px solid $lighter-grey;
      span {
        margin-bottom: 5px;
      }

      &::after {
        border-left: none;
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
