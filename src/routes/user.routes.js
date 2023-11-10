import express from 'express';
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'

import User from '../models/user.model.js';

const salt = parseInt(process.env["SALT_ROUNDS"]);
const router = express.Router()

router.get('/', (req, res) => {
    res.send("User endpoint")
})

router.post('/login', async (req, res) => {
    const body = req.body
    if (
        (!body.email && !body.username) ||
        !body.password

    ) {
        return res.status(401).send("Por favor proporciones las credenciales necesarias");
    }

    const user_indentity = body.email || body.username;


    const user_selected = await User.findOne({
        where: {
            [Op.or]: [
                { username: user_indentity },
                { email: user_indentity }
            ]
        }
    })

    if (!user_selected) {
        return res.status(404).send("No se ha encontrado el usuario.");
    }

    if (!bcrypt.compareSync(body.password, user_selected.dataValues.password)) {
        return res.status(403).send("Contraseña incorrecta");
    }
    const token = jwt.sign(
        {
            username: user_selected.dataValues.username
        }
        ,
        process.env["SECRET_TOKEN"],
        { algorithm: 'HS256' }
    )

    res.status(200).json({
        id: user_selected.dataValues.id,
        token: token,
        username: body.username,
        role: body.role || 'viewer'
    })


})

router.post('/register', async (req, res) => {
    const body = req.body;

    if (
        !body.password ||
        !body.email ||
        !body.username
    ) {
        return res.status(401).send("Favor de proporcionar algunos de los campos obligatorios: username, password, email");
    }


    const encrypted_password = bcrypt.hashSync(body.password, salt)

    const user_already_registered = await User.count({
        where: {
            [Op.or]: [
                { username: body.username },
                { email: body.email }
            ]
        }
    })

    if (user_already_registered > 0) {
        return res.status(409).send("Ya existe un usuario con el mismo username o correo")
    }

    const new_user_or_institute = new User({
        username: body.username,
        password: encrypted_password,
        description: body.description,
        website: body.website,
        email: body.email,
        role: body.role || "viewer",
        actor: body.actor || null
    })


    try {
        await new_user_or_institute.save()
    } catch (e) {
        return res.status(500).send("Ha ocurrido un error durante tu peticion.");
    }
    
    const token=jwt.sign({
        username: body.username
    },
        process.env["SECRET_TOKEN"],
        {
            algorithm: 'HS256'
        });

    return res.status(201).json({
        id: new_user_or_institute.dataValues.id,
        token: token,
        username: body.username,
        role: body.role || 'viewer'
    });

})

export default router;