import { Request, Response, Express, Router } from 'express'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../models/requests/types'
import { CreateFruitModel } from '../models/requests/CreateFruitModel'
import { UpdateFruitModel } from '../models/requests/UpdateFruitModel'
import { GetFruitsQueryModel } from '../models/requests/GetFruitsQueryModel'
import { FruitViewModel } from '../models/response/FruitViewModel'
import * as FruitMapper from '../models/mapper/FruitMapper'
import { URIParamsFruitId } from '../models/requests/URIParamsFruitId'
import { DBType } from '../database/db'

export const FruitRouter = Router()

export const getFruitsRoutes = (db: DBType) => {
    FruitRouter.get('/', (req: RequestWithQuery<GetFruitsQueryModel>, res: Response<FruitViewModel[]>) => {
        const fruitName = req.query.name
        if (fruitName){
            const found = db.fruits.find(f => f.name === fruitName)
            if (found){
                res.json([FruitMapper.fruitToViewModel(found)])
            } else {
                res.sendStatus(404)
            }
        } else {
            res.json(db.fruits.map(FruitMapper.fruitToViewModel))
        }
    })

    FruitRouter.get('/:id', (req: RequestWithParams<URIParamsFruitId>, res: Response<FruitViewModel>) => {
        if (!req.params.id){
            res.sendStatus(400)
            return
        }
        const foundFruit = db.fruits.find(f => f.id === +req.params.id)
        if (!foundFruit){
            res.sendStatus(404)
            return
        }
        res.json(FruitMapper.fruitToViewModel(foundFruit))
    })

    FruitRouter.post('/', (req: RequestWithBody<CreateFruitModel>, res: Response<FruitViewModel>) => {
        const newFruit = FruitMapper.createFruitModelToFruit(req.body)
        newFruit.id = +(new Date())
        if (newFruit.name === '' || newFruit.amount < 0){
            res.sendStatus(400)
            return
        }
        if (db.fruits.find(f => f.name === newFruit.name)){
            res.sendStatus(400)
            return
        }
        db.fruits.push(newFruit)
        res.status(201)
        res.json(FruitMapper.fruitToViewModel(newFruit))
    })

    FruitRouter.put('/:id', (req: RequestWithParamsAndBody<URIParamsFruitId, UpdateFruitModel>, res: Response<FruitViewModel>) => {
        if (!req.params.id){
            res.sendStatus(400)
            return
        }
        const newFruit = FruitMapper.updateFruitModelToFruit(req.body)
        newFruit.id = +req.params.id
        if (newFruit.name === '' || newFruit.amount < 0){
            res.sendStatus(400)
            return
        }
        let fruitIndex = db.fruits.findIndex(f => f.id === +req.params.id)
        if (fruitIndex === -1){
            res.sendStatus(404)
            return
        } else {
            db.fruits[fruitIndex] = newFruit
            res.json(FruitMapper.fruitToViewModel(newFruit))
            return
        }    
    })

    FruitRouter.delete('/:id', (req: RequestWithParams<URIParamsFruitId>, res: Response) => {
        if (!req.params.id){
            res.sendStatus(400)
            return
        }
        const id = +req.params.id
        const found = db.fruits.find(f => f.id === id)
        if (found){
            db.fruits = db.fruits.filter(f => f !== found)
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(404)
            return
        }
    })

    return FruitRouter
}