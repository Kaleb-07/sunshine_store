import type { FormData, LineItem } from '../../types'

export const ITEM_TYPES = [
  'GEORGIS', 'HABESHA', 'WALIA', 'META',
  'HEINEKEN', 'DASHEN', 'BEDELE', 'HARAR',
  'CASTEL', 'RAYA', 'ARADA', 'ZEBIDAR',
  'JANO', 'HAKIM STOUT', 'COCA', 'PEPSI', 'AMBO',
]

export const createEmptyItem = (): LineItem => ({
  itemType: '',
  quantity: '',
  pricePerBottle: '',
  depositPerBottle: 50,
})

export const initialFormData: FormData = {
  fullName: '',
  phoneNumber: '',
  items: [createEmptyItem()],
  notes: '',
  amountPaid: '',
  policyExplained: false,
  regularCustomer: false,
}