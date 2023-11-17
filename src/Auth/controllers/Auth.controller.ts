import {
    validateRegistration,
    validateLogin,
} from "../../middlewares/validation"
import AuthService from "../services/Auth.service"
import { Request, Response } from "express"

class AuthController {
    async registerUser (req: Request, res: Response): Promise<Object> {
        try {
            const error: any = validateRegistration.parse(req.body)
            const register: any = await AuthService.registerUser(req.body)
            return res.status(register.code).send(register)
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

    async loginUser (req: Request, res: Response): Promise<Object> {
        try {
            const error: any = validateLogin.parse(req.body)
            const login: any = await AuthService.loginUser(req.body)
            return res.status(login.code).send(login)
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

export default new AuthController()