import express, { Request, Response } from "express"
import { CreateTaskBody, UpdateTaskBody } from "../types/task"
import pool from "../db"

const router = express.Router()

router.get("/", async (_req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM tasks")
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/', async (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
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

router.put("/:id", async (req: Request<{ id: string }, {}, UpdateTaskBody>, res: Response) => {
    const { id } = req.params
    const { title, description, completed } = req.body

    try {
        const { rows } = await pool.query("UPDATE tasks SET title=$1, description=$2, completed=$3 WHERE id=$4 RETURNING *", [title, description, completed, id])

        if (rows[0] === undefined) {
            return res.status(404).json({ error: "Task was not found"})
        }

        res.status(200).json(rows[0])
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const { rows } = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id])

        if (rows[0] === undefined) {
            return res.status(404).json({ error: "Task was not found" })
        }

        res.status(204).send()
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

export default router;