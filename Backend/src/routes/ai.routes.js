import {Router} from "express"
import * as authMiddleware from "../middlewares/auth.middleware.js"
import * as aiController from "../controllers/ai.controller.js"

const router = Router()

router.post("/ask",authMiddleware.verifyAccessToken,authMiddleware.userExists,aiController.giveResponse)
router.post("/getAllChats",authMiddleware.verifyAccessToken,authMiddleware.userExists,aiController.getChatHistory)

export default router