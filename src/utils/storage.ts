import { User, WalletData, NotificationData } from '@/types';

const STORAGE_KEYS = {
  USER: 'trading_wallet_user',
  WALLET: 'trading_wallet_data',
  NOTIFICATIONS: 'trading_wallet_notifications',
  AUTH: 'trading_wallet_auth'
};

export const storageUtils = {
  // Authentication
  setAuth: (isAuthenticated: boolean) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  },
  getAuth: (): boolean => {
    const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
    return auth ? JSON.parse(auth) : false;
  },

  // User data
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  getUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  // Wallet data
  setWallet: (wallet: WalletData) => {
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
  },
  getWallet: (): WalletData => {
    const wallet = localStorage.getItem(STORAGE_KEYS.WALLET);
    return wallet ? JSON.parse(wallet) : {
      balance: 98880.00,
      transactions: [],
      lastUpdated: new Date().toISOString()
    };
  },

  // Check if wallet exists in storage
  hasWallet: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.WALLET) !== null;
  },
  // Notifications
  setNotifications: (notifications: NotificationData[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },
  getNotifications: (): NotificationData[] => {
    const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return notifications ? JSON.parse(notifications) : [];
  },

  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  reverseLastWithdrawal(): boolean {
    const wallet = this.getWallet();
    if (!wallet.transactions || wallet.transactions.length === 0) {
      return false;
    }
    // Find last withdrawal transaction
    const lastWithdrawalIndex = wallet.transactions.findIndex(t => t.type === 'withdrawal');
    if (lastWithdrawalIndex === -1) {
      return false;
    }

    const lastWithdrawal = wallet.transactions[lastWithdrawalIndex];

    // Remove last withdrawal transaction
    wallet.transactions.splice(lastWithdrawalIndex, 1);

    // Refund withdrawal amount into balance
    wallet.balance += lastWithdrawal.amount;

    wallet.lastUpdated = new Date().toISOString();

    this.setWallet(wallet);
    return true;
  },

  updateTransactionStatus(id: string, status: string): boolean {
    const wallet = this.getWallet();
    const transaction = wallet.transactions.find(t => t.id === id);
    if (transaction) {
      transaction.status = status as any;
      this.setWallet(wallet);
      return true;
    }
    return false;
  },

  updateTransactionInstructions(id: string, instructions: string): boolean {
    const wallet = this.getWallet();
    const transaction = wallet.transactions.find(t => t.id === id);
    if (transaction) {
      transaction.description = instructions;
      this.setWallet(wallet);
      return true;
    }
    return false;
  },
  getPendingWithdrawals() {
    const wallet = this.getWallet();
    return wallet.transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
  }
};