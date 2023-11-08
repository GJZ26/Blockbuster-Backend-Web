import express from "express";
import File from "../models/file.model.js";

const router = express.Router();

router.get('/',(req,res)=>{
    
    res.send("file root")
})
router.get('/:id',(req,res)=>{
    
    res.send("file get")
})
router.post('/upload',(req,res)=>{

    res.send("file upload")
})


export default router;