import { DataTypes, Model } from 'sequelize'
import connection from '../database/connection.js'

class File extends Model { }

File.init({
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    createDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    
},
    {
        timestamps: false,
        sequelize: connection,
        tableName: "file",
    })

File.sync()
export default File;