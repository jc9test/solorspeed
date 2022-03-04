import { getEsData } from '/@src/api/esdata'
import axiosClient from '../composable/useApi'

export const getGroupNames = async () => {
  try {
    const searchOptions = {
      esIndex: 'rcm-edgegroup',
      from: 0,
      size: 999,
      sort: [{ 'groupName.keyword': { order: 'asc' } }],
      filters: [],
      _source: ['groupName'],
    }
    const result = await getEsData(searchOptions)
    const groupNames = result.data.mapData.map((e: any) => e.groupName)
    return groupNames
  } catch (err) {
    return []
  }
}

export const getGroupResourceLimits = async ({ groupName }: any) => {
  try {
    // let searchOptions = {
    //     esIndex: "rcm-edgegroup",
    //     from: 0,
    //     size: 1,
    //     sort: [{ "groupName.keyword": { order: "asc" } }],
    //     filters: [{ key: "groupName", value: groupName, type: "string" }],
    //     _source: [
    //         "groupName",
    //         "maxFQDNConfigCount",
    //         "maxNonProfileServerNameCount",
    //         "maxAppProfileCount",
    //         "maxServerNameInAppProfileCount",
    //         "maxServerNameCount",
    //         "maxWafRuleCount",
    //         "maxAlertRuleCount",
    //         "maxHtmlPageCount",
    //         "maxOriginPolicyCount",
    //         "maxDomainListenPortCount",
    //         "maxDomainOriginCount",
    //         "maxServiceGroupCount",
    //         "maxServiceCount",
    //     ]
    // };
    // let result = await getEsData(searchOptions);
    // let getGroupResourceLimits = result.data.mapData[0];
    // return getGroupResourceLimits;
    const result = await axiosClient.get(`/group/resource-limits`, {
      params: { groupName },
    })
    const groupResourceLimits = result.data.data
    return groupResourceLimits
  } catch (err) {
    return {}
  }
}
