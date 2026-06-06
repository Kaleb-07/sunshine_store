import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

export const exportCSV = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deposits = await prisma.deposit.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const headers = [
      'Transaction ID',
      'Date',
      'Customer Name',
      'Phone Number',
      'Item Type',
      'Bottles Taken',
      'Price Per Bottle',
      'Deposit Per Bottle',
      'Total Deposit',
      'Amount Paid',
      'Returned',
      'Returned Date',
      'Notes',
      'Regular Customer',
    ]

    const rows = deposits.map((d) => [
      d.transactionId,
      d.createdAt.toISOString(),
      d.fullName,
      d.phoneNumber,
      d.itemType,
      d.bottlesTaken,
      d.pricePerBottle ?? '',
      d.depositPerBottle,
      d.totalDeposit,
      d.amountPaid ?? '',
      d.returned ? 'Yes' : 'No',
      d.returnedDate ? d.returnedDate.toISOString() : '',
      d.notes ?? '',
      d.regularCustomer ? 'Yes' : 'No',
    ])

    const csv = [
      headers.join(','),
      ...rows.map((r) =>
        r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    const filename = `deposits-export-${new Date().toISOString().slice(0, 10)}.csv`
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(csv)
  } catch (err) {
    next(err)
  }
}
