export interface User {
  name: string;
  country: string;
  mobile: string;
  email: string;
  tradingId: string;
  profileImage?: string;
  linkedAccount: {
    type: string;
    accountName: string;
    accountNumber: string;
  };
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'processing' | 'on hold' | 'ongoing' | 'declined';
  date: string;
  accountName?: string;
  accountNumber?: string;
  referenceNumber?: string;
  description?: string;
  dutyCharge?: number;
  method?: string;
}

export interface WalletData {
  balance: number;
  transactions: Transaction[];
  lastUpdated: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  category?: 'transaction' | 'security' | 'market' | 'account' | 'system';
  priority?: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
}