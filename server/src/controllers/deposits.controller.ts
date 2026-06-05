import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { randomUUID } from 'crypto'

// GET /api/deposits
export const getAllDeposits = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deposits = await prisma.deposit.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(deposits)
  } catch (err) {
    next(err)
  }
}

// POST /api/deposits
export const createDeposit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      fullName,
      phoneNumber,
      items,
      amountPaid,
      policyExplained,
      notes,
      regularCustomer,
    } = req.body

    const transactionId = randomUUID()

    const records = items.map((item: {
      itemType: string
      quantity: number
      pricePerBottle?: number
      depositPerBottle: number
    }) => ({
      transactionId,
      fullName,
      phoneNumber,
      itemType: item.itemType,
      bottlesTaken: item.quantity,
      pricePerBottle: item.pricePerBottle ?? null,
      depositPerBottle: item.depositPerBottle,
      totalDeposit: item.depositPerBottle * item.quantity,
      amountPaid: amountPaid ?? null,
      policyExplained,
      notes: notes ?? null,
      regularCustomer: regularCustomer ?? false,
    }))

    await prisma.deposit.createMany({ data: records })

    res.status(201).json({
      success: true,
      count: records.length,
      transactionId,
    })
  } catch (err) {
    next(err)
  }
}