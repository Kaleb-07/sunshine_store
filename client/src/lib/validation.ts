// Client-side validation utilities

export type ValidationResult = {
  valid: boolean
  error: string | null
}

export const validateCustomerName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' }
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' }
  }
  if (name.length > 100) {
    return { valid: false, error: 'Name is too long' }
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { valid: false, error: 'Name can only contain letters and spaces' }
  }
  return { valid: true, error: null }
}

export const validateEthiopianPhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, error: 'Phone number is required' }
  }
  // Ethiopian phone format: 09XXXXXXXX, 07XXXXXXXX, or +251XXXXXXXXX
  if (!/^(09|07|\+251)\d{8,9}$/.test(phone.replace(/\s/g, ''))) {
    return { valid: false, error: 'Invalid phone number format (use 09XXXXXXXX or 07XXXXXXXX)' }
  }
  return { valid: true, error: null }
}

export const validateQuantity = (quantity: number | ''): ValidationResult => {
  if (quantity === '' || quantity === 0) {
    return { valid: false, error: 'Quantity is required' }
  }
  if (quantity < 1) {
    return { valid: false, error: 'Quantity must be at least 1' }
  }
  if (quantity > 1000) {
    return { valid: false, error: 'Quantity is too large' }
  }
  if (!Number.isInteger(quantity)) {
    return { valid: false, error: 'Quantity must be a whole number' }
  }
  return { valid: true, error: null }
}

export const validatePrice = (price: number | ''): ValidationResult => {
  if (price === '') return { valid: true, error: null } // Optional field
  if (price < 0) {
    return { valid: false, error: 'Price cannot be negative' }
  }
  return { valid: true, error: null }
}

export const validateDeposit = (deposit: number): ValidationResult => {
  if (deposit < 0) {
    return { valid: false, error: 'Deposit cannot be negative' }
  }
  return { valid: true, error: null }
}

export const validateAmountPaid = (amount: number | ''): ValidationResult => {
  if (amount === '') return { valid: true, error: null } // Optional field
  if (amount < 0) {
    return { valid: false, error: 'Amount cannot be negative' }
  }
  return { valid: true, error: null }
}

export const validateNotes = (notes: string): ValidationResult => {
  if (notes.length > 500) {
    return { valid: false, error: 'Notes are too long (max 500 characters)' }
  }
  return { valid: true, error: null }
}

// Legacy exports for backward compatibility
export const validateFullName = validateCustomerName
export const validatePhoneNumber = validateEthiopianPhone
