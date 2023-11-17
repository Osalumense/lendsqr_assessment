import {
    AddBankDTO,
    AddBankDetailsDTO,
 } from "../DTOs/transactions.dto";
import { Knex } from "../config/config";
const KnexConfig = Knex.config;

export interface BankDetailInstance {
    id?: number;
    type?: string;
    name: string;
    accountNumber: number;
    bankName: string;
    bankCode?: string;
    recipientCode?: string;
    userId: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface BankInstance {
    id?: number;
    name: string;
    code: number;
    created_at?: Date;
    updated_at?: Date;
}

const knexInstance = require('knex')(KnexConfig);

class Banks {
    private knex: any;

    constructor(knex: any) {
        this.knex = knex;
    }

    async getBankByBankName(bankName: string): Promise<BankInstance> {
        return await this.knex("banks").where("name", bankName)
    }

    async getBankDetailsByBankName(bankName: string):
    Promise<BankDetailInstance> {
        return await this.knex("bankDetails").where("bankName", bankName).first();
    }

    async createBankDetails(payload: AddBankDetailsDTO): Promise<BankDetailInstance> {
        return await this.knex("bankDetails").insert(payload)
    }

}

let bankQueries = new Banks(knexInstance)
export default bankQueries;

