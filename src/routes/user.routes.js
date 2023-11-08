import express from 'express';
import User from '../models/user.model.js';

const router = express.Router()

// TODO: Get all Institution

router.get('/', (req,res)=>{
    res.send("User endpoint")
})

router.post('/login', (req,res) =>{
    res.send("Hola desde login").status(200);
})

router.post('/register', (req, res)=>{
    res.send("Hola desde registro").status(200);
})

export default router;