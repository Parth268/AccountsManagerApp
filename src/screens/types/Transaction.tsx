export interface Transaction {
    id: string;
    userId: string;
    phoneNumber: string;
    type: 'receive' | 'send';
    amount: number;
    name: string;
    imageUrl: string;
    email: string;
    timestamp: string;
    userType: 'customer' | 'supplier';
    transactionId: string;
}
