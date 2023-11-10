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
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true
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
        defaultValue: "viewer",
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