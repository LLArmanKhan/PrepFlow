import Router from "express"
import * as goalController from "../controllers/goals.controller.js"
import * as authMiddleware from "../middlewares/auth.middleware.js"


const router = Router()

router.post("/create",authMiddleware.verifyAccessToken,authMiddleware.userExists,goalController.createGoal)
router.patch("/update",authMiddleware.verifyAccessToken,authMiddleware.userExists,goalController.updateGoal)
router.get("/get",authMiddleware.verifyAccessToken,authMiddleware.userExists,goalController.getGoal)
router.get("/getAll",authMiddleware.verifyAccessToken,authMiddleware.userExists,goalController.getGoals)
router.delete("/delete",authMiddleware.verifyAccessToken,authMiddleware.userExists,goalController.deleteGoal)
router.delete("/deleteAll",authMiddleware.verifyAccessToken,authMiddleware.userExists,goalController.deleteGoals)

export default router