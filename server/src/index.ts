import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' })
})

// Routes (uncomment as you build them)
// import depositsRouter from './routes/deposits'
// app.use('/api/deposits', depositsRouter)

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})

export default app