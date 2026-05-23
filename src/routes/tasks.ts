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
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1", [id])

        if (rows[0] === undefined) {
            return res.status(404).json({ error: "No task with that id"})
        }

        res.status(200).json(rows[0])
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

export default router;