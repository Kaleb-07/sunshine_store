import type { GroupedRow } from '../types'

function escapeCSV(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function groupedRowsToCSV(rows: GroupedRow[]): string {
  const headers = [
    'Transaction ID',
    'Date',
    'Customer Name',
    'Phone Number',
    'Drinks',
    'Total Bottles',
    'Total Item Cost (Br)',
    'Total Deposit (Br)',
    'Amount Paid (Br)',
    'Still Owed (Br)',
    'Refund On Return (Br)',
    'Days',
    'Returned',
    'Returned Date',
    'Regular Customer',
    'Notes',
  ]

  const csvRows = rows.map((r) => {
    const drinks = r.items.map((i) => `${i.itemType} x${i.bottlesTaken}`).join('; ')
    const stillOwes = Math.max(0, r.totalItemCost + r.totalDeposit - r.amountPaid)
    const refundOnReturn = Math.max(0, r.amountPaid - r.totalItemCost)
    const days = r.createdAt
      ? Math.floor(
          (Date.now() - new Date(r.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0

    return [
      r.transactionId || '',
      r.createdAt || '',
      r.fullName,
      r.phoneNumber,
      drinks,
      r.totalBottles,
      r.totalItemCost,
      r.totalDeposit,
      r.amountPaid,
      stillOwes,
      refundOnReturn,
      days,
      r.returned ? 'Yes' : 'No',
      r.returnedDate || '',
      r.regularCustomer ? 'Yes' : 'No',
      r.notes || '',
    ]
      .map(escapeCSV)
      .join(',')
  })

  return [headers.join(','), ...csvRows].join('\n')
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadJSON(data: unknown, filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
