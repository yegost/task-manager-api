import express from 'express'
import pool from "./db"
import router from './routes/tasks';

const app = express();

app.use(express.json())

const PORT = process.env.PORT || 3000

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api/tasks', router)

app.listen(PORT, async () => {
    const { rows } = await pool.query('SELECT NOW()')
    console.log(rows[0])
    console.log(`Server running on http://localhost:${PORT}`)
})