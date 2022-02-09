```ts
app.get('/test', async (req, res) => {
    const {username, password} = req.body as {username:string, password:string}
    const user = await database.user.create({
        data: {
            username,
            password,
        }
    }) 

    res.json(user)
})
```

## Custom Types
É uma forma de adicionar tipos personalizados para variáveis

Exemplo:
```ts
declare namespace express {
    export interface application {
        db: import('./database').database
    }
}
```

## Todo
[] JWT (Sign, Verify)


```ts
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
```