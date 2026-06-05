import { Router } from 'express'
import { validate } from '../middleware/validate'
import {
  getAllDeposits,
  createDeposit,
} from '../controllers/deposits.controller'
import { createDepositSchema } from '../validators/deposit.schema'

const router = Router()

router.get('/', getAllDeposits)
router.post('/', validate(createDepositSchema), createDeposit)

export default router