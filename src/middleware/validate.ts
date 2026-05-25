import { z } from "zod"
import { Request, Response, NextFunction } from "express"

const CreateTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1)
})

export const validateCreateTask = (req: Request, res: Response, next: NextFunction) => {
    const result = CreateTaskSchema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json({ error: result.error.issues })
    }

    next()
}

