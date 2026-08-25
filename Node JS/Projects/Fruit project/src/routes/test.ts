import { DBType } from '../database/db'
import { Express, Router } from 'express'

const testRouter = Router()

export const getTestRoutes = (db: DBType) => {
    
    testRouter.delete('/data', (req, res) => {
        db.fruits = []
        res.sendStatus(204)
    })

    return testRouter
}