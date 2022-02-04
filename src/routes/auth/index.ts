import type {Response, Request, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

type Middleware = (req:Request, res:Response, next:NextFunction) => any | never

export const verifyAuth = (middleware:Middleware) => {
    return (req:Request, res:Response, next:NextFunction) => {
        const {authorization} = req.headers
        // jwt.verify(authorization, '12345')
        if(authorization == 'teste') {
            middleware(req,res,next) 
        }
        else res.status(401).json({
            error:{
                message:"Unauthorized user"
            }
        })
    }
}