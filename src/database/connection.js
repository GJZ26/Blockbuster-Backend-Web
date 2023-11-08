import {Sequelize} from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()
console.log(process.env["DATABASE_USERNAME"])
const connection = new Sequelize(
    process.env["DATABASE_NAME"],
    process.env["DATABASE_USERNAME"],
    process.env["DATABASE_PASSWORD"],
    {
        host: process.env["DATABASE_HOST"],
        dialect:"mysql",
        port: process.env["DATABASE_PORT"],
    }
)

try{
    connection.authenticate()
    console.log("Conectado a la base de datos.")
}catch(e){
    console.error("Ha ocurrido un erro al momento de conectarse a la base de datos")
}

export default connection;