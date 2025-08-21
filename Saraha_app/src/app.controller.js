import * as dotenv from "dotenv"

import path from "node:path"
dotenv.config({path: path.join("./src/config/.env.dev")})
// dotenv.config({})
import express from "express"
import userController from "./modules/user/user.controller.js"
import messageController from "./modules/message/message.controller.js"
import connectDB from "./DB/connection.db.js"
import nodemailer from "nodemailer"
import { sendEmail } from "./utils/email/send.email.js"
import helmet from "helmet"
import rateLimit from "express-rate-limit"




export const bootstrap =async ()=>{
const port =process.env.PORT
const app=express()
await connectDB()
app.listen(port,"localhost","127.0.0.1",()=>{
    console.log(`server is running on port${port} `);
    
})
const limiter=rateLimit({

windowMs:60*1000,
    limit:5,
    message:{error:"bas b2aaaaaa too many requests 🧨🧨🧨"}
})

// app.use(limiter)
app.use(helmet())
app.use(express.json())
app.use("/user",userController)
app.use("/message",messageController)
}