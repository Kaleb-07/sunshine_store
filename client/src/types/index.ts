export type LineItem = {
  itemType: string
  quantity: number | ''
  pricePerBottle: number | ''
  depositPerBottle: number
}

export type FormData = {
  fullName: string
  phoneNumber: string
  items: LineItem[]
  notes: string
  amountPaid: number | ''
  policyExplained: boolean
  regularCustomer: boolean
}

export type Deposit = {
  id: string
  transactionId: string
  fullName: string
  phoneNumber: string
  itemType: string
  bottlesTaken: number
  pricePerBottle?: number
  depositPerBottle: number
  totalDeposit: number
  amountPaid?: number
  returned: boolean
  returnedDate?: string
  notes?: string
  regularCustomer: boolean
  createdAt: string
}

export type GroupedRow = {
  key: string
  ids: string[]
  transactionId?: string
  fullName: string
  phoneNumber: string
  totalBottles: number
  totalItemCost: number
  totalDeposit: number
  amountPaid: number
  returned: boolean
  returnedDate?: string
  createdAt?: string
  regularCustomer: boolean
  notes?: string
  items: {
    id: string
    itemType: string
    bottlesTaken: number
    pricePerBottle: number
    depositPerBottle: number
    totalDeposit: number
    itemCost: number
  }[]
}

export type Stats = {
  totalActive: number
  totalActiveDeposit: number
  overdueCount: number
  returnedToday: number
  totalTransactions: number
}