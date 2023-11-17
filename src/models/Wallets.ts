import { 
    FundAccountDTO, 
    createTransactionDTO,
    WithdrawdDTO,
    TransferDTO,
 } from "../DTOs/transactions.dto";
import { Knex } from "../config/config";
import Paystack from "../helpers/paystack"
import userQueries from "./User";
const KnexConfig = Knex.config;

export interface WalletInstance {
    id?: number;
    userId: number;
    balance?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface TransactionInstance {
    walletId: number;
    amount: number;
    transactionType?: string;
    currentBalance: number;
    previousBalance: number;
}

export interface BankDetailsInstance {
    id?: number;
    type?: string;
    name?: string;
    accountNumber?: string;
    bankName?: string;
    bankCode?: string;
    currency?: string;
    recipientCode?: string;
    userId: number;
}

const knexInstance = require('knex')(KnexConfig);

//TODO: Make all functions ACID 
class Wallet {
    private knex: any;

    constructor(knex: any) {
        this.knex = knex;
    }

    async createUserWallet(userId: number):
    Promise<WalletInstance> {
        return await this.knex("wallets").insert({userId}).onConflict('userId').merge();
    }

    async getUserWalletByUserId(userId: number):
    Promise<WalletInstance> {
        return await this.knex("wallets").where("userId", userId).first();
    }

    async getUserWalletById(id: number):
    Promise<WalletInstance> {
        return await this.knex("wallets").where("id", id).first();
    }

    async creditUserWallet(payload: FundAccountDTO): Promise<WalletInstance | Object | any> {
        const { id, amount, description } = payload
        let transaction: any
        if(amount < 0.00) return ({message: "Amount must be greater than 0", error: true})        
        const getWallet = await this.getUserWalletById(id)
        if(!getWallet) return ({message: "Wallet not found", error: true})
        const previousBalance: number = getWallet?.balance ?? 0.00
        const newBalance: number = Number(previousBalance) + Number(amount)
        const walletId = getWallet?.id
        await this.createTransaction({
            walletId, 
            amount, 
            currentBalance: newBalance, 
            transactionType: "credit",
            previousBalance,
            description,
        })
        const updateWalletBalance = await this.knex("wallets").where("id", id).update({
            balance: newBalance
        })
        return ({message: "Wallet funded", error: false})
    }
        
    async debitUserWallet(payload: FundAccountDTO): Promise<WalletInstance | Object | any> {
        const { id, userId, amount, description } = payload
        try {
            await this.knex.transaction(async (trx) => {
                if (amount < 0.00) throw new Error("Amount must be greater than 0");    
                const getWallet = await this.getUserWalletById(id);
                if (!getWallet) return ({ message: "Wallet not found", error: true });
                if (getWallet.balance === undefined || getWallet.balance < amount) {
                    return ({ message: "Insufficient funds", error: true });
                }    
                const previousBalance: number = getWallet?.balance ?? 0.00;
                const newBalance: number = Number(previousBalance) - Number(amount);
                const walletId = getWallet?.id;
                await this.createTransaction({
                    walletId,
                    amount,
                    currentBalance: newBalance,
                    transactionType: "debit",
                    previousBalance,
                    description,
                });
                await trx("wallets").where("userId", userId).update({
                    balance: newBalance,
                });
            });
            return ({ message: "Transaction successful", error: false });
        } catch (error) {
            console.error("Error in debitUserWallet transaction:", error);
            return { message: "Transaction failed", error: true };
        }
    }

    async withdraw(payload: WithdrawdDTO): Promise<any> {
        const { userId, amount } = payload
        if(amount < 0.00) return ({message: "Amount must be greater than 0", error: true})
        const user = await userQueries.getUserById(userId)
        if(!user) return ({message: "User not found", error: true})
        const getWallet = await this.getUserWalletByUserId(userId)
        if(!getWallet || getWallet.id === null) return ({message: "Wallet not found", error: true})
        const userBankDetails = await this.getUserBankDetails(userId)
        if(!userBankDetails) return ({message: "No bank details found for user", error: true })
        const walletId: number = getWallet?.id ?? 0
        const debitWalletPayload = {
            id: walletId,
            userId,
            amount: amount
        }
        const debitWallet = await this.debitUserWallet(debitWalletPayload)
        if(debitWallet.error === false) {
            const initiateDebit = await Paystack.initiateTransfer(amount, userBankDetails?.recipientCode || '')
            if (initiateDebit.status === true) return ({message: "Transaction successful", error: false})
            const refund = await this.creditUserWallet(debitWalletPayload)
            return ({message: initiateDebit.message, error: true})
        } 
        return ({message: debitWallet.message, error: debitWallet.error})
    }

    async transfer(payload: TransferDTO): Promise<any> {
        try {
            const { userId, email, amount, description } = payload;
            let userWallet: WalletInstance;
            let beneficiaryWallet: WalletInstance;
            let userWalletId: number = 0;
            let beneficiaryWalletId: number = 0;
    
            const getUser = await userQueries.getUserById(userId);
            const beneficiary = await userQueries.getUserByEmail(email);    
            if (getUser) {
                userWallet = await this.getUserWalletByUserId(userId);
                if (!userWallet) return { message: "User wallet not found", error: true };
                userWalletId = userWallet?.id ?? 0;
            }
    
            if (beneficiary) {
                beneficiaryWallet = await this.getUserWalletByUserId(beneficiary?.id);
                if (!beneficiaryWallet) return { message: "Beneficiary wallet not found", error: true };
                beneficiaryWalletId = beneficiaryWallet?.id ?? 0;
            }
    
            const debitPayload = {
                id: userWalletId,
                userId: getUser?.id,
                amount,
                description
            };
    
            const debitResult = await this.debitUserWallet(debitPayload);    
            if (debitResult && !debitResult.error) {
                const creditPayload = {
                    id: beneficiaryWalletId,
                    amount,
                    description
                };    
                const creditBeneficiary = await this.creditUserWallet(creditPayload);
    
                if (creditBeneficiary && !creditBeneficiary.error) {
                    return { message: "Transfer successful", error: false };
                } else {
                    return { message: creditBeneficiary.message, error: creditBeneficiary.error };
                }
            } else {
                return { message: debitResult.message, error: debitResult.error };
            }
        } catch (error) {
            console.error(error);
            return { message: `An error occurred: ${error.message}`, error: true };
        }
    }
    

    async createTransaction(payload: createTransactionDTO): Promise<TransactionInstance> {
        const { walletId, amount, currentBalance, transactionType, previousBalance, description } = payload
        return await this.knex("transactions").insert({
            walletId: walletId,
            amount: amount,
            transactionType: transactionType,
            currentBalance: currentBalance,
            previousBalance: previousBalance,
            description: description
        })
    }

    async getUserBankDetails(userId: number): Promise<BankDetailsInstance> {
        return await this.knex("bankDetails").where("userId", userId).first()
    }

}

let walletQueries = new Wallet(knexInstance)
export default walletQueries;

