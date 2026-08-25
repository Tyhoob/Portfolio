import { Router, type Response} from "express";
import * as planetMapper from "../model/mapper/planetMapper.js";
import { body, param, query } from "express-validator";
import { checkValidation } from "../validation/inputValidationMiddleware.js";

import type { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../model/request/requestTypes.js";
import type { IPlanet } from "../model/base/planet.js";
import type { PlanetViewModel } from "../model/response/PlanetViewModel.js";
import type { addPlanetModel } from "../model/request/addPlanetModel.js";
import type { updatePlanetModel } from "../model/request/updatePlanetModel.js";
import type { URIParamId } from "../model/request/URIParamId.js";
import type { PlanetRepository } from "../repositories/planetRepository.js";


export class PlanetController{
    public router = Router()
    protected idValid = param('id').isInt({min: 1}).withMessage('ID should be a positive integer')
    protected BodyValid = [
        body('name').isString().withMessage('name should be a string').bail().trim().isLength({min: 3, max: 30}).withMessage('length must be between 3 and 30').bail(),
        body('age').isInt({min: 0}).withMessage('age should be a non-negative integer'),
        body('location').isString().withMessage('location should be a string').bail().trim().isLength({min: 3, max: 150}).withMessage('length must be between 3 and 150').bail(),
    ]

    constructor(private planetRepository: PlanetRepository){
        this.initRoutes()
    }

    private initRoutes() {
        this.router.get('/', query('location').optional().isString().withMessage('location must be a single query parameter').trim(), 
        checkValidation,
        async (req: RequestWithQuery<{location: string | undefined}>, res: Response<PlanetViewModel[]>) => {
            const foundPlanets = await this.planetRepository.findPlanets(req.query.location)
            console.log(req.query.location?.toString())
            res.json(foundPlanets.map(planetMapper.planetToViewModel))
        })

        this.router.get('/:id', 
            this.idValid, 
            checkValidation,
            async (req: RequestWithParams<URIParamId>, res: Response<PlanetViewModel>) => {
                const foundPlanet = await this.planetRepository.findPlanetById(+req.params.id)
                if (foundPlanet){
                    res.json(planetMapper.planetToViewModel(foundPlanet))
                } else {
                    res.sendStatus(404)
            }
        })

        this.router.post('/', 
            this.BodyValid,
            checkValidation,
            async (req: RequestWithBody<addPlanetModel>, res: Response<IPlanet>) => {
                const newPlanet = planetMapper.addPlanetModelToPlanet(req.body)
                const createdPlanet = await this.planetRepository.createPlanet(newPlanet)
                res.status(201)
                res.json(createdPlanet)
        })

        this.router.delete('/:id', 
            this.idValid, 
            checkValidation,
            async (req: RequestWithParams<URIParamId>, res: Response) => {
                const id = +req.params.id
                const result = await this.planetRepository.deletePlanet(id)
                if (result){
                    res.sendStatus(204)
                } else {
                    res.sendStatus(404)
                }
        })  

        this.router.put('/:id', 
            this.BodyValid,
            this.idValid,
            checkValidation,
            async (req: RequestWithParamsAndBody<URIParamId, updatePlanetModel>, res: Response<PlanetViewModel>) => {
                const id = +req.params.id
                const newPlanet = planetMapper.updatePlanetModelToPlanet(req.body)
                const result = await this.planetRepository.updatePlanet(id, newPlanet)
                if (result){
                    res.json(result)
                } else {
                    res.sendStatus(404)
                }
        })
    }
}
