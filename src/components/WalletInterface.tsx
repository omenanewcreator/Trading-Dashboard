import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storageUtils } from '@/utils/storage';
import { toast } from 'sonner';
import { WalletData, Transaction, NotificationData } from '@/types';
import MayaReceipt from './MayaReceipt';

const banks = ['BDO', 'BPI', 'Metrobank', 'RCBC', 'UnionBank', 'Security Bank', 'Maya Wallet', 'GCash', 'PayMaya', 'Cebuana Lhuillier', 'Palawan Express'];

const WalletInterface = () => {
  const [walletData, setWalletData] = useState<WalletData>(storageUtils.getWallet());
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWalletData(storageUtils.getWallet());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = (title: string, message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    const notifications = storageUtils.getNotifications();
    const newNotification: NotificationData = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    notifications.unshift(newNotification);
    storageUtils.setNotifications(notifications);
  };

  const getDefaultWithdrawalSettings = () => {
    const savedDefaults = localStorage.getItem('admin_default_withdrawal');
    if (savedDefaults) {
      return JSON.parse(savedDefaults);
    }
    return {
      status: 'pending',
      instructions: 'Please wait while we process your withdrawal request. You will receive updates via notifications.'
    };
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!bank) {
      toast.error('Please select your bank');
      return;
    }
    if (!accountNumber.trim() || !accountName.trim()) {
      toast.error('Please enter your account details');
      return;
    }
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error('Enter a valid withdrawal amount');
      return;
    }
    if (withdrawAmount > walletData.balance) {
      toast.error('Insufficient balance');
      return;
    }

    const defaultSettings = getDefaultWithdrawalSettings();
    
    const newTransaction: Transaction = {
      id: `WD${Date.now()}`,
      type: 'withdrawal',
      amount: withdrawAmount,
      status: defaultSettings.status,
      date: new Date().toISOString(),
      method: bank,
      accountName: accountName,
      accountNumber: accountNumber,
      referenceNumber: `REF${Date.now()}`,
      description: defaultSettings.instructions
    };

    const updatedWallet: WalletData = {
      balance: walletData.balance - withdrawAmount,
      transactions: [newTransaction, ...walletData.transactions],
      lastUpdated: new Date().toISOString()
    };

    storageUtils.setWallet(updatedWallet);
    setWalletData(updatedWallet);
    
    // Add notification
    addNotification(
      'Withdrawal Submitted',
      `Your withdrawal request for ₱${withdrawAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} has been submitted and is ${defaultSettings.status}.`,
      'success'
    );
    setAmount('');
    setAccountName('');
    setAccountNumber('');
    setBank('');
    setLastTransaction(newTransaction);
    setShowReceipt(true);
    
    toast.success(`Withdrawal submitted successfully! Status: ${defaultSettings.status}`);
    console.log('💸 Withdrawal created:', newTransaction);
  };

  const handleDepositClick = () => {
    toast.info('Kindly Contact the company headline management for payment details. Thank you!', {
      duration: 5000,
    });
    
    // Add notification
    addNotification(
      'Deposit Information',
      'Please contact company management for deposit payment details. They will provide you with the necessary information to proceed.',
      'info'
    );
  };

  const closeReceipt = () => {
    setShowReceipt(false);
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col max-h-[calc(100vh-4rem)] overflow-auto px-4 sm:px-6 py-4 space-y-6 bg-gray-50"
    >
      {/* Balance Display */}
      <Card className="max-w-lg w-full mx-auto">
        <CardContent className="p-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Available Balance</h2>
            <p className="text-3xl font-bold text-blue-600">
              ₱{walletData.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="max-w-lg w-full mx-auto">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleDepositClick} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              💰 Deposit Funds
            </Button>
            <Button 
              onClick={() => {
                // Scroll to withdrawal form if not visible
                document.getElementById('withdrawal-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              💸 Withdraw Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      <Card className="max-w-lg w-full mx-auto" id="withdrawal-form">
        <CardHeader>
          <CardTitle className="flex items-center">
            💸 Withdraw Funds
          </CardTitle>
          <p className="text-sm text-gray-600">
            Submit your withdrawal request. Processing time: 1-3 business days.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank">Select Bank/Payment Method *</Label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger id="bank">
                <SelectValue placeholder="Choose your bank or payment method" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name *</Label>
            <Input
              id="accountName"
              type="text"
              placeholder="Enter your full account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              type="text"
              placeholder="Enter your account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Withdraw *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount (minimum ₱100)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={100}
              max={walletData.balance}
            />
            <p className="text-xs text-gray-500">
              Available: ₱{walletData.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Please ensure your account details are correct. 
              Incorrect details may cause delays in processing your withdrawal.
            </p>
          </div>

          <Button onClick={handleWithdraw} className="w-full" size="lg">
            🚀 Submit Withdrawal Request
          </Button>
        </CardContent>
      </Card>

      {/* Receipt Section */}
      {showReceipt && lastTransaction && (
        <Card className="max-w-lg w-full mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              🧾 Withdrawal Receipt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MayaReceipt 
              transaction={lastTransaction} 
              onClose={closeReceipt}
            />
          </CardContent>
        </Card>
      )}

      {/* Recent Withdrawals */}
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {walletData.transactions
              .filter(t => t.type === 'withdrawal')
              .slice(0, 3)
              .map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">₱{transaction.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm text-gray-600">{transaction.method}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('en-PH')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            }
            {walletData.transactions.filter(t => t.type === 'withdrawal').length === 0 && (
              <p className="text-center text-gray-500 py-4">No withdrawal history yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletInterface;