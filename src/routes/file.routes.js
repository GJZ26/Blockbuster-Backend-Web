import express from "express";
import fs, { readFileSync } from 'fs'
import multer from 'multer'
import cryp from 'crypto'
import crypter from 'crypto-js'
import dotenv from 'dotenv'

import config from '../app.conf.json' assert {type: 'json'}
import File from "../models/file.model.js";

const directory = `${process.cwd()}/src/${config.folder_storage}`
const saltRounds = parseInt(process.env["SALT_ROUNDS"]);
const router = express.Router();

dotenv.config()

const SECRET_KEY = process.env["ENCRYPT_FILES_KEY"]

if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}

var storage = multer.diskStorage({
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
    const file_url = await desencrypt(req.params.name);
    res.send(file_url)
})

router.post('/upload', upload.single('file'), async function (req, res) {
    const name = req.file.filename
    const file = await File.create({
        uuid: name,
        createDate: req.body.createDate,
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

async function desencrypt(filename) {
    let final_folder = `${directory}/${filename}`
    let file;
    try {
        file = readFileSync(final_folder).toString('ascii')
    } catch (e) {
        console.error("Ha ocurrido un error al desencriptar el archivo.")
        console.log(e)
        return;
    }

    let desencrypted_file = crypter.AES.decrypt(file, SECRET_KEY).toString(crypter.enc.Utf8)
    let buffer = Buffer.from(desencrypted_file, 'base64');
    fs.writeFileSync(`${final_folder}`.replace('.enc',""), buffer)
    return `${config.app_protocol}://${config.app_host}:${config.app_port}/${filename.replace('.enc','')}`
}


export default router;