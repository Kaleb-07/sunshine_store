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

    const createdRecords = await prisma.deposit.createMany({ data: records })

    // Fetch the created records for receipt
    const deposits = await prisma.deposit.findMany({
      where: { transactionId },
      orderBy: { createdAt: 'asc' },
    })

    res.status(201).json({
      success: true,
      count: createdRecords.count,
      transactionId,
      receipt: {
        transactionId,
        fullName,
        phoneNumber,
        items: deposits.map((d) => ({
          itemType: d.itemType,
          quantity: d.bottlesTaken,
          pricePerBottle: d.pricePerBottle,
          depositPerBottle: d.depositPerBottle,
          itemTotal: (d.pricePerBottle || 0) * d.bottlesTaken,
          depositTotal: d.totalDeposit,
        })),
        totalAmount: deposits.reduce((s, d) => s + (d.pricePerBottle || 0) * d.bottlesTaken, 0),
        totalDeposit: deposits.reduce((s, d) => s + d.totalDeposit, 0),
        amountPaid: amountPaid ?? 0,
        regularCustomer,
        notes: notes ?? '',
        createdAt: deposits[0].createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}