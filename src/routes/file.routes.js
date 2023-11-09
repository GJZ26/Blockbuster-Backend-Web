import express from "express";
import File from "../models/file.model.js";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import fs from 'fs'
import path from 'path'
import multer from 'multer'
const __dirname = path.dirname(__filename);
var directory = path.join(__dirname,"../files")
import bcrypt from "bcrypt"
const saltRounds = 5;
const router = express.Router();

if (!fs.existsSync(directory)){
    fs.mkdirSync(directory);
    
}

export const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '../files'),
    filename: (req, file, cb) => {
        const nameArray = file.originalname.split('.')
        const encoded = Buffer.from(nameArray[0], 'utf8').toString('base64')  
        const name = bcrypt.hashSync(encoded,saltRounds) 
        let result = name.replace(/\//g, "#");
        cb(null, result + '.' + nameArray[1])

    }
})



export const fileUpload = multer({
    storage: diskStorage
}).single('file')



var storage = multer.diskStorage({
    destination: path.join(__dirname, '../files'),
    filename:function(req,file,cb){
        file.toString('base64')
        const nameArray = file.originalname.split('.')
        const encoded = Buffer.from(nameArray[0], 'utf8').toString('base64')  
        const name = bcrypt.hashSync(encoded,saltRounds) 
        let result = name.replace(/\//g, "#");
        //fs.writeFile(directory + "/" + result + '.' + nameArray[1], newfile, 'base64', function(err) {
         //   if (err) console.log(err);
        //});
        cb(null, result + '.' + nameArray[1]) //Appending extension
    }
});

var upload = multer({ storage: storage,});

// * * * * * * FILE ROUTES * * * * * * 
router.get('/',(req,res)=>{
    
    res.send("file root")
})
router.get('/:id',(req,res)=>{
    
    res.send("file get")
})
router.post('/upload',upload.single('file'), async function(req, res) {
    const name = req.file.filename
    const file = await File.create({ 
        uuid: name,
        createDate: req.body.createDate,
    });

    await file.save();
    
    res.send("Archivo subido")
});



/*
    console.log(req.file.filename)
    
    console.log(req.body.createdDate)
    
})*/




export default router;