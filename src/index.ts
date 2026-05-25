import express from 'express'
import pool from "./db"
import router from './routes/tasks';
import helmet from 'helmet';
import cors from "cors"
import { rateLimit } from "express-rate-limit"

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: "You have reached the limit of requests. Try again later."
})

const app = express();

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(limiter)

const PORT = process.env.PORT || 3000

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api/tasks', router)

app.listen(PORT, async () => {
    const { rows } = await pool.query('SELECT NOW()')
    console.log(rows[0])
    console.log(`Server running on http://localhost:${PORT}`)
})