import express from "express"
import { Router, Request, Response } from "express"
import pool from "../db"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM tasks")
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/', async (req: Request & {
    body: {
        title: string;
        description: string;
    }
}, res: Response) => {
    try {
        const { title, description} = req.body

        if (!title || !description) {
            return res.status(400).json({ error: "Missing required fields"})
        }

        const { rows } = await pool.query(
            `INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *`,
            [title, description]
        )
        res.status(201).json(rows[0])

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
})

export default router;