import {Router} from "express"
import * as authMiddleware from "../middlewares/auth.middleware.js"
import * as cpController from "../controllers/cp.controller.js"

const router = Router()

router.post("/gfgData",authMiddleware.verifyAccessToken,authMiddleware.userExists,cpController.gfgData)

export default router