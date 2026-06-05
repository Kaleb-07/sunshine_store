import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Deposit, GroupedRow } from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Group deposit records by transaction ID
export function groupRecords(deposits: Deposit[]): GroupedRow[] {
  const grouped = new Map<string, GroupedRow>()

  deposits.forEach((deposit) => {
    const key = deposit.transactionId || deposit.id
    
    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        ids: [deposit.id],
        transactionId: deposit.transactionId,
        fullName: deposit.fullName,
        phoneNumber: deposit.phoneNumber,
        totalBottles: deposit.bottlesTaken,
        totalItemCost: (deposit.pricePerBottle || 0) * deposit.bottlesTaken,
        totalDeposit: deposit.totalDeposit,
        amountPaid: deposit.amountPaid || 0,
        returned: deposit.returned,
        returnedDate: deposit.returnedDate,
        createdAt: deposit.createdAt,
        regularCustomer: deposit.regularCustomer,
        notes: deposit.notes,
        items: [
          {
            id: deposit.id,
            itemType: deposit.itemType,
            bottlesTaken: deposit.bottlesTaken,
            pricePerBottle: deposit.pricePerBottle || 0,
            depositPerBottle: deposit.depositPerBottle,
            totalDeposit: deposit.totalDeposit,
            itemCost: (deposit.pricePerBottle || 0) * deposit.bottlesTaken,
          },
        ],
      })
    } else {
      const existing = grouped.get(key)!
      existing.ids.push(deposit.id)
      existing.totalBottles += deposit.bottlesTaken
      existing.totalItemCost += (deposit.pricePerBottle || 0) * deposit.bottlesTaken
      existing.totalDeposit += deposit.totalDeposit
      existing.items.push({
        id: deposit.id,
        itemType: deposit.itemType,
        bottlesTaken: deposit.bottlesTaken,
        pricePerBottle: deposit.pricePerBottle || 0,
        depositPerBottle: deposit.depositPerBottle,
        totalDeposit: deposit.totalDeposit,
        itemCost: (deposit.pricePerBottle || 0) * deposit.bottlesTaken,
      })
    }
  })

  return Array.from(grouped.values()).sort((a, b) => {
    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  })
}

// Calculate days since deposit was created
export function getDaysSince(
  createdAt?: string,
  returned?: boolean,
  returnedDate?: string
): number {
  if (!createdAt) return 0
  
  const endDate = returned && returnedDate ? new Date(returnedDate) : new Date()
  const startDate = new Date(createdAt)
  const diffMs = endDate.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  return Math.max(0, diffDays)
}
