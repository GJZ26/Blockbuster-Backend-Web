import express from 'express';
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'

import User from '../models/user.model.js';

const router = express.Router()

// TODO: Get all Institution

router.get('/', (req, res) => {
    res.send("User endpoint")
})

router.post('/login', (req, res) => {
    res.send("Hola desde login").status(200);
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

    const encrypted_password = bcrypt.hashSync(body.password, 3)

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
        new_user_or_institute.save()
    } catch (e) {
        return res.status(500).send("Ha ocurrido un error durante tu peticion.");
    }
    return res.status(201).send("El usuario ha sido registrado con éxito");
})

export default router;