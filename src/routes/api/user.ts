import type {Response, Request, NextFunction, Router} from 'express'
import {verifyAuth} from '../auth'

type createUserBody = {
    username:string;
    password:string;
    email:string;
}

const createUser = (req:Request, res:Response) => {
    const {username, email, password} = req.body as createUserBody
    res.send('ok')
}

const user = (routes:Router) => {
    routes.use('/create', verifyAuth(createUser))
}

export default user
