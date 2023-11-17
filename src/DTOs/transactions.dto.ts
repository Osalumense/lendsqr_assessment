
export interface FundAccountDTO {
    id: number;
    userId?: number;
    amount: number;
    description?: string;
}

export interface FundUserAccountDTO {
    id: number;
    customer: string;
    amount: number;
    description?: string;
}

export interface WithdrawdDTO {
    userId: number;
    amount: number;
    description?: string;
    recipientCode?: number
}

export interface TransferDTO {
    userId: number;
    email: string;
    amount: number;
    description?: string;
}

export interface createTransactionDTO {
    walletId?: number;
    amount: number;
    transactionType?: string;
    description?: string;
    currentBalance: number;
    previousBalance: number;
}

export interface AddBankDTO {
    name: string;
    accountNumber: number;
    bankName: string;
    userId: number;
}

export interface AddBankDetailsDTO {
    name: string;
    accountNumber: number;
    bankName: string;
    bankCode: number;
    recipientCode: string;
    userId: number;
}

