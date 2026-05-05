import express from 'express'
import pool from "./db"

const app = express();

const PORT = process.env.PORT || 3000

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.listen(PORT, async () => {
    const { rows } = await pool.query('SELECT NOW()')
    console.log(rows[0])
    console.log(`Server running on http://localhost:${PORT}`)
})