// Position
function renderPosition(data: any) {
  return `<span class="light-text">${data}</span>`
}

// Status
function renderStatus(data: any) {
  return `
            <div class="status is-${data}">
                <i aria-hidden="true" class="fas fa-circle"></i>
                <span class="is-capitalize">${data}</span>
            </div>
        `
}

// Button
function renderButton(data: any, cell: any, row: any) {
  return `<div class="has-text-right"><button class="v-button is-dark-outlined" data-row="${row.dataIndex}"><i aria-hidden="true" class="fas fa-plus" data-row="${row.dataIndex}"></i></button></div>`
}

// View
function renderView(data: any, cell: any, row: any) {
  return `<div class="has-text-left"><button class="v-button is-dark-outlined" data-view="${row.dataIndex}"><i aria-hidden="true" class="fas fa-eye" data-row="${row.dataIndex}"></i></button></div>`
}

export const policyOptions = {
  searchable: false,
  perPageSelect: false,
  perPage: 5,
  columns: [
    { select: 0, render: renderView, sortable: false },
    { select: 1, render: renderPosition },
    { select: 2, render: renderStatus },
    { select: 3, render: renderButton, sortable: false },
  ],
  data: {
    headings: ['View', 'Policy', 'Status', 'Add'],
    data: [],
  },
}
