import Router from "express"
import * as profileController from "../controllers/profile.controller.js"
import * as authMiddleware from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/get",authMiddleware.verifyAccessToken,authMiddleware.userExists,profileController.getprofile)
router.patch("/update",authMiddleware.verifyAccessToken,authMiddleware.userExists,profileController.updateProfile)

export default router