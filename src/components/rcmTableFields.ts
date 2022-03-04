export default function () {
  return [
    {
      searchViews: ['*'],
      key: 'action',
      fixed: 'left',
      minWidth: 120,
      title: 'Action',
      showInTable: true,
      withForm: false,
      // exportOptions: { canExport: false, callback: value => value },
      // render: (h, params) => {
      //     const actionDivArray = [];
      //     const editBtn = h("Button", {
      //         props: {
      //             shape: "circle",
      //             icon: vm.isEditBtnDisabled ? "md-eye" : "md-create"
      //         },
      //         on: {
      //             click: () => {
      //                 vm.editItem(params.row);
      //             }
      //         }
      //     });
      //     const deleteBtn = h("Button", {
      //         props: {
      //             shape: "circle",
      //             icon: "md-trash",
      //             disabled: vm.isDeleteBtnDisabled,
      //             type: "dashed"
      //         },
      //         style: {
      //             color: "#e1e1e1"
      //         },
      //         on: {
      //             click: () => {
      //                 var deleteItem = Object.assign({}, params.row);
      //                 delete deleteItem._index;
      //                 delete deleteItem._rowKey;

      //                 vm.$Modal.confirm({
      //                     title: vm.$t("rcmtable.removeText"),
      //                     content: vm.$t("rcmtable.confirmRemoveText"),
      //                     okText: vm.$i18n.t("rcmtable.confirmText"),
      //                     cancelText: vm.$i18n.t("rcmtable.cancelText"),
      //                     onOk: () => {
      //                         vm.actionType = "delete";
      //                         vm.updateData(vm.esIndex, "delete", deleteItem);
      //                     }
      //                 });
      //             }
      //         }
      //     });
      //     if (vm.userCanIndex) {
      //         actionDivArray.push(editBtn);
      //     }
      //     if (vm.userCanDelete) {
      //         actionDivArray.push(deleteBtn);
      //     }

      //     return h("div", actionDivArray);
      // },
      sortable: false,
    },
    {
      searchViews: ['*'],
      key: 'objectLog',
      minWidth: 200,
      title: 'Object Log',
      showInTable: true,
      withForm: false,
      // exportOptions: { canExport: false, callback: value => value },
      // render: (h, params) => {
      //     return h(
      //         "ObjectLogBtn",
      //         {
      //             props: { objId: params.row._id, title: "Logs", groupName: params.row.groupName }
      //         },
      //         ""
      //     );
      // },
      // vShowFieldVal: () => 1,
      sortable: false,
    },
    {
      searchViews: ['EdgeSetting', 'SlbSetting'],
      key: 'nodeConnect',
      title: 'connect',
      showInTable: true,
      withForm: false,
      minWidth: 120,
      // render: (h, params) => {
      //     return h(
      //         "NodeConnectBtn",
      //         {
      //             props: {}
      //         },
      //         ""
      //     );
      // },
      // vShowFieldVal: () => 1,
      sortable: false,
    },
    {
      searchViews: ['SSHKeysManage'],
      key: 'sshKeyName',
      title: 'KeyName',
      sectionKey: 'essential',
      description: '<p>The <strong>Name</strong> of your key.</p>',
      showInTable: true,
      withForm: true,
      formTypes: ['createForm'],
      formRender: 'FormInput',
      defaultVal: '',
      filter: {
        type: 'string',
        // defaultValue: vm.$route.query.sshKeyName
      },
    },
    {
      searchViews: ['SSHKeysManage'],
      key: 'sshKeyRaw',
      title: 'SSH PRIVATE KEY',
      sectionKey: 'essential',
      description:
        '<p>You are <strong>NOT</strong> able to view the content after you upload.</p>',
      showInTable: false,
      withForm: true,
      withTable: false,
      formTypes: ['createForm', 'editForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      autosize: { minRows: 8, maxRows: 12 },
      defaultVal: '',
    },
    {
      // searchViews: ["WafRules", "AlertRules"],
      searchViews: ['*'],
      key: 'ruleName',
      title: 'Rule Name',
      sectionKey: 'essential',
      description: '<p>The <strong>Name</strong> of your rule.</p>',
      showInTable: true,
      withForm: true,
      formTypes: ['createForm'],
      formRender: 'FormInput',
      defaultVal: '',
      filter: {
        type: 'string',
        // defaultValue: vm.$route.query.ruleName
      },
    },
    {
      searchViews: ['WafRules'],
      key: 'wafAction',
      title: 'Waf Action',
      sectionKey: 'essential',
      description: '<p>The action to perform when meet the conditions.</p>',
      showInTable: true,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormSelect',
      //   remoteOptions: async (queryValue, queryParams) => {
      //       queryValue = queryValue || "*";
      //       queryParams.actionName = `*${queryValue}*`;
      //       let queryString = new URLSearchParams(queryParams).toString();
      //       let result = await getFormOptions(`/wafactions?${queryString}`);
      //       return result.data.options;
      //   },
      options: [
        { label: 'Allow', value: '00' },
        { label: 'Deny', value: '01' },
        { label: 'Gesture Challenge', value: '03' },
        { label: 'Speed Limit', value: '05' },
        { label: 'Redirect', value: '06' },
        { label: 'Cookie / JS Challenge', value: '07' },
        { label: 'Block Period', value: '08' },
        { label: 'Set Request Headers', value: '09' },
        { label: 'Set Response Headers', value: '10' },
        { label: 'Log Only', value: '11' },
        { label: 'Custom Page', value: '12' },
        { label: 'Origin Policy', value: '13' },
      ],
      defaultVal: '00',
      filter: {
        type: 'select',
      },
      validate: [
        {
          required: true,
          message: 'Missing Action',
          trigger: 'blur',
        },
      ],
      // watchField: function(value, item) {
      //     if (value !== "08") {
      //         item.wafBucketTime = 300;
      //     }
      //     if (value !== "05") {
      //         item.wafSpeedLimit = 10240;
      //     }
      //     if (value !== "06") {
      //         item.wafRedirectUrl = "";
      //     }
      //     if (value !== "09") {
      //         item.wafSetReqHeaders = "";
      //     }
      //     if (value !== "10") {
      //         item.wafSetResHeaders = "";
      //     }
      // },

      // render: (h, params) => {
      //     // let svg = params.row.wafAction == 0 ? "check.svg" : "cross.svg";
      //     let explain = wafActionToString(params.row.wafAction);
      //     return h("div", [
      //         h(
      //             "Tooltip",
      //             {
      //                 props: {
      //                     placement: "top",
      //                     transfer: true,
      //                     content: params.row.wafAction
      //                 }
      //             },
      //             [
      //                 h(
      //                     "div",
      //                     {
      //                         attrs: {},
      //                         style: {
      //                             width: "120px",
      //                             height: "24px"
      //                         }
      //                     },
      //                     explain
      //                 )
      //             ]
      //         )
      //     ]);
      // }
    },
    {
      searchViews: ['WafRules'],
      key: 'wafDenyHtmlPageName',
      title: 'wafDenyHtmlPageName',
      sectionKey: 'essential',
      description: '<p>The Html Page you want to present</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormSelect',
      defaultVal: 'default',
      // vShowFieldVal: item => (item.wafAction == "01" || item.wafAction == "08" ? 1 : 0),
      // remoteOptions: async (queryValue, queryParams) => {
      //     queryValue = queryValue || "*";
      //     queryParams.htmlPageName = `*${queryValue}*`;
      //     queryParams.withDefault = true;
      //     let queryString = new URLSearchParams(queryParams).toString();
      //     let result = await getFormOptions(`htmlpagenames?${queryString}`);
      //     return result.data.options;
      // },
      // queryParamsFields: [
      //     { fieldName: "wafAction", queryIf: val => ["01", "08"].includes(val) },
      //     { fieldName: "groupName", queryIf: val => val !== "" }
      // ]
    },
    {
      searchViews: ['WafRules'],
      key: 'wafCustomHtmlPageName',
      title: 'wafCustomHtmlPageName',
      sectionKey: 'essential',
      description: '<p>The Html Page you want to present</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormSelect',
      defaultVal: '',
      //     vShowFieldVal: item => (item.wafAction == "12" ? 1 : 0),
      //     validate: [
      //         {
      //             required: true,
      //             message: "Missing Page Name",
      //             trigger: "blur"
      //         }
      //     ],
      //     remoteOptions: async (queryValue, queryParams) => {
      //         queryValue = queryValue || "*";
      //         queryParams.htmlPageName = `*${queryValue}*`;
      //         queryParams.withDefault = false;
      //         let queryString = new URLSearchParams(queryParams).toString();
      //         let result = await getFormOptions(`htmlpagenames?${queryString}`);
      //         return result.data.options;
      //     },
      //     queryParamsFields: [
      //         { fieldName: "wafAction", queryIf: val => val == "12" },
      //         { fieldName: "groupName", queryIf: val => val !== "" }
      //     ]
    },
    {
      searchViews: ['WafRules'],
      key: 'wafOriginPolicyName',
      title: 'wafOriginPolicyName',
      sectionKey: 'essential',
      description: '<p>The Origin Policy to apply.</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormSelect',
      defaultVal: '',
      // vShowFieldVal: item => (item.wafAction == "13" ? 1 : 0),
      // validate: [
      //     {
      //         required: true,
      //         message: "Missing Origin Policy Name",
      //         trigger: "blur"
      //     }
      // ],
      // remoteOptions: async (queryValue, queryParams) => {
      //     queryValue = queryValue || "*";
      //     queryParams.originPolicyName = `*${queryValue}*`;
      //     let queryString = new URLSearchParams(queryParams).toString();
      //     let result = await getFormOptions(`/originpolicynames?${queryString}`);
      //     return result.data.options;
      // },
      // queryParamsFields: [
      //     { fieldName: "wafAction", queryIf: val => val == "13" },
      //     { fieldName: "groupName", queryIf: val => val !== "" }
      // ]
    },
    {
      searchViews: ['WafRules'],
      key: 'wafBucketTime',
      title: 'wafBucketTime',
      sectionKey: 'essential',
      description: '<p>The period of time to block. (seconds)</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInputNumber',
      inputMaxNum: 3600,
      inputMinNum: 5,
      defaultVal: 300,
      // vShowFieldVal: item => (item.wafAction == "08" ? 1 : 0)
    },
    {
      searchViews: ['WafRules'],
      key: 'wafSpeedLimit',
      title: 'wafSpeedLimit',
      sectionKey: 'essential',
      description: '<p>The speed to limit. (KB/s)</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInputNumber',
      defaultVal: 10240,
      // validate: [
      //     {
      //         validator: (rule, value, callback, source, options) => {
      //             let errors = vm.formData.wafAction == "05" && value < 1 ? "Speed must greater than 0" : [];
      //             callback(errors);
      //         },
      //         trigger: "change"
      //     }
      // ],
      // vShowFieldVal: item => (item.wafAction == "05" ? 1 : 0)
    },
    {
      searchViews: ['WafRules'],
      key: 'wafRedirectUrl',
      title: 'wafRedirectUrl',
      sectionKey: 'essential',
      description: '<p>The url to  redirect to. (http://example.com)</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      defaultVal: '',
      // validate: [
      //     {
      //         validator: (rule, value, callback, source, options) => {
      //             let errors =
      //                 vm.formData.wafAction == "06" &&
      //                 !(value.indexOf("http://") == 0 || value.indexOf("https://") == 0)
      //                     ? "Missing redirect url"
      //                     : [];
      //             callback(errors);
      //         },
      //         trigger: "change"
      //     }
      // ],
      // vShowFieldVal: item => (item.wafAction == "06" ? 1 : 0)
    },
    {
      searchViews: ['WafRules'],
      key: 'wafRedirectHttpCode',
      title: 'wafRedirectHttpCode',
      sectionKey: 'essential',
      description: '<p>The http code for redirecting.</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      width: 80,
      formRender: 'FormSelect',
      multiple: false,
      // remoteOptions: async (queryValue, queryParams) => {
      //     queryValue = queryValue || "*";
      //     queryParams.codeName = `*${queryValue}*`;
      //     let queryString = new URLSearchParams(queryParams).toString();
      //     let result = await getFormOptions(`/redirect-http-code?${queryString}`);
      //     return result.data.options;
      // },
      // // queryParamsFields: [{ fieldName: "groupName", queryIf: val => val !== "" }],
      options: [],
      defaultVal: '302',
      filter: {
        type: 'string',
      },
      // vShowFieldVal: item => (item.wafAction == "06" ? 1 : 0)
    },
    {
      searchViews: ['WafRules'],
      key: 'wafSetReqHeaders',
      title: 'wafSetReqHeaders',
      sectionKey: 'essential',
      description:
        '<p>Set request header from CDN edges to origin.Use <b>$rip</b> to obtain client ip. ex. my-ip-header:$rip</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      defaultVal: '',
      // autosize: inputAutoSize,
      filter: {
        type: 'string',
      },
      // vShowFieldVal: item => (item.wafAction == "09" ? 1 : 0),
      // render: (h, params) => {
      //     return h("StringList", {
      //         props: {
      //             listData: params.row.wafSetReqHeaders.split("\n").filter(e => e.length > 0),
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafSetReqHeaders"),
      //             width: "350"
      //         }
      //     });
      // },
      // validate: [
      //     {
      //         validator: (rule, value, callback, source, options) => {
      //             if (vm.formData.wafAction == "09" && value.length == 0)
      //                 return callback(new Error("Missing request headers"));
      //             let prohibitedKeys = [
      //                 "x-forwarded-for",
      //                 "x-forwarded-proto",
      //                 "true-client-ip",
      //                 "rid",
      //                 "c-type",
      //                 "host",
      //                 "connection",
      //                 "if-modified-since",
      //                 "if-unmodified-since",
      //                 "if-match",
      //                 "if-none-match",
      //                 "user-agent",
      //                 "referer",
      //                 "content-length",
      //                 "content-range",
      //                 "content-type",
      //                 "range",
      //                 "if-range",
      //                 "transfer-encoding",
      //                 "te",
      //                 "expect",
      //                 "upgrade",
      //                 "accept-encoding",
      //                 "via",
      //                 "authorization",
      //                 "keep-alive",
      //                 "x-forwarded-for",
      //                 "x-real-ip",
      //                 "accept",
      //                 "accept-language",
      //                 "depth",
      //                 "destination",
      //                 "overwrite",
      //                 "date",
      //                 "cookie"
      //             ];

      //             let valueArray = value.split("\n");
      //             valueArray.forEach(e => {
      //                 let headerKey = e.split(":")[0];
      //                 let headerVal = e.split(":")[1];

      //                 if (headerKey == undefined || headerVal == undefined)
      //                     return callback(new Error("invalid: " + e));

      //                 if (headerKey.length == 0 || headerVal.length == 0)
      //                     return callback(new Error("invalid: " + e));

      //                 if (prohibitedKeys.includes(headerKey.toLowerCase()))
      //                     return callback(new Error("invalid key: " + headerKey));

      //                 if (/[\'\"]/.test(e)) return callback(new Error("invalid: " + e));
      //             });

      //             callback();
      //         },
      //         trigger: "change"
      //     }
      // ],
      placeholder: 'my-ip-header:$rip',
    },
    {
      searchViews: ['WafRules'],
      key: 'wafSetResHeaders',
      title: 'wafSetResHeaders',
      sectionKey: 'essential',
      description:
        '<p>Set response header from CDN to client, useful in <b>CORS</b> required scenario. ex. access-control-allow-origin:mydomain.com</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      defaultVal: '',
      // autosize: inputAutoSize,
      filter: {
        type: 'string',
      },
      // vShowFieldVal: item => (item.wafAction == "10" ? 1 : 0),
      // render: (h, params) => {
      //     return h("StringList", {
      //         props: {
      //             listData: params.row.wafSetResHeaders.split("\n").filter(e => e.length > 0),
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafSetResHeaders"),
      //             width: "350"
      //         }
      //     });
      // },
      // validate: [
      //     {
      //         validator: (rule, value, callback, source, options) => {
      //             if (vm.formData.wafAction == "10" && value.length == 0)
      //                 return callback(new Error("Missing response headers"));
      //             let prohibitedKeys = [
      //                 "status",
      //                 "content-type",
      //                 "content-length",
      //                 "date",
      //                 "last-modified",
      //                 "etag",
      //                 "server",
      //                 "www-authenticate",
      //                 "location",
      //                 "refresh",
      //                 "set-cookie",
      //                 "content-disposition",
      //                 "cache-control",
      //                 "expires",
      //                 "accept-ranges",
      //                 "content-range",
      //                 "connection",
      //                 "keep-alive",
      //                 "vary",
      //                 "link",
      //                 "x-accel-expires",
      //                 "x-accel-redirect",
      //                 "x-accel-limit-rate",
      //                 "x-accel-buffering",
      //                 "x-accel-charset",
      //                 "transfer-encoding",
      //                 "content-encoding"
      //             ];

      //             let valueArray = value.split("\n");
      //             valueArray.forEach(e => {
      //                 let headerKey = e.split(":")[0];
      //                 let headerVal = e.split(":")[1];

      //                 if (headerKey == undefined || headerVal == undefined)
      //                     return callback(new Error("invalid: " + e));

      //                 if (headerKey.length == 0 || headerVal.length == 0)
      //                     return callback(new Error("invalid: " + e));

      //                 if (prohibitedKeys.includes(headerKey.toLowerCase()))
      //                     return callback(new Error("invalid key: " + headerKey));

      //                 if (/[\'\"]/.test(e)) return callback(new Error("invalid: " + e));
      //             });

      //             callback();
      //         },
      //         trigger: "change"
      //     }
      // ],
      placeholder: 'access-control-allow-origin:mydomain.com',
    },
    {
      searchViews: ['WafRules'],
      key: 'wafIp',
      title: 'wafIp',
      sectionKey: 'conditionIdentity',
      description:
        '<p>The IPs to match the rule, you can setup multiple IPs with <strong>newline</strong></p>',
      showInTable: true,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      defaultVal: '0.0.0.0/0',
      // autosize: inputAutoSize,
      filter: {
        type: 'string',
      },
      // render: (h, params) => {
      //     return h("StringList", {
      //         props: {
      //             listData: params.row.wafIp.split("\n").filter(e => e.length > 0),
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafIp"),
      //             width: "350"
      //         }
      //     });
      // },
      // validate: [
      //     {
      //         validator: (rule, value, callback, source, options) => {
      //             if (value.length == 0) return callback();
      //             let networks = value.split("\n");
      //             networks.forEach((e, i) => {
      //                 let index = networks.findIndex(x => x == e);
      //                 if (index !== i) return callback(new Error(`Duplicate: ${e}`));
      //                 if (/[\s]/.test(e)) return callback(new Error("invalid: " + e));
      //             });

      //             ipValidate("network", networks).then(result => {
      //                 if (!result.data.success) {
      //                     return callback(new Error(result.data.message));
      //                 }
      //                 callback();
      //             });
      //         },
      //         trigger: "blur"
      //     }
      // ],
      placeholder: 'A.B.C.D/netmask\nA.B.C.D/netmask',
    },
    {
      searchViews: ['WafRules'],
      key: 'wafUri',
      title: 'wafUri',
      sectionKey: 'conditionIdentity',
      description:
        '<p>The URI need to match the rules, you can setup multiple URIs with <strong>newline</strong>. </br> Remember to use <strong>Regex</strong></p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      defaultVal: '',
      // autosize: inputAutoSize,
      filter: {
        type: 'string',
      },
      // render: (h, params) => {
      //     return h("StringList", {
      //         props: {
      //             listData: params.row.wafUri.split("\n").filter(e => e.length > 0),
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafUri"),
      //             width: "350"
      //         }
      //     });
      // },
      validate: [],
      placeholder: '/api/secret$\n/assets$',
    },
    {
      searchViews: ['WafRules'],
      key: 'wafCountry',
      title: 'wafCountry',
      sectionKey: 'conditionIdentity',
      description: '<p>The countries to perform country detection.</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      // formRender: "MultiSelect",
      formRender: 'FormSelect',
      multiple: true,
      selectAllowCreate: false,
      multiSelectWithToolbox: true,
      // options: countryCode,
      defaultVal: [],
      // render: (h, params) => {
      //     return h("TagList", {
      //         props: {
      //             listData: params.row.wafCountry,
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafCountry"),
      //             width: "350"
      //         }
      //     });
      // },
      filter: {
        type: 'string',
      },
      validate: [],
    },
    {
      searchViews: ['WafRules'],
      key: 'wafIsp',
      title: 'wafIsp',
      sectionKey: 'conditionIdentity',
      description: '',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      defaultVal: '',
      // autosize: inputAutoSize,
      filter: {
        type: 'string',
      },
      // render: (h, params) => {
      //     return h("StringList", {
      //         props: {
      //             listData: params.row.wafIsp.split("\n").filter(e => e.length > 0),
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafIsp"),
      //             width: "350"
      //         }
      //     });
      // },
      placeholder: 'Target Telecom Co. Ltd.\nMy Other ISP',
    },
    {
      searchViews: ['WafRules'],
      key: 'wafProxyType',
      title: 'wafProxyType',
      sectionKey: 'conditionIdentity',
      description:
        "<p>We use <strong>ip2proxy</strong> database, for more information, please look at <a href='https://www.ip2proxy.com/'>ip2proxy</a></p>",
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      // formRender: "MultiSelect",
      formRender: 'FormSelect',
      multiple: true,
      selectAllowCreate: false,
      multiSelectWithToolbox: false,
      options: [
        { label: 'VPN', value: 'vpn' },
        { label: 'TOR', value: 'tor' },
        { label: 'DCH', value: 'dch' },
        { label: 'PUB', value: 'pub' },
        { label: 'WEB', value: 'web' },
        { label: 'SES', value: 'ses' },
      ],
      defaultVal: [],
      filter: {
        type: 'string',
      },
      validate: [],
    },
    {
      searchViews: ['WafRules'],
      key: 'wafHeaders',
      title: 'wafHeaders',
      sectionKey: 'conditionIdentity',
      description: '<p>The header need to perform headers detection.</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      defaultVal: '',
      // autosize: inputAutoSize,
      filter: {
        type: 'string',
      },
      // render: (h, params) => {
      //     return h("StringList", {
      //         props: {
      //             listData: params.row.wafHeaders.split("\n").filter(e => e.length > 0),
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafHeaders"),
      //             width: "350"
      //         }
      //     });
      // },
      // validate: [
      //     {
      //         validator: (rule, value, callback, source, options) => {
      //             if (value.length == 0) return callback();
      //             let valueArray = value.split("\n");
      //             valueArray.forEach(e => {
      //                 let headerKey = e.split(":")[0];
      //                 let headerVal = e.split(":")[1];

      //                 if (headerKey == undefined || headerVal == undefined)
      //                     return callback(new Error("invalid: " + e));

      //                 if (headerKey.length == 0 || headerVal.length == 0)
      //                     return callback(new Error("invalid: " + e));
      //             });

      //             callback();
      //         },
      //         trigger: "blur"
      //     }
      // ],
      placeholder:
        'user-agent:Bad Agent$\nhost:mysite\\.com$\nreferer:^(?!^mysite.com$)',
    },
    {
      searchViews: ['WafRules'],
      key: 'wafRate',
      title: 'wafRate',
      sectionKey: 'conditionBehavior',
      description:
        '<p>The <strong>Request Rate</strong> detection. The formula is <strong>hits / seconds</strong> </br> For Example: 200/1 means <strong>200 request per 1 second.</strong></p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      defaultVal: '',
      // disabled: false,
      // validate: [
      //     {
      //         validator: (rule, value, callback, source, options) => {
      //             if (value.length == 0) return callback();
      //             let hit = value.split("/")[0];
      //             let second = value.split("/")[1];

      //             if (hit == undefined || second == undefined) return callback(new Error("invalid: " + value));

      //             if (hit.length == 0 || second.length == 0) return callback(new Error("invalid: " + value));

      //             if (!/^[0-9]*$/.test(hit) || !/^[0-9]*$/.test(second))
      //                 return callback(new Error("invalid: " + value));

      //             callback();
      //         },
      //         trigger: "blur"
      //     }
      // ],
      // watchField: function(item) {},
      filter: {
        type: 'string',
      },
      placeholder: '',
    },
    {
      searchViews: ['WafRules'],
      key: 'wafHttpMethod',
      title: 'wafHttpMethod',
      sectionKey: 'conditionBehavior',
      description: '<p>The method of an http request.</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      // formRender: "MultiSelect",
      formRender: 'FormSelect',
      multiple: true,
      selectAllowCreate: false,
      multiSelectWithToolbox: true,
      options: [
        { label: 'GET', value: 'get' },
        { label: 'POST', value: 'post' },
        { label: 'PURGE', value: 'purge' },
        { label: 'PUT', value: 'put' },
        { label: 'HEAD', value: 'head' },
        { label: 'OPTIONS', value: 'options' },
        { label: 'DELETE', value: 'delete' },
        { label: 'PATCH', value: 'patch' },
      ],
      defaultVal: [],
      filter: {
        type: 'string',
      },
      // render: (h, params) => {
      //     return h("TagList", {
      //         props: {
      //             listData: params.row.wafHttpMethod,
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafHttpMethod"),
      //             width: "350"
      //         }
      //     });
      // },
      validate: [],
    },
    {
      searchViews: ['WafRules'],
      key: 'wafOwasp',
      title: 'wafOwasp',
      sectionKey: 'conditionOwasp',
      description: '<p>The OWASP base generic vulnerability detection.</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      // formRender: "MultiSelect",
      formRender: 'FormSelect',
      multiple: true,
      selectAllowCreate: false,
      multiSelectWithToolbox: true,
      options: [
        { label: 'http_violation', value: '20000_http_violation' },
        { label: 'http_anomaly', value: '21000_http_anomaly' },
        { label: 'user_agent', value: '35000_user_agent' },
        { label: 'generic_attack', value: '40000_generic_attack' },
        { label: 'sqli', value: '41000_sqli' },
        { label: 'xss', value: '42000_xss' },
      ],
      defaultVal: [],
      filter: {
        type: 'string',
      },
      // render: (h, params) => {
      //     return h("TagList", {
      //         props: {
      //             listData: params.row.wafOwasp,
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafOwasp"),
      //             width: "350"
      //         }
      //     });
      // },
      validate: [],
    },
    {
      searchViews: ['WafRules'],
      key: 'wafIpExclude',
      title: 'wafIpExclude',
      sectionKey: 'conditionExclusion',
      description:
        '<p>The IPs to match the rule, you can setup multiple IPs with <strong>newline</strong></p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      defaultVal: '',
      // autosize: inputAutoSize,
      filter: {
        type: 'string',
      },
      // render: (h, params) => {
      //     return h("StringList", {
      //         props: {
      //             listData: params.row.wafIpExclude.split("\n").filter(e => e.length > 0),
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafIpExclude"),
      //             width: "350"
      //         }
      //     });
      // },
      // validate: [
      //     {
      //         validator: (rule, value, callback, source, options) => {
      //             if (value.length == 0) return callback();
      //             let networks = value.split("\n");
      //             networks.forEach((e, i) => {
      //                 let index = networks.findIndex(x => x == e);
      //                 if (index !== i) return callback(new Error(`Duplicate: ${e}`));
      //                 if (/[\s]/.test(e)) return callback(new Error("invalid: " + e));
      //             });

      //             ipValidate("network", networks).then(result => {
      //                 if (!result.data.success) {
      //                     return callback(new Error(result.data.message));
      //                 }
      //                 callback();
      //             });
      //         },
      //         trigger: "blur"
      //     }
      // ],
      placeholder: 'A.B.C.D/netmask\nA.B.C.D/netmask',
    },
    {
      searchViews: ['WafRules'],
      key: 'wafUriExclude',
      title: 'wafUriExclude',
      sectionKey: 'conditionExclusion',
      description:
        '<p>The URI need to match the rules, you can setup multiple URIs with <strong>newline</strong>. </br> Remember to use <strong>Regex</strong></p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      defaultVal: '',
      // autosize: inputAutoSize,
      filter: {
        type: 'string',
      },
      // render: (h, params) => {
      //     return h("StringList", {
      //         props: {
      //             listData: params.row.wafUriExclude.split("\n").filter(e => e.length > 0),
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafUriExclude"),
      //             width: "350"
      //         }
      //     });
      // },
      validate: [],
      placeholder: '/api/secret$\n/assets$',
    },
    {
      searchViews: ['WafRules'],
      key: 'wafHeadersExclude',
      title: 'wafHeadersExclude',
      sectionKey: 'conditionExclusion',
      description: '<p>The header need to perform headers detection.</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      defaultVal: '',
      // autosize: inputAutoSize,
      filter: {
        type: 'string',
      },
      // render: (h, params) => {
      //     return h("StringList", {
      //         props: {
      //             listData: params.row.wafHeadersExclude.split("\n").filter(e => e.length > 0),
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafHeadersExclude"),
      //             width: "350"
      //         }
      //     });
      // },
      // validate: [
      //     {
      //         validator: (rule, value, callback, source, options) => {
      //             if (value.length == 0) return callback();
      //             let valueArray = value.split("\n");
      //             valueArray.forEach(e => {
      //                 let headerKey = e.split(":")[0];
      //                 let headerVal = e.split(":")[1];

      //                 if (headerKey == undefined || headerVal == undefined)
      //                     return callback(new Error("invalid: " + e));

      //                 if (headerKey.length == 0 || headerVal.length == 0)
      //                     return callback(new Error("invalid: " + e));
      //             });

      //             callback();
      //         },
      //         trigger: "blur"
      //     }
      // ],
      placeholder:
        'user-agent:Good Agent$\nhost:mysite\\.com$\nreferer:^(?!^mysite.com$)',
    },
    {
      searchViews: ['WafRules'],
      key: 'wafHeadersNotExist',
      title: 'wafHeadersNotExist',
      sectionKey: 'conditionIdentity',
      description: '<p>The header need to perform headers detection.</p>',
      showInTable: false,
      withForm: true,
      formTypes: ['createForm', 'editForm', 'multiEditForm'],
      formRender: 'FormInput',
      fieldType: 'textarea',
      defaultVal: '',
      // autosize: inputAutoSize,
      filter: {
        type: 'string',
      },
      // render: (h, params) => {
      //     return h("StringList", {
      //         props: {
      //             listData: params.row.wafHeadersNotExist.split("\n").filter(e => e.length > 0),
      //             maxShow: "5",
      //             title: vm.$i18n.t("wafrules.wafHeadersNotExist"),
      //             width: "350"
      //         }
      //     });
      // },
      validate: [],
      placeholder: 'user-agent\nhost',
    },

    {
      searchViews: ['WafRules'],
      key: 'usedByFQDNConfigLength',
      title: 'usedByFQDNConfigLength',
      showInTable: false,
      withForm: false,
      minWidth: 200,
      // render: (h, params) => {
      //     return h("span", params.row.usedByFQDNConfigLength);
      // },
      // exportOptions: { canExport: false, callback: value => value },
      sortable: false,
    },
  ]
}
