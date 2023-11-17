import Paystack from "../../helpers/paystack"
import  { successResponse, errorResponse } from "../../helpers/responseHandler"
import { 
    FundUserAccountDTO,
    AddBankDTO
 } from "../../DTOs/transactions.dto"

import userQueries from "../../models/User"
import bankQueries from "../../models/Banks"
import walletQueries from "../../models/Wallets"
import { CustomRequest } from "../../middlewares/auth"

interface IUserService {
    fundAccount(payload: FundUserAccountDTO): Promise<Object>
    transfer(req: CustomRequest): Promise<Object>
    withdraw(req: CustomRequest): Promise<Object>
    addBank(payload: AddBankDTO): Promise<Object>
}

class UserService implements IUserService {
    async fundAccount(payload: FundUserAccountDTO): Promise<Object> {
        try {
            const {amount, customer } = payload
            const amountInNaira: number = amount / 100;
            let userWallet: any
            const getUser = await userQueries.getUserByEmail(customer)
            if (getUser && getUser.id) {
                const wallet = await walletQueries.getUserWalletByUserId(getUser.id)
                userWallet = wallet ? wallet : await walletQueries.createUserWallet(getUser.id)
            }
            const walletId: number = userWallet.id
            const creditAccountPayload = {
                id: walletId,
                amount: amountInNaira
            }
            const  creditBeneficiary = await walletQueries.creditUserWallet(creditAccountPayload)
            if(creditBeneficiary  && 'error' in creditBeneficiary && 'message' in creditBeneficiary && creditBeneficiary.error) {
                return successResponse(200, "", creditBeneficiary.message as string)
            } else if (creditBeneficiary) {
                const message = (creditBeneficiary as any).message || 'Unknown error';
                return successResponse(200, "", message);
            } else {
                return errorResponse(400, "", 'Unknown error');
            }
        } catch (error) {
            return errorResponse(500, error, `An error occurred while processing request: ${error.message}`)
        }
    }

    async transfer(req: CustomRequest): Promise<Object> {
        try {
            const authId = req.id
            const { email, description, amount } = req.body
            const amountInNaira: number = amount / 100;
            const transferPayload = {
                userId: authId,
                email,
                amount: amountInNaira,
                description
            }
            const transfer = await walletQueries.transfer(transferPayload)
            if(transfer  && 'error' in transfer && 'message' in transfer && transfer.error) {
                return successResponse(200, "", transfer.message as string)
            } else if (transfer) {
                const message = (transfer as any).message || 'Unknown error';
                return successResponse(200, "", message);
            } else {
                return errorResponse(500, "", transfer.message)
            }
        } catch (error) {
            return errorResponse(500, error, `An error occurred while processing request: ${error.message}`)
        }
    }
    
    async withdraw(req: CustomRequest): Promise<Object> {
        try {
            const authId: number = req.id
            const {  amount } = req.body
            const withdrawPayload = {
                userId: authId,
                amount: parseInt(amount) / 100,
            }
            const transfer = await walletQueries.withdraw(withdrawPayload)
            if(transfer && transfer.error !== false){
                return successResponse(200, "", transfer.message)
            } else {
                return errorResponse(500, "", transfer.message)
            }
        } catch (error) {
            return errorResponse(500, error, `An error occurred while processing request: ${error.message}`)
        }
    }

    async addBank(req: CustomRequest): Promise<Object> {
        try {
            const userId: number = parseInt(req.id)
            const { name, accountNumber, bankName } = req.body
            const getBank = await bankQueries.getBankByBankName(bankName)
            if(!getBank) return errorResponse(400, "", "Bank not found")
            const bankCode = getBank.code
            let recipientCode
            const response = await Paystack.resolveAcctNumber(accountNumber, bankCode)
            if(response.status){
                const result = await Paystack.transferRecipient(name, accountNumber, bankCode)
                recipientCode = result.data.recipient_code
            }
            const createBankDetailsPayload = {
                name: name,
                accountNumber: accountNumber,
                bankName: bankName,
                bankCode: bankCode,
                recipientCode: recipientCode,
                userId
            }
            await bankQueries.createBankDetails(createBankDetailsPayload)
            return successResponse(201, "", "Bank added successfully")    
        } catch (error) {
            return errorResponse(500, error, `An error occurred while processing request: ${error.message}`)
        }
    }

}

export default new UserService()