import { WalletData } from '@/types';
import { storageUtils } from './storage';

export const initializeSampleData = (): void => {
  console.log('🔄 Starting data initialization...');
  
  // Check if user already initialized
  if (!storageUtils.getUser()) {
    console.log('👤 No user found, creating default user...');
    const user = {
      name: 'Celberto Gualin Zamora',
      country: 'Philippines 🇵🇭',
      mobile: '+639468639470',
      email: 'celbrtozamora@gmail.com',
      tradingId: 'INVESTOR001',
      profileImage: 'https://firebasestorage.googleapis.com:443/v0/b/steercode.firebasestorage.app/o/users%2Fl8LIPNE2YaSskI1yRq3l6iKnHt32%2Fattachments%2F5DEF6E66-8A12-4846-A0C6-395B95CD5800.jpeg?alt=media&token=12fa4e30-78b2-442b-8a5f-081dde2d1ac3',
      linkedAccount: {
        type: 'Maya Wallet',
        accountName: 'Celberto Gualin Zamora',
        accountNumber: '09468639470',
      },
    };
    storageUtils.setUser(user);
    console.log('✅ Default user created and saved');
  } else {
    console.log('👤 User already exists in storage');
  }

  // Check if wallet data already exists using the new hasWallet method
  if (!storageUtils.hasWallet()) {
    console.log('💰 No wallet found, creating default wallet with sample transactions...');
    const wallet: WalletData = {
      balance: 98880.0,
      lastUpdated: new Date().toISOString(),
      transactions: [
        {
          id: 'wd001',
          type: 'withdrawal',
          amount: 5000,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          status: 'pending',
          description: 'Withdrawal to Maya Wallet - Pending Review',
          accountName: 'Celberto Gualin Zamora',
          accountNumber: '09468639470',
          referenceNumber: 'WD001-2024',
        },
        {
          id: 'wd002',
          type: 'withdrawal',
          amount: 3000,
          date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
          status: 'processing',
          description: 'Withdrawal to Maya Wallet - In Progress',
          accountName: 'Celberto Gualin Zamora',
          accountNumber: '09468639470',
          referenceNumber: 'WD002-2024',
        },
        {
          id: 'wd003',
          type: 'withdrawal',
          amount: 2000,
          date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
          status: 'completed',
          description: 'Withdrawal to Maya Wallet - Completed Successfully',
          accountName: 'Celberto Gualin Zamora',
          accountNumber: '09468639470',
          referenceNumber: 'WD003-2024',
        },
        {
          id: 'dp001',
          type: 'deposit',
          amount: 50000,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          status: 'completed',
          description: 'Initial Trading Capital Deposit',
          referenceNumber: 'DP001-2024',
        },
        {
          id: 'dp002',
          type: 'deposit',
          amount: 60000,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
          status: 'completed',
          description: 'Trading Account Top-up',
          referenceNumber: 'DP002-2024',
        },
      ],
    };
    storageUtils.setWallet(wallet);
    console.log('✅ Default wallet created with sample transactions:', wallet.transactions.length, 'transactions');
    console.log('💰 Withdrawal transactions created:', wallet.transactions.filter(t => t.type === 'withdrawal').length);
  } else {
    console.log('💰 Wallet already exists in storage');
    const existingWallet = storageUtils.getWallet();
    console.log('📊 Existing wallet transactions:', existingWallet.transactions.length);
    console.log('📤 Existing withdrawals:', existingWallet.transactions.filter(t => t.type === 'withdrawal').length);
  }
  
  console.log('✅ Data initialization complete!');
};