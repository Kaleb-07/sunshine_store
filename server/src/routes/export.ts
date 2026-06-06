import { Router } from 'express'
import { exportCSV } from '../controllers/export.controller'

const router = Router()

router.get('/csv', exportCSV)

export default router
