import axios from 'axios'
import type { Deposit, Stats } from '../types'

const api = axios.create({
  baseURL: '/api',
})

// ── Deposits ──────────────────────────────────────────
export const getDeposits = async (): Promise<Deposit[]> => {
  const { data } = await api.get('/deposits')
  return data
}

export const createDeposit = async (payload: {
  fullName: string
  phoneNumber: string
  items: {
    itemType: string
    quantity: number
    pricePerBottle?: number
    depositPerBottle: number
  }[]
  amountPaid?: number
  policyExplained: boolean
  notes?: string
  regularCustomer?: boolean
}) => {
  const { data } = await api.post('/deposits', payload)
  return data
}

export const markReturned = async (
  id: string,
  returned: boolean,
  transactionId?: string
) => {
  const { data } = await api.patch(`/deposits/${id}/return`, {
    returned,
    transactionId,
  })
  return data
}

// ── Stats ─────────────────────────────────────────────
export const getStats = async (): Promise<Stats> => {
  const { data } = await api.get('/stats')
  return data
}

// ── Customers ─────────────────────────────────────────
export const searchCustomers = async (q: string): Promise<
  { fullName: string; phoneNumber: string }[]
> => {
  const { data } = await api.get('/customers/search', { params: { q } })
  return data
}

// ── Export / Backup / Import ──────────────────────────
export const downloadExportCSV = async () => {
  const { data } = await api.get('/export/csv', {
    responseType: 'blob',
  })
  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `deposits-export-${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const downloadBackup = async () => {
  const { data } = await api.get('/backup')
  return data
}

export const importData = async (payload: { data: any[] }) => {
  const { data } = await api.post('/backup/import', payload)
  return data
}