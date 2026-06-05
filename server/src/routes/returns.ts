import { Router } from 'express'
import { validate } from '../middleware/validate'
import { markReturned } from '../controllers/returns.controller'
import { markReturnedSchema } from '../validators/deposit.schema'

const router = Router()

router.patch('/:id/return', validate(markReturnedSchema), markReturned)

export default router