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