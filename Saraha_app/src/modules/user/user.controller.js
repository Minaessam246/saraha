import { Router } from "express";
import * as userServices from "./user.services.js"
import { authentication } from "./../../middleware/auth.middleware.js";
import { fileSchema, profileSchema, signupSchema, validatee } from "./../../middleware/validation.middleware.js";
import { localFileUpload } from "./../../utils/multer/local.multer.js";
import { cloudFileUpload } from "./../../utils/multer/cloud.multer.js";
const router=Router()
router.post("/signup",validatee(signupSchema),userServices.signup)
router.get("/signup/confirmEmail",userServices.confirmEmail)
router.post("/login",userServices.login)
router.post("/login/gmail",userServices.signupWithGmail)
router.get("/profile",  authentication(["System"]), userServices.profile)
router.patch("/updateUser",userServices.updateProfile)
router.delete("/softDelete",authentication(["Bearer"]),userServices.freezeAccount)
router.delete("/softDelete/{:deleteID}",authentication(["System"]),userServices.freezeAccount)
router.delete("/deleteAccount/{:deleteID}",authentication(["System"]),userServices.freezeAccount)
router.delete("/restoreAccount/{:deleteID}",authentication(["System"]),userServices.restoreAccount)
router.post("/logout",authentication(["System","Bearer"]),userServices.logout)
router.post("/profileImageCloud",authentication(["System","Bearer"]),cloudFileUpload({}).single("image"),userServices.profileImageCloud)
router.post("/profileImages",authentication(["System","Bearer"]),localFileUpload({customPath:`userCover`}).array("images",3),validatee(fileSchema),userServices.profileImages)
router.post("/profileImagesCloud",authentication(["System","Bearer"]),cloudFileUpload({}).array("images",3),userServices.profileImagesCloud)
// router.patch("/update/:userID",userServices.updateUser)
router.patch("/updatePassword",authentication(["System","Bearer"]),userServices.updatePassword)
router.get("/customProfile/:userId",authentication(["System","Bearer"]), userServices.sharedProfile)

export default router