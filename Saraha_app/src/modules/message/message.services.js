import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";
import { cloud } from "../../utils/multer/cloudinary.js";
import { asyncHandler } from "../user/user.services.js";

export const sendMessage=asyncHandler(
    async (req,res,next)=>{


        const {receiverId}=req.params;
        const {content}=req.body
        const files=req.files
        const user =await userModel.findById(receiverId)
        if(user && (req.files || content) ){ 
               let covers=[];
         for (const file of req.files) {
           const {secure_url,public_id}
           = await cloud().uploader.upload(file.path,{
           folder:`saraha_app/user/${receiverId}/messages`
         })
         covers.push( {secure_url,public_id})
         } 

         
            const message= await messageModel.create({content,attachments:covers,receiverId,senderId:req.user?.id})
           if (message) {
            return res.json({message:"added succssefully",message})
           }
        else {
             return res.json({message:"undefined user or empty content",deletedAt:{exists:false}})
        }
  
        
    } 
    }
)


