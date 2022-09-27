import express from 'express'
const app = express()

import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'

import cors from 'cors'
import helmet from 'helmet'

import cloudinary from './utils/cloudinary.cjs'

// routers
import authRouter from './routes/authRoutes.js'
import fileRouter from './routes/fileRoutes.js'
import videosRouter from './routes/videosRoutes.js'
import usersRouter from './routes/usersRoutes.js'


//middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

// app.use(express.json())
app.use(helmet())
app.use(cors())

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
    res.json({ msg: 'Welcome!' })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/', fileRouter)
app.use('/api/v1/', videosRouter)
app.use('/api/v1/users/', usersRouter)

// middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.port || 5000

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()