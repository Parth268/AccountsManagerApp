import type { Transaction } from './Transaction';

export interface User {
    id: string;
    phoneNumber: string;
    address:string,
    type: "receive" | "send";
    amount: number;
    name: string;
    email: string;
    timestamp: string;
    userType: "customer" | "supplier";
    createdAt: string;
    updatedAt: string;
    userId: string;
    transactions: Transaction[];
}
