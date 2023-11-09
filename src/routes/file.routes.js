import express from "express";
import fs, { readFileSync } from 'fs'
import multer from 'multer'
import cryp from 'crypto'
import crypter from 'crypto-js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import config from '../app.conf.json' assert {type: 'json'}
import File from "../models/file.model.js";

const directory = `${process.cwd()}/src/${config.folder_storage}`
const router = express.Router();

dotenv.config()

const SECRET_KEY = process.env["ENCRYPT_FILES_KEY"]

if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}

const storage = multer.diskStorage({
    destination: directory,
    filename: function (req, file, cb) {
        file.toString('base64')
        const nameArray = file.originalname.split('.')
        const encoded = Buffer.from(nameArray[0], 'utf8').toString('base64')
        const name = cryp.randomUUID()
        let result = name.replace(/\//g, "#");
        cb(null, result + '.' + nameArray[1])
    }
});

const upload = multer({ storage: storage, });

// * * * * * * FILE ROUTES * * * * * * 

router.get('/', (req, res) => {
    res.send("file root")
})

router.get('/:name', async (req, res) => {
    const token_info = validate_token(req.headers.authorization.replace("Bearer ", ""))

    if (!token_info) {
        return res.status(401).send("Su token ha expirado, vuelva a iniciar sesion")
    }

    const file_url = await desencrypt(req.params.name);
    if(!file_url){
        return res.status(404).send("No se ha encontrado el documento especificado...");
    }
    res.send(file_url)
})

router.post('/upload', upload.single('file'), async function (req, res) {
    const token_info = validate_token(req.headers.authorization.replace("Bearer ", ""))

    if (!token_info) {
        return res.status(401).send("Su token ha expirado, vuelva a iniciar sesion")
    }

    if (!req.file) {
        return res.status(404).send("No ha añadido archivos a la peticion.")
    }

    if (!req.body.to) {
        return res.send(401).send("Especifique el destino.")
    }

    const name = req.file.filename
    const file = await File.create({
        uuid: name,
        createDate: req.body.createDate,
        from: token_info.id,
        to: parseInt(req.body.to)
    });

    await file.save();
    encryptFile(name)
    res.send(`${name}.enc`)
});

async function encryptFile(filename) {
    let final_folder = `${directory}/${filename}`
    let file;
    try {
        file = fs.readFileSync(final_folder)
    } catch (e) {
        console.error("El archivo no existe")
        return
    }
    const base_file = file.toString('base64')

    let encrypted_file = crypter.AES.encrypt(base_file, SECRET_KEY).toString();

    let buffer = Buffer.from(encrypted_file, 'utf-8');
    fs.writeFileSync(`${final_folder}.enc`, buffer)
    fs.unlinkSync(final_folder)
}

function validate_token(token) {
    try {
        return jwt.verify(token,
            process.env["SECRET_TOKEN"],
            { algorithm: 'HS256' })
    } catch (e) {
        return false
    }
}

async function desencrypt(filename) {
    let final_folder = `${directory}/${filename}`
    let file;
    try {
        file = readFileSync(final_folder).toString('ascii')
    } catch (e) {
        console.error("Ha ocurrido un error al desencriptar el archivo.")
        return false;
    }

    let desencrypted_file = crypter.AES.decrypt(file, SECRET_KEY).toString(crypter.enc.Utf8)
    let buffer = Buffer.from(desencrypted_file, 'base64');
    fs.writeFileSync(`${final_folder}`.replace('.enc', ""), buffer)
    return `${config.app_protocol}://${config.app_host}:${config.app_port}/${filename.replace('.enc', '')}`
}


export default router;