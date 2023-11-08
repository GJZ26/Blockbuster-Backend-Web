import { DataTypes, Model } from 'sequelize'
import connection from '../database/connection.js'

class Test extends Model { }

Test.init({
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    text:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    tableName:"test",
    sequelize: connection
})

Test.sync()

export default Test;