import userModel from "./../../DB/models/user.model.js";
import bcrypt, { compare } from 'bcryptjs';
import CryptoJS from "crypto-js";
import { json } from "express";
import jwt from "jsonwebtoken";
import {OAuth2Client} from "google-auth-library"
import { generateToken, verifyToken } from "./../../utils/security/token.security.js";
import { emailEvent } from "./../../utils/events/email.event.js";
import { customAlphabet, nanoid } from "nanoid";
import mongoose ,{Types} from "mongoose";
import { cloud, deleteCovers } from "../../utils/multer/cloudinary.js";
import { populate } from "dotenv";
import { tokenModel } from "../../DB/models/token.model.js";




export const asyncHandler = (fn) => {
  return async(req, res, next) => {
   await fn(req, res, next)
  //  .catch(error=>

  //   res.json({message:"server error"})
  //  ); 
  };
};
export const signup =asyncHandler(
 async  (req,res,next)=>{
  const {email,password ,phone}=req.body
const check= await userModel.findOne({email})
if (check) {
  return res.json({message:"email exists"})
}
var ciphertext = CryptoJS.AES.encrypt(phone, '5alty batsalam 3alak').toString();
const newpass=bcrypt.hashSync(password,8)

const otp=customAlphabet("012345678",6)()
const newOtp=bcrypt.hashSync(otp,8)
console.log(otp);
const added= await userModel.create({...req.body,password:newpass,phone:ciphertext,otp:newOtp,})

emailEvent.emit("confirmEmail",{to:email,text:otp})
if (added) {
  res.json({message:"added successfully 👌👌👌"})
}
   }
  )

export const signupWithGmail =asyncHandler(
async (req,res,next)=>{
  const otp=customAlphabet("012345678",6)();
const newOtp= bcrypt.hashSync(otp.toString(),8)
console.log(otp,newOtp);
const {idToken}=req.body
const {name,email}= await verify({idToken})
if (!await userModel.findOne({email})) {
  const user=await userModel.create({email,name,otp:newOtp})
emailEvent.emit("confirmEmail",{to:email,text:otp})

return res.json({message:"added successfully",user})

}
return res.json({message:"already exists"})
}
  )
export const login =asyncHandler(
 async  (req,res,next)=>{
  const {email,password }=req.body
const check= await userModel.findOne({email},{password:0})


if (!check.confirmedEmail) {
  return res.json({message:"not confirmed email"})
}

if (check ) {
  const user ={...check.toObject(),phone: JSON.parse(CryptoJS.AES.decrypt(check.phone, '5alty batsalam 3alak').toString(CryptoJS.enc.Utf8))
,access_token:generateToken({payload:{id:check._id,isLoggedIn:true},signature:check.role ==="bearer"?process.env.ACCESS_USER_TOKEN_SIGNATURE:process.env.ACCESS_ADMIN_TOKEN_SIGNATURE, expiresIn: "1h"})
,refresh_token:jwt.sign({id:check._id,isLoggedIn:true},"blahBlah")
}

  return res.json({message:"login successfully " ,user})
}
else{
  res.status(404).json({message:"invalid data "})
}

   }
  )

 async function verify({idToken}={}) {
    const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
      idToken,
      audience: "765880014065-git1shsdmpt5akdla32mu5bsvebdevpb.apps.googleusercontent.com",  
  });
  const payload = ticket.getPayload();
return payload
}

  
export const sharedProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!Types.ObjectId.isValid(userId)) {
    return res.json({ message: "invalid ObjectId" });
  }

  const user = await userModel.findById(userId,{password:0,otp:0}).populate([{ path: "messages" }]);

  if (!user) {
    return res.json({ message: "user not found" });
  }

  const user2 = {
    ...user.toObject(),
    phone: CryptoJS.AES.decrypt(user.phone, '5alty batsalam 3alak').toString(CryptoJS.enc.Utf8),
  };

  return res.json({ message: "found", user: user2 });
});

export const profile =asyncHandler(
 async  (req,res,next)=>{
  







  const user2={...req.user.toObject(),phone:CryptoJS.AES.decrypt(req.user.phone, '5alty batsalam 3alak').toString(CryptoJS.enc.Utf8)}
  res.json({message:"found",user2})






   }
  )
  export const confirmEmail=asyncHandler(
async (req,res,next)=>{
  const {email,otp}=req.body;
  const user= await userModel.findOne({email,confirmedEmail:false})
  
  if (user && bcrypt.compareSync(otp,user.otp)) {
    var updated=await userModel.updateOne({email},{confirmedEmail:true})
    res.json({message:"confirmed"})
  }
  else{
    res.json({message:"invailed otp or already confirmed"})
  }



}

  ) 
  export const updatePassword = asyncHandler(
    async (req,res,next)=>{

      const {email,oldPassword,newPassword}=req.body
      console.log(req.user.password);
      
      if (oldPassword===newPassword || !bcrypt.compare(oldPassword,req.user.password) || email!==req.user.email) {
        return res.status(400).json({message:"invalid data or the same password"})
      }
      const updatedUser= await userModel.updateOne({email},{password:bcrypt.hashSync(newPassword)})
 if (updatedUser) {
          return res.json({message:"updated successfully "})

 }
 else{
  res.json({ message:"invalid email"})
 }
      
     
    }
  )
  export const updateProfile = asyncHandler(
    async (req,res,next)=>{

      const {email,phone}=req.body
      const updatedUser= await userModel.updateOne({email},{...req.body},{password:0})
      if (updatedUser.modifiedCount) {
        return res.json({message:"updated successfully "})
      }
      else{
        res.json({message:"nothing to update"})
      }
    }
  )
  export const deleteAccount=asyncHandler(
    async (req,res,next)=>{

  const {deleteID}=req.params;
const {role ,email}=req.user;


var  deletedUser= await userModel.deleteOne({_id:deleteID,deletedAt:{$exists:true}})

if (deletedUser) {
  deletedUser?res.json({message:"this acccount fully deleted " ,deletedUser}):res.json({message:"not deleted "})

}
}



    
  )
  export const restoreAccount=asyncHandler(
    async (req,res,next)=>{

  const {deleteID}=req.params;
const {role ,email}=req.user;


var  deletedUser= await userModel.updateOne({_id:deleteID,deletedAt:{$exists:true},deletedBy:{$ne:deleteID}},{$unset:{deletedAt:1,deletedBy:1}})

if (deletedUser) {
  deletedUser.modifiedCount?res.json({message:"this acccount restord successfully " ,deletedUser}):res.json({message:"not deleted or deleted by his owner"})

}
}



    
  )
export const logout = asyncHandler(async (req, res) => {
  const token = req.token;
  const role = req.headers.authorization.split(" ")[0];

  const signature = role === "Bearer"
    ? process.env.ACCESS_USER_TOKEN_SIGNATURE
    : process.env.ACCESS_ADMIN_TOKEN_SIGNATURE;

  let decoded;
  try {
    decoded = verifyToken({ token, signature });  // ✅ now this throws only if truly invalid
  } catch (err) {
    console.error("[logout] Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token (verification failed)" });
  }

  console.log("[logout] Decoded token:", decoded);

  if (!decoded?.jti || !decoded?.exp) {
    return res.status(400).json({ message: "Invalid token structure (missing jti/exp)" });
  }

  const expireAt = new Date(decoded.exp * 1000);
  await tokenModel.create({ jti: decoded.jti, expireAt });

  return res.status(200).json({ message: "Logged out successfully" });
});



  export const freezeAccount=asyncHandler(
    async (req,res,next)=>{

  const {deleteID}=req.params;
const {role ,email ,_id}=req.user;

if (role==="system" && deleteID ) {
var  deletedUser= await userModel.updateOne({_id:deleteID,deletedAt:null},{deletedAt:Date.now(),deletedBy:_id})
  console.log(_id);

deletedUser.modifiedCount?res.json({message:"system deleted this successfully "}):res.json({message:"already deleted"})
}
else if(role==="bearer"){

  var  deletedUser= await userModel.updateOne({email,deletedAt:null},{deletedAt:Date.now(),deletedBy:_id})

  
deletedUser.modifiedCount?res.json({message:"user deleted this successfully "}):res.json({message:"already deleted"})


}


    }
  )
  export const profileImage=asyncHandler(
    async (req,res,next)=>{
return res.json({message:"uploaded",data:{file:req.file}})
    }
  )
  export const profileImages=asyncHandler(
    async (req,res,next)=>{
return res.json({message:"uploaded",data:{files:req.files}})
    }
  )
  export const profileImageCloud=asyncHandler(
    async (req,res,next)=>{
      const {id,email}=req.user;
const {secure_url,public_id}= await cloud().uploader.upload(req.file.path,{
  folder:`saraha_app/user/${id}`
})
console.log(id);


const user2=await userModel.findOneAndUpdate({email},{picture:{secure_url,public_id}})

console.log(secure_url,public_id);

if (user2?.picture?.secure_url) {
  await cloud().uploader.destroy(user2.picture.public_id)
}
console.log(user2);

return res.json({message:"uploaded",data:{user2}})
    }
  )
  export const profileImagesCloud=asyncHandler(

   async (req,res,next)=>{
      const {id,email}=req.user;
      let covers=[];
for (const file of req.files) {
  const {secure_url,public_id}= await cloud().uploader.upload(file.path,{
  folder:`saraha_app/user/${id}/cover`
})
covers.push( {secure_url,public_id})
}
console.log(id);


const updated =await userModel.updateOne({email},{cover_images:covers})
const user2 =await userModel.findOne({email})


if (user2?.cover_images?.length) {
  await deleteCovers({
    public_ids:user2.cover_images.map(ele=>ele.public_id)
  })

}
console.log(user2);


return res.json({message:"uploaded",data:{user2}})
    }
  )
  