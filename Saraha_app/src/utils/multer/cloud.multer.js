import multer from  "multer"
import  fs  from "node:fs";
import  path  from "node:path";
export const cloudFileUpload=({customPath="general",validators=["image/png","image/jpeg","application/pdf"]}) => {

var basePath
    
    const storage=multer.diskStorage({
    })
    const fileFilter=(req,file,callback)=>{
if (validators.includes(file.mimetype)) {
    return callback(null,true)
}

else return callback("invalid file format",false)
    }
    return multer({
        dest:"./temp",fileFilter,storage
    })
}