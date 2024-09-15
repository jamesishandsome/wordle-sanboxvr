import express, {
    type Application,
    type Request,
    type Response,
} from 'express'
import { createServer } from 'http'
import { Server as SocketIOserver, Socket } from 'socket.io'
import { initializeRoutes } from './routes'

let app: Application = express()
const port: number = 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize routes
app = initializeRoutes(app)

// Root route
app.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        success: true,
        message: 'welcome to the beginning of greatness',
    })
})

// Create HTTP server
const httpServer = createServer(app)

// Initialize Socket.IO server
const io: SocketIOserver = new SocketIOserver(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

// Listen for connections
io.on('connection', (socket: Socket) => {
    socket.on('userId', (userId: string) => {
        console.log('userId: ', userId)
    })
    socket.on('createRoom', (roomId: string) => {
        socket.join(roomId)
        //     if there are two people in the room, start the game
        if (
            io.sockets.adapter.rooms.get(roomId)?.size === 2
        ) {
            io.to(roomId).emit('startGame')
        }
    })
    socket.on('action', (data: any) => {
        console.log(data)
        io.to(data.roomId).emit('action', data)
    })
})

// Start server
httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
