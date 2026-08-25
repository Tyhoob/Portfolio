import express, { type NextFunction, type Request, type Response } from 'express'
import { createDatabasePool } from './config/dbConnector.js'
import { PlanetRepository } from './repositories/planetRepository.js'
import { PlanetController } from './router/planetRouter.js'
import type { HttpError } from './exception/httpError.js'

export const app = express()

const db = await createDatabasePool()
const planetRepository = new PlanetRepository(db)
const planetController = new PlanetController(planetRepository)

app.use(express.json())
app.use('/planets', planetController.router)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    const status = err.statusCode || 500;
    const message = err.message || 'Внутренняя ошибка сервера';

    res.status(status).json({
        message,
        errors: err.errors
    })
})