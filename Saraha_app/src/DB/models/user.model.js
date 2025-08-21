import { model, Schema } from "mongoose";
import { type } from "node:os";


const userSchema =new Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true},
        
gender:{type:String ,enum:{values:["male","female"]}},
password:String,
phone:String,
otp:String,
picture:{secure_url:String,public_id:String},
cover_images:{type:Array},
deletedAt:{type:Date},
deletedBy:{type:String},
confirmedEmail:{type:Boolean,default:false},
role:{type:String,enum:{ values:["system","bearer"]}, default:"bearer"}
    },
{    timeStamps:true
})
userSchema.virtual('messages', {
  ref: 'Message',           // The model to use
  localField: '_id',        // Find messages where `user` equals `_id`
  foreignField: 'receiverId',     // The field in Message model
       
});

// 👇 Enable virtuals in JSON output
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

 const userModel= new model("user", userSchema)
export default userModel;