import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

// PATCH /api/deposits/:id/return
export const markReturned = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { returned, transactionId } = req.body

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // If transactionId provided → update all records in that transaction
    if (transactionId) {
      await prisma.deposit.updateMany({
        where: { transactionId },
        data: {
          returned,
          returnedDate: returned ? today : null,
        },
      })
    } else {
      await prisma.deposit.update({
        where: { id },
        data: {
          returned,
          returnedDate: returned ? today : null,
        },
      })
    }

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}