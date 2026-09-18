import next from 'next'
import express from 'express'
import { createServer } from 'http'
import {Server} from 'socket.io'

const app = next({dev:process.env.NODE_ENV !== 'production'})
const handle = app.getRequestHandler()

app.prepare().then(()=>{
    const server = express()
    const httpServer = createServer(server)
    const io = new Server(httpServer)
    server.all('/*splat',(req,res)=>{
        handle(req,res)
    })
    httpServer.listen(3000,()=>{
        console.log("server running on port 3000")
    })
    io.on('connection',(socket)=>{
        console.log('new user connected',socket.id)
    })
}).catch((error)=>{console.log('Something went wrong',error)})