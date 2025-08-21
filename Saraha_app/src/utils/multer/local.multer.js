import multer from  "multer"
import  fs  from "node:fs";
import  path  from "node:path";
export const localFileUpload=({customPath="general",validators=["image/png","image/jpeg","application/pdf"]}) => {

var basePath
    
    const storage=multer.diskStorage({
        destination:function (req,file,callback){
         
            
              basePath=`./uploads/${customPath}/${req.user.id}`
                const fullPath=path.resolve(`./src/${basePath}`)
                    
         if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath,{recursive:true})
         }

            return callback(null,path.resolve(fullPath));
        }
        ,filename:function(req,file,callback){
            const uniqueFileName=Date.now()+"__"+Math.random()+"__"+file.originalname
            console.log(basePath);
            
            file.finalPath=basePath+`/`+uniqueFileName
            callback(null,uniqueFileName)
            req.file=file

        }
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