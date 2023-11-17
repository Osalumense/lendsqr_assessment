import {
    validateFundAccount,
    validateTransfer,
    validateWithdraw,
    validateAddBank
} from "../../middlewares/validation"
import UserService from "../services/User.service"
import { Request, Response } from "express"

class UserController {
    async fundAccount (req: Request, res: Response): Promise<Object> {
        try {
            const error: any = validateFundAccount.parse(req.body)
            const fundAccount: any = await UserService.fundAccount(req.body)
            return res.status(fundAccount.code).send(fundAccount)
        } catch (error) {
            if(error.issues) {
                const errorMessage = error.issues.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))
                console.error(errorMessage)
                return res.status(400).json({ error: errorMessage[0] })
            }
            return res.status(500).send({status: "error", message: error.message, error: error })
        }
    }

    async transfer (req: Request, res: Response): Promise<Object> {
        try {
            const error: any = validateTransfer.parse(req.body)
            const transfer: any = await UserService.transfer(req)
            return res.status(transfer.code).send(transfer)
        } catch (error) {
            if(error.issues) {
                const errorMessage = error.issues.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))
                console.error(errorMessage)
                return res.status(400).json({ error: errorMessage[0] })
            }
            return res.status(500).send({status: "error", message: error.message, error: error })
        }
    }

    async withdraw (req: Request, res: Response): Promise<Object> {
        try {
            const error: any = validateWithdraw.parse(req.body)
            const withdraw: any = await UserService.withdraw(req)
            return res.status(withdraw.code).send(withdraw)
        } catch (error) {
            if(error.issues) {
                const errorMessage = error.issues.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))
                console.error(errorMessage)
                return res.status(400).json({ error: errorMessage[0] })
            }
            return res.status(500).send({status: "error", message: error.message, error: error })
        }
    }

    async addBank (req: Request, res: Response): Promise<Object> {
        try {
            const error: any = validateAddBank.parse(req.body)
            const addBank: any = await UserService.addBank(req)
            return res.status(addBank.code).send(addBank)
        } catch (error) {
            if(error.issues) {
                const errorMessage = error.issues.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))
                console.error(errorMessage)
                return res.status(400).json({ error: errorMessage[0] })
            }
            return res.status(500).send({status: "error", message: error.message, error: error })
        }
    }
}

export default new UserController()