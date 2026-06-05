import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

// GET /api/customers/search?q=
export const searchCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const q = String(req.query.q ?? '').trim()

    if (q.length < 2) {
      res.json([])
      return
    }

    const results = await prisma.deposit.findMany({
      where: {
        OR: [
          { fullName: { contains: q } },
          { phoneNumber: { contains: q } },
        ],
      },
      select: {
        fullName: true,
        phoneNumber: true,
      },
      distinct: ['fullName', 'phoneNumber'],
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    res.json(results)
  } catch (err) {
    next(err)
  }
}