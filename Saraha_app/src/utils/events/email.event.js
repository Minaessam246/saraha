import { EventEmitter } from "node:events";
import { sendEmail } from "../email/send.email.js";
import { customAlphabet, nanoid } from "nanoid"

export const emailEvent=new EventEmitter()

emailEvent.on("confirmEmail",async(data)=>{
await sendEmail({to:data.to,text:`Otp ${data.text}`,})

})