
import { asyncHandler } from "./../modules/user/user.services.js";
import userModel from "./../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/security/token.security.js";
import { tokenModel } from "../DB/models/token.model.js";

// export const authentication=(roles)=>{
//   return asyncHandler(   async (req,res,next)=>{
//   const {authorization}=req.headers
  
//   if (!authorization) {
//     return res.status(400).json({message:"token and role are required"}) 
//   }
//   if (!roles.includes(authorization.split(" ")[0])) {
//     return res.json({message :"unauthorized role"})
//   }
  
//  const token=authorization.split(" ")[1]
// req.token=token

//   const signature=authorization.split(" ")[0]==="Bearer"?process.env.ACCESS_USER_TOKEN_SIGNATURE:process.env.ACCESS_ADMIN_TOKEN_SIGNATURE




//   console.log(token,signature);
  
 
   
// try {
//           var verify=verifyToken({token,signature,})

// } catch (err) {
//       return res.status(404).json({message:"invalid tokenn",verify})

// }
   
   
       



    

// const user= await userModel.findById(verify.id,)
// if (!user) {
//     return res.status(404).json({message:"not registered"})
// }
// req.user=user;

// console.log(req.user);

// return next()
//   }



//   )}


export const authentication = (roles) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(400).json({ message: "token and role are required" });
    }

   try {
     const role = authorization.split(" ")[0];
    if (!roles.includes(role)) {
      return res.status(403).json({ message: "unauthorized role" });
    }

    const token = authorization.split(" ")[1];
    req.token = token;

    const signature =
      role === "Bearer"
        ? process.env.ACCESS_USER_TOKEN_SIGNATURE
        : process.env.ACCESS_ADMIN_TOKEN_SIGNATURE;

     {
      const decoded = verifyToken({ token, signature });
      req.user = await userModel.findById(decoded.id);
      if (!req.user) {
        return res.status(404).json({ message: "User not registered" });
      }

      // Check if token is blacklisted
      const blacklisted = await tokenModel.findOne({ jti: decoded.jti });
      if (blacklisted) {
        return res.status(401).json({ message: "user already logged out" });
      }

      req.user = req.user;
      req.jti = decoded.jti; // So we can use it in logout

      return next();
    } 
   } catch (error) {
    return res.status(400).json({message:"invalid token"})
   }
  });
};
