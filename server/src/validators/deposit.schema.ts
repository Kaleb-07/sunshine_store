import { z } from 'zod'

// Validation schema for creating deposits
export const createDepositSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  phoneNumber: z
    .string()
    .regex(/^(09|07|\+251)\d{8,9}$/, 'Invalid Ethiopian phone number'),
  
  items: z
    .array(
      z.object({
        itemType: z.string().min(1, 'Item type is required'),
        quantity: z
          .number()
          .int('Quantity must be a whole number')
          .min(1, 'Quantity must be at least 1')
          .max(1000, 'Quantity is too large'),
        pricePerBottle: z
          .number()
          .min(0, 'Price cannot be negative')
          .optional(),
        depositPerBottle: z
          .number()
          .min(0, 'Deposit cannot be negative')
          .default(50),
      })
    )
    .min(1, 'At least one item is required')
    .max(50, 'Too many items'),
  
  amountPaid: z
    .number()
    .min(0, 'Amount paid cannot be negative')
    .optional(),
  
  policyExplained: z.boolean(),
  
  notes: z
    .string()
    .max(500, 'Notes are too long')
    .optional(),
  
  regularCustomer: z.boolean().optional().default(false),
})

// Validation schema for marking items as returned
export const markReturnedSchema = z.object({
  returned: z.boolean(),
  transactionId: z.string().uuid('Invalid transaction ID').optional(),
})

export type CreateDepositInput = z.infer<typeof createDepositSchema>
export type MarkReturnedInput = z.infer<typeof markReturnedSchema>
