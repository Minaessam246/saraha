// user.controller.js or message.router.js
import { Router } from "express";
import * as messageServices from "./message.services.js";
import { cloudFileUpload } from "./../../utils/multer/cloud.multer.js";
import { authentication } from "./../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/:receiverId",
  cloudFileUpload({}).array("files", 2),
  messageServices.sendMessage
);

router.post(
  "/:receiverId/loggedIn",
  authentication(["Bearer"]),
  cloudFileUpload({}).array("files", 2),
  messageServices.sendMessage
);

export default router;
