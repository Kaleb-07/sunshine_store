export type CreateDepositInput = {
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
}

export type MarkReturnedInput = {
  returned: boolean
  transactionId?: string
}