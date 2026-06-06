import { Router } from 'express'
import { backup, importData } from '../controllers/backup.controller'

const router = Router()

router.get('/', backup)
router.post('/import', importData)

export default router
