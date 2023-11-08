import config from './app.conf.json' assert {type: 'json'}
import express from 'express'
import root_route from './routes/root.routes.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'


const app = express('/test', root_route)


// * * * * * * APP SETTINGS * * * * * * 
dotenv.config()

app.use(cors({ 
    origin: ['http://localhost:3000'],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))

// * * * * * * APP ROUTING * * * * * * 
app.use(root_route)



// * * * * * *  APP RUNNING * * * * * * 
app.listen(config.app_port, config.app_host, () => {
    console.log(`Server running on ${config.app_protocol}://${config.app_host}:${config.app_port}/`)
})