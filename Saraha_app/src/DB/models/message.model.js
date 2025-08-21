import mongoose, { model, Schema } from "mongoose";



export const messageModel= new model("Message", new Schema(
{
    content:{
        type:String,
        required:true
    },
    attachments:{type:Array},

    receiverId:{type:mongoose.Schema.Types.ObjectId ,ref:"User" ,required:true},
    senderId:{type:mongoose.Schema.Types.ObjectId ,ref:"User" }
}
))
export default messageModel;
