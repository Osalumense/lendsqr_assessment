import { z } from "zod"

export const validateRegistration = z.object({
    email: z.string().trim().email(),
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    phone: z.string().optional(),
    password: z.string().min(6),
});

export const validateLogin = z.object({
    email: z.string().trim().email(),
    password: z.string().min(6),
});

export const validateFundAccount = z.object({
    amount: z.number(),
    customer: z.string()
});

export const validateTransfer = z.object({
    email: z.string().email(),
    description: z.string().trim().optional(),
    amount: z.number()
});

export const validateWithdraw = z.object({
    amount: z.number()
});

export const validateAddBank = z.object({
    name: z.string(),
    accountNumber: z.number(),
    bankName: z.string(),
    description: z.string().trim().optional()
});


