export const generateSearchFilter = (options, formInputs) => {
  options.filters = []
  for (const i in formInputs) {
    if (formInputs[i].ref.value) {
      const labelValue = formInputs[i].ref.value
      let type = formInputs[i].type

      if (type !== 'range' && type !== 'date' && type !== 'select') {
        type = 'string'
      }
      // searchFilterOptions.value.filters = []
      options.filters.unshift({
        key: formInputs[i].key,
        type,
        value: formInputs[i].ref.value,
        tag: `${formInputs[i].title}: ${labelValue}`,
      })
    }
  }
  return options
}
