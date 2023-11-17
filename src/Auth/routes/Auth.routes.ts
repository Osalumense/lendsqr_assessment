import express from "express"
import controller from "../controllers/Auth.controller"
const router = express.Router();

router
    .route('/register').post(controller.registerUser)
router
    .route('/login').post(controller.loginUser)

    
export default router;