// submit_data: in case need to do data validation before passing data to submission

export const validateEssentialForm = (submit_data: any, form_input: any) => {
  let validate = true
  form_input.serviceGroupName.error = false

  if (!form_input.serviceGroupName.value) {
    form_input.serviceGroupName.error = true
    validate = false
  }

  // if (form_input.tags.value.length === 0) {
  //   form_input.tags.error = true
  //   validate = false
  // }

  // if (!form_input.desc.value) {
  //   form_input.desc.error = true
  //   validate = false
  // }

  return {
    submit_data: submit_data,
    essentialData: form_input,
    status: validate,
  }
}

export const validateOriginForm = (submit_data: any, form_input: any) => {
  let validate = true
  form_input.originPort.error = false
  form_input.originsAddress.error = false
  form_input.httpPort.error = false
  form_input.httpsPort.error = false

  if (!form_input.useOriginPolicy.value) {
    if (form_input.originPort.value) {
      if (form_input.originPort.value < 0 || form_input.originPort.value > 65534) {
        form_input.originPort.error = true
        validate = false
      }
    }

    if (form_input.originsAddress.value.length == 0) {
      form_input.originsAddress.error = true
      validate = false
    }

    if (form_input.httpPort.value.length == 0) {
      form_input.httpPort.error = true
      validate = false
    }

    if (form_input.httpsPort.value.length == 0) {
      form_input.httpsPort.error = true
      validate = false
    }
  }

  return {
    submit_data: submit_data,
    originData: form_input,
    status: validate,
  }
}

export const validateSSLForm = (submit_data: any, form_input: any) => {
  let validate = true
  form_input.scheme.error = false
  form_input.httpPort.error = false
  form_input.httpsPort.error = false
  form_input.redirectHttpCode.error = false

  if (form_input.scheme.value.length > 0) {
    // Scheme - Http
    if (
      form_input.scheme.value.includes('http') &&
      form_input.httpPort.value.length == 0
    ) {
      form_input.httpPort.error = true
      validate = false
    }
    // Scheme - Https
    if (
      form_input.scheme.value.includes('https') &&
      form_input.httpsPort.value.length == 0
    ) {
      form_input.httpsPort.error = true
      validate = false
    }
    // Redirect Https
    if (form_input.redirecthttps.value && form_input.redirectHttpCode.value) {
      form_input.redirectHttpCode.error = true
      validate = false
    }
  } else {
    form_input.scheme.error = true
    validate = false
  }

  return {
    submit_data: submit_data,
    sslFormData: form_input,
    status: validate,
  }
}

export const validateCacheForm = (type: string, form_input: any) => {
  let validate = true
  form_input.cusCachepath.error = false
  form_input.cusCachefile.error = false
  form_input.forceCusCachePath.error = false
  form_input.forceCusCacheFile.error = false
  form_input.cusNoncachepath.error = false
  form_input.cusNonachefile.error = false

  switch (type) {
    case 'cache':
      if (form_input.cusCachepath.value.indexOf(' ') >= 0) {
        form_input.cusCachepath.error = true
        validate = false
      }
      if (form_input.cusCachefile.value.indexOf(' ') >= 0) {
        form_input.cusCachefile.error = true
        validate = false
      }
      if (form_input.forceCusCachePath.value.indexOf(' ') >= 0) {
        form_input.forceCusCachePath.error = true
        validate = false
      }
      if (form_input.forceCusCacheFile.value.indexOf(' ') >= 0) {
        form_input.forceCusCacheFile.error = true
        validate = false
      }
      break
    case 'nocache':
      if (form_input.cusNoncachepath.value.indexOf(' ') >= 0) {
        form_input.cusNoncachepath.error = true
        validate = false
      }
      if (form_input.cusNonachefile.value.indexOf(' ') >= 0) {
        form_input.cusNonachefile.error = true
        validate = false
      }
      break
  }

  return {
    cacheData: form_input,
    status: validate,
  }
}

export const validateAdvancedForm = (type: string, submit_data: any, form_input: any) => {
  let validate = true
  form_input.maxUploadSize.error = false
  // More Setting
  form_input.errorHtmlPageName.error = false
  form_input.customHostHeader.error = false
  form_input.websocketPath.error = false
  form_input.cusFollowCachePath.error = false
  form_input.cusFollowCacheFile.error = false

  if (type == 'advancedSetting' && form_input.maxUploadSize.value) {
    if (form_input.maxUploadSize.value < 1 || form_input.maxUploadSize.value > 100) {
      form_input.maxUploadSize.error = true
      validate = false
    }
  } else {
    form_input.maxUploadSize.error = true
    validate = false
  }
  // More Setting
  if (!form_input.errorHtmlPageName.value) {
    form_input.errorHtmlPageName.error = true
    validate = false
  }
  if (
    form_input.setCustomHostHeader.value &&
    form_input.setCustomHostHeader.value == 'on'
  ) {
    if (!form_input.customHostHeader.value) {
      form_input.customHostHeader.error = true
      validate = false
    }
  }
  if (form_input.websocketPath.value.indexOf(' ') >= 0) {
    form_input.websocketPath.error = true
    validate = false
  }
  if (form_input.cusFollowCachePath.value.indexOf(' ') >= 0) {
    form_input.cusFollowCachePath.error = true
    validate = false
  }
  if (form_input.cusFollowCacheFile.value.indexOf(' ') >= 0) {
    form_input.cusFollowCacheFile.error = true
    validate = false
  }

  return {
    submit_data: submit_data,
    advancedData: form_input,
    status: validate,
  }
}

export const validateDomainForm = (type: string, submit_data: any, form_input: any) => {
  let validate = true
  form_input.appProfileName.error = false
  form_input.description.error = false
  form_input.tags.error = false
  form_input.useSystemCert.error = false
  form_input.keypairname.error = false

  switch (type) {
    case 'add':
      if (!form_input.domain.value) {
        form_input.domain.error = true
        validate = false
      }
      break
    case 'edit':
      break
  }

  if (!form_input.useSystemCert.value) {
    if (!form_input.keypairname.value) {
      form_input.keypairname.error = true
      validate = false
    }
  }

  return {
    submit_data: submit_data,
    domainData: form_input,
    status: validate,
  }
}
