import { h } from 'vue'
import VFlexTableSortColumn from '/@src/components/base/table/VFlexTableSortColumn.vue'

export const columnBuilder = (appliedSelectedColumn, columnDefaults, t) => {
  const columns = {}
  for (let index = 0; index < columnDefaults.length; index++) {
    console.log(appliedSelectedColumn.includes(columnDefaults[index].name))
    if (appliedSelectedColumn.includes(columnDefaults[index].name)) {
      if (typeof columnDefaults[index].value === 'string') {
        ;(columns as any)[columnDefaults[index].name] = t(columnDefaults[index].value)
      } else if (typeof columnDefaults[index].value === 'object') {
        ;(columns as any)[columnDefaults[index].name] = {
          ...(columnDefaults[index].value as any),
          value: t(columnDefaults[index].value.value),
        }
      }
    }
  }
  return columns
}

export const eventLogColumnBuilder = (appliedSelectedColumn, columnDefaults, t) => {
  const columns = {}
  for (let index = 0; index < columnDefaults.length; index++) {
    if (appliedSelectedColumn.includes(columnDefaults[index].name)) {
      if (typeof columnDefaults[index].value === 'string') {
        ;(columns as any)[columnDefaults[index].name] = {
          renderHeader: () =>
            h(VFlexTableSortColumn, {
              label: t(columnDefaults[index].value),
              id: columnDefaults[index].name,
            }),
        }
      }
    }
  }
  return columns
}
