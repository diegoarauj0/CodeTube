//NodeModules
import { Router } from "express"

//Controllers
import { LocalAuthController, AuthController } from "controllers/index"

const router = Router()

router.use("/Auth", new LocalAuthController().getRouter)
router.use("/Auth", new AuthController().getRouter)

export default router