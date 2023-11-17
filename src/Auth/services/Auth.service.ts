import bcrypt from "bcryptjs"

import  { successResponse, errorResponse } from "../../helpers/responseHandler"
import { generateAccessToken } from "../../helpers/utils"
import { UserInputDTO } from "../../DTOs/user.dto"
import { LoginDTO } from "../../DTOs/login.dto"

import userQueries from "../../models/User"
import walletQueries from "../../models/Wallets"

interface IAuthService {
    registerUser(payload: UserInputDTO): Promise<Object>
    loginUser(payload: LoginDTO): Promise<Object>
}

class AuthService implements IAuthService {
    async registerUser(payload: UserInputDTO): Promise<Object> {
        try {
            const {email, password } = payload
            const userExist = await userQueries.getUserByEmail(email)
            if(userExist && userExist.length > 0) return errorResponse(400, "", "User already exists")
            
            const hashedPassword = bcrypt.hashSync(password, 8)
            const createUserPayload = {
                ...payload,
                password: hashedPassword,
            }
            const createUser = await userQueries.addUser(createUserPayload)
            await walletQueries.createUserWallet(createUser[0])
            return successResponse(201, "", "User created successfully")
        } catch (error) {
            return errorResponse(500, error, `An error occurred while processing request: ${error.message}`)
        }
    }

    async loginUser(payload: LoginDTO): Promise<Object> {
        try {
            const {email, password } = payload
            const getUser = await userQueries.getUserByEmail(email)
            if (!getUser) return errorResponse(400, "", "User does not exist")
            const comparePassword = bcrypt.compareSync(password, getUser.password)
            if (!comparePassword) return errorResponse(400, "", "Incorrect password")
            const token = generateAccessToken(getUser);
            const message = {
                user: await userQueries.getUserById(getUser.id, false),
                accessToken: token
              };
            return successResponse(200, message, "Logged in");            
        } catch (error) {
            return errorResponse(500, error, `An error occurred while processing request: ${error.message}`)
        }
    }


}

export default new AuthService()