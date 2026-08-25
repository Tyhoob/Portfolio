import express from 'express'
import { getFruitsRoutes as getFruitsRouter } from './routes/fruits'
import { getTestRoutes as getTestRouter } from './routes/test'
import { db } from './database/db'

export const app = express()

const jsonBodyMiddleWare = express.json()
app.use(jsonBodyMiddleWare)


app.use('/fruits',getFruitsRouter(db))
app.use('/__test__',getTestRouter(db))
