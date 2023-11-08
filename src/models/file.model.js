import { DataTypes, Model } from 'sequelize'
import connection from '../database/connection.js'

class File extends Model { }

File.init({
    uuid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    createDate: {
        type: DataTypes.DATE,
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