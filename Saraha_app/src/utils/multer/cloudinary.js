import  {v2 as cloudinary} from "cloudinary"
export const cloud =()=>{
    cloudinary.config({
        cloud_name:`df7tru1sj`,
        api_key:`622711673136414`,
        api_secret:`FkyN-_QzY6kob5hiUBMlI-aYq5o`,
        secure:true
    })
    return cloudinary
}
export const deleteCovers=async ({public_ids})=>{
    return await cloud().api.delete_resources(public_ids,{type:"upload",resource_type:"image",})
}