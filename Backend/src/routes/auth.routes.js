import Router from "express"
import * as authController from "../controllers/auth.controller.js"
import * as authMiddleware from "../middlewares/auth.middleware.js"
import * as authValidator from "../validators/auth.validator.js"

const router = Router()

router.post("/register",authValidator.validateRegister,authController.registerUser)
router.post("/verify",authValidator.validateVerify,authController.verifyEmail)
router.post("/login",authValidator.validateLogin,authController.login)

router.post("/refreshToken",authMiddleware.verifyAccessToken,authMiddleware.userExists,authController.refreshToken)
router.post("/logout",authMiddleware.verifyAccessToken,authMiddleware.userExists,authController.logout)
router.post("/logoutAll",authMiddleware.verifyAccessToken,authMiddleware.userExists,authController.logoutAll)

export default router