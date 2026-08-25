import type { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { HttpError } from "../exception/httpError.js"

export function checkValidation(req: Request, res: Response, next: NextFunction){
    const result = validationResult(req)
        if (!result.isEmpty()){
            return next(new HttpError(result.array(), 400))
        }
    next()
}