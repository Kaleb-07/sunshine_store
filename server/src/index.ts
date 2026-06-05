import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { errorHandler } from './middleware/errorHandler'
import depositsRouter from './routes/deposits'
import returnsRouter from './routes/returns'
import customersRouter from './routes/customers'
import statsRouter from './routes/stats'

// Load environment variables - try both locations
dotenv.config({ path: path.join(__dirname, '.env') })
dotenv.config({ path: path.join(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ─────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.json())

// ── Routes ─────────────────────────────────────────────
app.use('/api/deposits', depositsRouter)
app.use('/api/deposits', returnsRouter)   // PATCH /api/deposits/:id/return
app.use('/api/customers', customersRouter)
app.use('/api/stats', statsRouter)

// ── Health check ───────────────────────────────────────
app.get('/api/health', (_: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  })
})

// ── Error handler (must be last) ───────────────────────
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`✅ Server running → http://localhost:${PORT}`)
  console.log(`📦 Environment  → ${process.env.NODE_ENV}`)
  console.log(`🌐 Client URL   → ${process.env.CLIENT_URL}`)
})

export default app