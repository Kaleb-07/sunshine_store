import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

// GET /api/stats
export const getStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // All deposits
    const all = await prisma.deposit.findMany({
      select: {
        returned: true,
        totalDeposit: true,
        createdAt: true,
        returnedDate: true,
        transactionId: true,
      },
    })

    // Group by transactionId to count transactions not rows
    const txMap = new Map<string, typeof all>()
    for (const d of all) {
      const key = d.transactionId
      const existing = txMap.get(key) ?? []
      existing.push(d)
      txMap.set(key, existing)
    }

    let totalActive = 0
    let totalActiveDeposit = 0
    let overdueCount = 0
    let returnedToday = 0
    const totalTransactions = txMap.size

    for (const [, items] of txMap) {
      const allReturned = items.every((i: typeof all[0]) => i.returned)
      const deposit = items.reduce((s: number, i: typeof all[0]) => s + i.totalDeposit, 0)
      const createdAt = items[0].createdAt
      const returnedDate = items[0].returnedDate

      if (!allReturned) {
        totalActive++
        totalActiveDeposit += deposit

        // Days since creation
        const diffMs = Date.now() - new Date(createdAt).getTime()
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        
        // Debug log
        console.log(`Transaction ${items[0].transactionId}: ${days} days old, overdue: ${days >= 1}`)
        
        // Overdue if 1 or more days old and not returned
        if (days >= 1) overdueCount++
      }

      // Returned today
      if (
        allReturned &&
        returnedDate &&
        new Date(returnedDate) >= today &&
        new Date(returnedDate) < tomorrow
      ) {
        returnedToday++
      }
    }

    res.json({
      totalActive,
      totalActiveDeposit,
      overdueCount,
      returnedToday,
      totalTransactions,
    })
  } catch (err) {
    next(err)
  }
}