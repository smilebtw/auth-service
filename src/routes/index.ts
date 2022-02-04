import express from 'express'
import user from './api/user'

const routes = express.Router()

user(routes)


export default routes
