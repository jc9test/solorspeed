<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { getPlatformPlan } from '/@src/api/system'
import { getEsData } from '/@src/api/esdata'
import { useI18n } from 'vue-i18n'
// import useNotyf from '/@src/composable/useNotyf'
// import sleep from '/@src/utils/sleep'

const { t } = useI18n()
let subscriptionPlanData = ref([])
let groupData = ref([])
// let subscription = ref([])
// let subscriptionKey = ref(10) //temporary data for counting percentage

const category = [
  {
    name: 'FQDNConfig',
    createdKey: 'createdFQDNConfigCount',
    maxKey: 'maxFQDNConfigCount',
  },
  {
    name: 'FQDN',
    createdKey: 'createdServerNameCount',
    maxKey: 'maxServerNameCount',
  },
  {
    name: 'Waf Rule',
    createdKey: 'createdWafRuleCount',
    maxKey: 'maxWafRuleCount',
  },
  {
    name: 'Origin Policy',
    createdKey: 'createdOriginPolicyCount',
    maxKey: 'maxOriginPolicyCount',
  },
  {
    name: 'HTML Page',
    createdKey: 'createdHtmlPageCount',
    maxKey: 'maxHtmlPageCount',
  },
  {
    name: 'Cert',
    createdKey: 'createdCertPemCount',
    maxKey: null,
    val: '40000', //no val
  },
  {
    name: 'Alert Rule',
    createdKey: 'createdAlertRuleCount',
    maxKey: 'maxAlertRuleCount',
  },
  {
    name: 'Site',
    createdKey: 'createdServiceGroupCount',
    maxKey: 'maxServiceGroupCount',
  },
  // {
  //   name: 'Root Domains',
  //   value: 'domains',
  //   usedKey: 'usedDomains',
  //   createdKey: 'createdServerNameCount', //not sure
  //   subscriptionKey: 'domainsSubscription',
  // },
  // {
  //   name: 'FQDN',
  //   value: 'fqdns',
  //   usedKey: 'usedFqdns',
  //   createdKey: 'createdFQDNConfigCount',
  //   subscriptionKey: 'fqdnsSubscription',
  // },
  // {
  //   name: 'Site',
  //   value: 'servicegroups',
  //   usedKey: 'usedServicegroups',
  //   createdKey: 'createdServiceGroupCount',
  //   subscriptionKey: 'servicegroupsSubscription',
  // },
  // {
  //   name: 'Certs',
  //   value: 'certs',
  //   usedKey: 'usedCertpems',
  //   createdKey: 'createdCertPemCount',
  //   subscriptionKey: 'certsSubscription',
  // },
  // {
  //   name: 'Volume',
  //   value: 'volumes',
  //   usedKey: 'usedVolumes',
  //   createdKey: '',//not sure
  //   subscriptionKey: 'volumesSubscription',
  // },
]

const getSubscriptionPlanData = () => {
  getPlatformPlan()
    .then((res) => {
      subscriptionPlanData.value = res.data.planSpec
    })
    .catch((err) => {
      console.log(err)
    })
}

const searchOptions = computed(() => {
  const options = {
    isFuzzySearch: true,
    esIndex: 'rcm-edgegroup',
    from: 0,
    sort: [{ modifiedDate: { order: 'desc' } }],
    filters: [
      {
        key: 'groupName',
        type: 'string',
        // value: store.state.queryGroupName,
        value: 'narbeh',
      },
    ],
    searchView: 'GroupSubscription',
  }
  return options
})

const getSubscriptionData = () => {
  getEsData(searchOptions.value)
    .then((res) => {
      groupData.value = res.data.mapData[0]
    })

    .catch((err) => console.log(err))
}

onMounted(() => {
  getSubscriptionPlanData()
  getSubscriptionData()
})

// pageTitle.value = 'subscription'
// useHead({
//   title: computed(() => `${t('main.subscription')} | Solar Speed`),
// })
</script>
<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
      <div class="form-head-inner">
        <div class="left">
          <h3>{{ t('setting.subscription') }}</h3>
          <!-- <p>{{ t('setting.security_content') }}</p> -->
        </div>
      </div>
    </div>
    <div class="box-content">
      <h3 class="dark-inverted">{{ t('main.subscription') }}</h3>

      <div v-for="item in category" :key="item" class="progress-line">
        <div v-if="item.maxKey != null" class="subscription-label dark-inverted">
          <strong style="font-size: 20px">{{ groupData[item.createdKey] }}</strong>
          of
          {{ groupData[item.maxKey] }}
          {{ item.name }}
        </div>
        <div v-else class="subscription-label dark-inverted">
          <strong style="font-size: 20px">{{ groupData[item.createdKey] }}</strong>
          of {{ item.val }}
          {{ item.name }}
        </div>

        <VProgress
          size="small"
          :value="
            item.maxKey != null
              ? (groupData[item.createdKey] / groupData[item.maxKey]) * 100
              : (groupData[item.createdKey] / item.val) * 100
          "
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.progress-line {
  margin-bottom: 30px;
}
.box-content {
  padding: 20px;
}

@media only screen and (max-width: 767px) {
  .form-head {
    display: none;
  }
}
</style>
