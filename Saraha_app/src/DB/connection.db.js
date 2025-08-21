
import { mongoose } from "mongoose";

 const connectDB= async()=>{
try {
       const connection= await mongoose.connect("mongodb://localhost:27017/mina");
   console.log("DB connected succesfully ");
} catch (error) {
    console.log("can't connect ");
    
}
   

}
export default connectDB