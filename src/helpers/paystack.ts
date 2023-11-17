import fetch from "isomorphic-fetch"
import { AppConfig } from "../config/config"
const config = AppConfig.config


export class Paystack {
    async initialize(email: string, amount: number){
        try{
            const response = await fetch('https://api.paystack.co/transaction/initialize', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "amount": amount*100
                })
            })
            return response.json()
        }catch(error){
            console.error(error)
        }
    }

    async verify(ref: string){
        try {
            const response = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },    
            })
            return await response.json()    
        } catch (error) {
            console.error(error)
        }
    
    }

    async resolveAcctNumber(number: number, code: number){
        try {
            const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${number}&bank_code=${code}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
            })
            return await response.json()
        } catch (error) {
            console.error(error)
        }    
    }
    
    async transferRecipient(name: string, acctNum: number, bankCode: number){
        try {
            const response = await fetch(`https://api.paystack.co/transferrecipient`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "type":"nuban",
                    "name" : name,
                    "account_number": acctNum,
                    "bank_code": bankCode,
                    "currency": "NGN"
                })
    
            })
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    
    }

    async initiateTransfer(amount: number , code: string){
        try {
            const response = await fetch(`https://api.paystack.co/transfer`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "source": "balance",
                    "amount": amount,
                    "recipient": code,
                    "reason": "Sample reason"
                })
    
            })           
            return await response.json()    
        } catch (error) {
            console.error(error)
        }
    
    }
}

export default new Paystack();