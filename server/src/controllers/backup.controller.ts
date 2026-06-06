import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

export const backup = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deposits = await prisma.deposit.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      totalRecords: deposits.length,
      data: deposits,
    }

    const filename = `sunshine-backup-${new Date().toISOString().slice(0, 10)}.json`
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.json(backupData)
  } catch (err) {
    next(err)
  }
}

export const importData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body

    if (!Array.isArray(data) || data.length === 0) {
      res.status(400).json({
        error: 'Invalid data format. Expected { data: [...] } with at least one record.',
      })
      return
    }

    const created = await prisma.deposit.createMany({
      data: data.map((d: any) => ({
        transactionId: d.transactionId,
        fullName: d.fullName,
        phoneNumber: d.phoneNumber,
        itemType: d.itemType,
        bottlesTaken: d.bottlesTaken,
        pricePerBottle: d.pricePerBottle ?? null,
        depositPerBottle: d.depositPerBottle ?? 50,
        totalDeposit:
          d.totalDeposit ?? (d.depositPerBottle ?? 50) * d.bottlesTaken,
        amountPaid: d.amountPaid ?? null,
        returned: d.returned ?? false,
        returnedDate: d.returnedDate ? new Date(d.returnedDate) : null,
        notes: d.notes ?? null,
        regularCustomer: d.regularCustomer ?? false,
        policyExplained: d.policyExplained ?? false,
        createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
      })),
      skipDuplicates: true,
    })

    res.status(201).json({
      success: true,
      imported: created.count,
    })
  } catch (err) {
    next(err)
  }
}
