import Router from "express"
import * as authMiddleware from "../middlewares/auth.middleware.js"
import * as progressController from '../controllers/progress.controller.js'

const router = Router()

router.post("/addManually",authMiddleware.verifyAccessToken,authMiddleware.userExists,progressController.addManually)
router.delete("/deleteProgess/:progressId",authMiddleware.verifyAccessToken,authMiddleware.userExists,progressController.deleteProgress)
router.delete("/deleteSubject/:subject",authMiddleware.verifyAccessToken,authMiddleware.userExists,progressController.deleteSubjectProgress)
router.get("/get/:subject",authMiddleware.verifyAccessToken,authMiddleware.userExists,progressController.getSubjectProgress)
router.get("/getAll",authMiddleware.verifyAccessToken,authMiddleware.userExists,progressController.getAllProgress)
router.get("/summary",authMiddleware.verifyAccessToken,authMiddleware.userExists,progressController.getProgressSummary)
router.delete("/deleteAll",authMiddleware.verifyAccessToken,authMiddleware.userExists,progressController.deleteAllProgress)

export default router
