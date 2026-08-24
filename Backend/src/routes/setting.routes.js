import Router from "express"
import * as authMiddleware from "../middlewares/auth.middleware.js"
import * as settingController from "../controllers/setting.controller.js"

const router = Router()

router.patch("/changepassword",authMiddleware.verifyAccessToken,authMiddleware.userExists,settingController.changepassword)
router.delete("/deleteAccount",authMiddleware.verifyAccessToken,authMiddleware.userExists,settingController.deleteAccount)

export default router