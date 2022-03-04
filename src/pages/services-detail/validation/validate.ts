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
    if (!(form_input.originPort.value > 0 && form_input.originPort.value < 65535)) {
      form_input.originPort.error = true
      validate = false
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

  if (form_input.scheme.value.length === 0) {
    form_input.scheme.error = true
    validate = false
  }

  if (form_input.scheme.value.includes('http') && form_input.httpPort.value.length == 0) {
    form_input.httpPort.error = true
    validate = false
  }

  if (
    form_input.scheme.value.includes('https') &&
    form_input.httpsPort.value.length == 0
  ) {
    form_input.httpsPort.error = true
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
  form_input.setCustomHostHeader.error = false
  form_input.customHostHeader.error = false
  form_input.websocketPath.error = false
  form_input.cusFollowCachePath.error = false
  form_input.cusFollowCacheFile.error = false

  if (!form_input.setCustomHostHeader.value) {
    form_input.setCustomHostHeader.error = true
    validate = false
  }
  if (form_input.setCustomHostHeader.value == 'on') {
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
