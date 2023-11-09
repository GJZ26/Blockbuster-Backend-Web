import express from "express";
import fs from 'fs'
import multer from 'multer'
import bcrypt from "bcrypt"
import config from '../app.conf.json' assert {type: 'json'}

import File from "../models/file.model.js";

const directory = `${process.cwd()}/src/${config.folder_storage}` 
const saltRounds = process.env["SALT_ROUDS"];
const router = express.Router();

if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}

var storage = multer.diskStorage({
    destination: directory,
    filename: function (req, file, cb) {
        file.toString('base64')
        const nameArray = file.originalname.split('.')
        const encoded = Buffer.from(nameArray[0], 'utf8').toString('base64')
        const name = bcrypt.hashSync(encoded, saltRounds)
        let result = name.replace(/\//g, "#");
        cb(null, result + '.' + nameArray[1])
    }
});

const upload = multer({ storage: storage, });

// * * * * * * FILE ROUTES * * * * * * 

router.get('/', (req, res) => {
    res.send("file root")
})

router.get('/:id', (req, res) => {
    res.send("file get")
})

router.post('/upload', upload.single('file'), async function (req, res) {
    const name = req.file.filename
    const file = await File.create({
        uuid: name,
        createDate: req.body.createDate,
    });

    await file.save();

    res.send("Archivo subido")
});

export default router;