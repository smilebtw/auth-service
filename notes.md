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

## Todo
[] JWT (Sign, Verify)