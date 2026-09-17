import next from 'next'
import express from 'express'
import { createServer } from 'http'

const app = next({dev:process.env.NODE_ENV !== 'production'})
const handle = app.getRequestHandler()

app.prepare().then(()=>{
    const server = express()
    const httpServer = createServer(server)
    server.all('/*splat',(req,res)=>{
        handle(req,res)
    })
    httpServer.listen(3000,()=>{
        console.log("server running on port 3000")
    })
}).catch((error)=>{console.log('Something went wrong',error)})