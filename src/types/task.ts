export interface CreateTaskBody {
    title: string
    description: string
}

export interface UpdateTaskBody {
    title: string
    description: string
    completed: boolean
}