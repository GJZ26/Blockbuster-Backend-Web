import express from "express";
import Test from "../models/test.model.js";

const router = express.Router();

router.get('/',(req,res)=>{
    Test
    res.send("Hola mundo!")
})

export default router;