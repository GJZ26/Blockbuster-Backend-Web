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
    from: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    to: {
        type: DataTypes.BIGINT,
        allowNull: false
    }

},
    {
        timestamps: false,
        sequelize: connection,
        tableName: "file",
    })

File.sync()
export default File;