<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import store from '/@src/stores/index'
// import serviceStore from '/@src/stores/service'

const { t } = useI18n()
const emit = defineEmits(['onHandleClearCache', 'onHandleDeleteService'])
const props = defineProps({
  results: {
    type: Object,
    default: () => {},
  },
})

const results = computed(() => {
  // return {
  //   appProfileDomainsLength: props.appProfileDomainsLength,
  //   appProfileName: props.appProfileName,
  //   serviceGroupName: props.serviceGroupName,
  //   status: props.status,
  //   origins: props.origins,
  //   description: props.description,
  //   usedWafRules: props.usedWafRules,
  // }
  return props.results
})

const clickServiceLine = (service: Object) => {
  // let state = serviceStore.state
  // serviceStore.mutations.SET_APP_PROFILE_NAME(state, service.appProfileName)
  // serviceStore.mutations.SET_SERVICE_DETAIL(state, service)
  store.commit('SET_APP_PROFILE_NAME', service.appProfileName)
  store.commit('SET_SERVICE_DETAIL', service)
}
</script>

<template>
  <div class="list-view-item">
    <RouterLink
      :to="{
        name: 'service.overview',
        query: {
          appProfileName: results.appProfileName,
        },
      }"
      class="list-right"
      @click="clickServiceLine(results)"
    >
      <div class="list-view-item-inner">
        <div class="mobile-header-wrapper meta-left flex-5">
          <div class="mobile-header">
            <div class="mobile-header-container">
              <h3>{{ results.appProfileName }}</h3>
              <span>{{ results.serviceGroupName }}</span>
            </div>
            <div class="mobile-header-status is-hidden-desktop is-hidden-tablet">
              <div class="tags">
                <VTag
                  v-if="results.status === '運行中'"
                  label="Running"
                  color="green"
                  rounded
                  elevated
                />
                <VTag v-else label="Pending" color="orange" rounded elevated />
              </div>
            </div>
          </div>
        </div>
        <div class="header-status meta-right">
          <div class="tags">
            <VTag
              v-if="results.status === '運行中'"
              label="Running"
              color="green"
              rounded
              elevated
            />
            <VTag v-else label="Pending" color="orange" rounded elevated />
          </div>
        </div>
        <div class="pl-2 meta-right">
          <div class="stats">
            <div class="stat">
              <span>
                {{ results.usedWafRules.filter((e) => e.isEnabled == true).length }}
              </span>
              <span>{{ t('service.waf') }}</span>
            </div>
            <div class="separator"></div>
            <div class="stat">
              <span>{{ results.appProfileDomainsLength }}</span>
              <span>{{ t('service.domain_name') }}</span>
            </div>
            <div class="separator"></div>
            <div class="stat">
              <a
                href="javascript:void(0);"
                class="btn-brush"
                @click.stop="emit('onHandleClearCache', results)"
              >
                <div class="icon">
                  <i aria-hidden="true" class="lnil lnil-brush"></i>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </RouterLink>
    <div class="btn-edit">
      <VDropdownEdit icon="feather:more-vertical" spaced right>
        <template #content>
          <a
            v-if="results.status === '運行中'"
            href="javascript:void(0);"
            class="dropdown-item is-media"
            @click="emit('onHandleDeleteService', results)"
          >
            <div class="icon">
              <i aria-hidden="true" class="lnil lnil-trash"></i>
            </div>
            <div class="meta">
              <span>{{ t('service.deleteText') }}</span>
            </div>
          </a>
          <a
            v-else
            href="javascript:void(0);"
            class="dropdown-item is-media disabled"
            @click="disabled"
          >
            <div class="icon">
              <i aria-hidden="true" class="lnil lnil-trash"></i>
            </div>
            <div class="meta">
              <span>{{ t('service.deleteText') }}</span>
            </div>
          </a>
        </template>
      </VDropdownEdit>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@for $i from 0 through 10 {
  .flex-#{$i} {
    flex: $i;
  }
}

.list-view-item-inner {
  .stats {
    margin-right: 5px !important;
  }
}

.btn-brush {
  padding: 8px;
  &:hover {
    background: darken($white, 7%);
    border-radius: 50%;
  }
}

.is-dark {
  .icon {
    .lnil {
      color: #a2a5b9;
    }
  }
  .btn-brush:hover {
    background: lighten($dark-sidebar, 2%);
    border-radius: 50%;
  }
}

.service-line {
  .meta-left {
    h3 {
      word-break: break-all;
    }
    .decription {
      word-break: break-all;
      margin-top: 3px;
      display: flex;
      flex-direction: column;
    }
  }

  .list-view-inner {
    .lines {
      display: flex;

      .list-view-item {
        &:first-child {
          margin-right: 20px;
        }
      }
    }
    .columns {
      display: flex;
      margin-left: 0;
    }
  }

  .list-view-column-container {
    display: flex;
    flex-wrap: wrap;
    margin-right: -10px;
    .list-view-column {
      flex: 0 0 50%;
      padding-right: 10px;
      margin-bottom: 10px;
    }
    @media only screen and (max-width: 1200px) {
      .list-view-column {
        flex: 0 0 100%;
      }
    }
  }

  .list-view-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-bottom: 0;

    &:hover {
      border-color: $primary;
      box-shadow: $light-box-shadow;
    }
  }

  .list-right {
    width: 100%;
  }

  #dropdown-service {
    .dropdown-menu {
      min-width: 150px;
    }
  }

  .btn-edit {
    .dropdown {
      .dropdown-menu {
        .dropdown-content {
          .dropdown-item {
            &.disabled {
              cursor: not-allowed;
              .meta {
                span {
                  color: grey;
                }
              }
              .icon {
                i {
                  color: grey;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .list-view-v1 {
    .columns {
      flex-direction: column;
      margin-right: 0;
    }
    .list-view-item {
      align-items: flex-start;
      min-width: initial;

      .btn-edit {
        position: relative;
        .dropdown {
          position: absolute;
          right: 0px;
        }
      }
      .meta-left {
        text-align: center;
      }
    }
    .stats {
      min-width: 200px;
      .stat {
        flex: 1;
      }
    }
  }
}

@media only screen and (max-width: 1200px) {
  .service-line {
    .list-view-inner {
      .lines {
        flex-direction: column;
      }
    }
  }
}
</style>
