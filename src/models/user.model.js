import { DataTypes, Model } from 'sequelize'
import connection from '../database/connection.js'

class User extends Model { }

User.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM(["viewer", "institution"]),
        allowNull: false
    },
    actor: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        sequelize: connection,
        tableName: "user",
        timestamps: false
    })

User.sync()
export default User;