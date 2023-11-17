import express from "express"
import controller from "../controllers/User.controller"
import { authenticateToken } from "../../middlewares/auth"
import Paystack from "../../helpers/paystack";
const router = express.Router();

router
    .route('/fund').post(authenticateToken, controller.fundAccount)
router
    .route('/verify').post(Paystack.verify)
router
    .route('/transfer').post(authenticateToken, controller.transfer)
router
    .route('/withdraw').post(authenticateToken, controller.withdraw)
router
    .route('/callback').get((req, res) => {
        res.send('Account funded successfully!');
      });
router
    .route('/banks').post(authenticateToken, controller.addBank)




    
export default router;