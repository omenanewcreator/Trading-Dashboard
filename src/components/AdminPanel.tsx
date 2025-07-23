import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { WalletData, Transaction, User, NotificationData } from '@/types';
import { storageUtils } from '@/utils/storage';
import { Plus, Minus, RefreshCw, Settings, Shield, CreditCard, Key, User as UserIcon } from 'lucide-react';

const statusOptions = ['pending', 'processing', 'on hold', 'ongoing', 'declined', 'completed'];

const AdminPanel = () => {
  const [wallet, setWallet] = useState<WalletData>(storageUtils.getWallet());
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [statusEdit, setStatusEdit] = useState('pending');
  const [instructionEdit, setInstructionEdit] = useState('');
  const [userState, setUserState] = useState<User | null>(null);
  // Balance Management
  const [creditAmount, setCreditAmount] = useState('');
  const [debitAmount, setDebitAmount] = useState('');
  const [creditDescription, setCreditDescription] = useState('');
  // Default Withdrawal Settings
  const [defaultStatus, setDefaultStatus] = useState('pending');
  const [defaultInstructions, setDefaultInstructions] = useState('Please wait while we process your withdrawal request.');
  // Access Code Management
  const [newTradingId, setNewTradingId] = useState('');

  useEffect(() => {
    console.log('🔧 AdminPanel: Loading data...');
    
    // Safely get user data
    const userData = storageUtils.getUser();
    if (userData) {
      setUserState(userData);
      console.log('✅ AdminPanel: User data loaded successfully:', userData.name, userData.tradingId);
    } else {
      console.warn('⚠️ AdminPanel: No user data found');
    }
    
    const walletData = storageUtils.getWallet();
    setWallet(walletData);
    // Load default withdrawal settings
    const savedDefaults = localStorage.getItem('admin_default_withdrawal');
    if (savedDefaults) {
      const defaults = JSON.parse(savedDefaults);
      setDefaultStatus(defaults.status);
      setDefaultInstructions(defaults.instructions);
      console.log('⚙️ AdminPanel: Default settings loaded:', defaults);
    }
    const withdrawals = walletData.transactions.filter(t => t.type === 'withdrawal');
    console.log('📤 AdminPanel: Found', withdrawals.length, 'withdrawal transactions');
    console.log('💰 AdminPanel: Current balance:', walletData.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 }));
    
    // Data loading complete
    console.log('✅ AdminPanel: All data loaded successfully');
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

  const handleSelectTransaction = (txnId: string) => {
    console.log('🎯 AdminPanel: Selecting transaction:', txnId);
    const txn = wallet.transactions.find(t => t.id === txnId);
    if (txn) {
      setSelectedTransactionId(txnId);
      setStatusEdit(txn.status || 'pending');
      setInstructionEdit(txn.description || '');
      console.log('✅ AdminPanel: Transaction selected:', txn);
    }
  };

  const saveTransactionUpdates = () => {
    if (!selectedTransactionId) {
      toast.error('Please select a transaction to update');
      return;
    }

    console.log('💾 AdminPanel: Saving transaction updates...');
    
    const updatedTransactions = wallet.transactions.map(txn => {
      if (txn.id === selectedTransactionId) {
        return { ...txn, status: statusEdit as any, description: instructionEdit };
      }
      return txn;
    });

    const updatedWallet = { ...wallet, transactions: updatedTransactions, lastUpdated: new Date().toISOString() };

    storageUtils.setWallet(updatedWallet);
    setWallet(updatedWallet);
    
    // Add notification
    addNotification(
      'Transaction Updated',
      `Withdrawal transaction ${selectedTransactionId} status changed to ${statusEdit}`,
      'success'
    );
    
    toast.success('Transaction updated successfully');
    console.log('✅ AdminPanel: Transaction updated');
  };

  const creditBalance = () => {
    const amount = parseFloat(creditAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid credit amount');
      return;
    }

    const updatedWallet = { ...wallet };
    updatedWallet.balance += amount;

    // Add credit transaction to history
    const creditTransaction: Transaction = {
      id: `credit_${Date.now()}`,
      type: 'deposit',
      amount: amount,
      status: 'completed',
      date: new Date().toISOString(),
      description: creditDescription || 'Credited by company',
      referenceNumber: `CR${Date.now()}`
    };

    updatedWallet.transactions.unshift(creditTransaction);
    updatedWallet.lastUpdated = new Date().toISOString();

    storageUtils.setWallet(updatedWallet);
    setWallet(updatedWallet);
    
    // Add notification
    addNotification(
      'Balance Credited',
      `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} has been credited to the account`,
      'success'
    );

    setCreditAmount('');
    setCreditDescription('');
    toast.success(`₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} credited successfully`);
    console.log('💰 Balance credited:', amount);
  };

  const debitBalance = () => {
    const amount = parseFloat(debitAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid debit amount');
      return;
    }

    if (amount > wallet.balance) {
      toast.error('Insufficient balance for debit');
      return;
    }

    const updatedWallet = { ...wallet };
    updatedWallet.balance -= amount;
    updatedWallet.lastUpdated = new Date().toISOString();

    storageUtils.setWallet(updatedWallet);
    setWallet(updatedWallet);
    
    // Add notification
    addNotification(
      'Balance Debited',
      `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} has been debited from the account`,
      'warning'
    );

    setDebitAmount('');
    toast.success(`₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} debited successfully`);
    console.log('💸 Balance debited:', amount);
  };

  const resetAccount = () => {
    if (!window.confirm('Are you sure you want to reset the entire account? This will clear all balance and transaction history.')) {
      return;
    }

    const resetWallet: WalletData = {
      balance: 0,
      transactions: [],
      lastUpdated: new Date().toISOString()
    };

    storageUtils.setWallet(resetWallet);
    setWallet(resetWallet);
    
    // Clear notifications
    storageUtils.setNotifications([]);
    
    // Add reset notification
    addNotification(
      'Account Reset',
      'Account has been reset to zero balance with cleared transaction history',
      'info'
    );

    toast.success('Account reset successfully');
    console.log('🔄 Account reset completed');
  };

  const saveDefaultSettings = () => {
    const defaults = {
      status: defaultStatus,
      instructions: defaultInstructions
    };
    
    localStorage.setItem('admin_default_withdrawal', JSON.stringify(defaults));
    toast.success('Default withdrawal settings saved');
    console.log('⚙️ Default settings saved:', defaults);
  };

  const updateTradingId = () => {
    if (!newTradingId.trim()) {
      toast.error('Please enter a valid Trading ID');
      return;
    }

    const user = storageUtils.getUser();
    if (user) {
      const oldTradingId = user.tradingId;
      user.tradingId = newTradingId.trim().toUpperCase();
      storageUtils.setUser(user);

      // Update local state
      setUserState(user);
      // Add notification
      addNotification(
        'Access Code Updated',
        `Trading ID changed from ${oldTradingId} to ${user.tradingId}`,
        'success'
      );

      setNewTradingId('');
      toast.success(`Trading ID updated to: ${user.tradingId}`);
      console.log('🔑 Trading ID updated:', user.tradingId);
    } else {
      toast.error('Unable to update Trading ID: User data not found');
      console.error('⚠️ No user data found when trying to update Trading ID');
    }
  };

  const withdrawalTransactions = wallet.transactions.filter(t => t.type === 'withdrawal');

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-semibold">Admin Control Panel</h2>
          {userState && (
            <div className="flex items-center space-x-2 ml-4">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">User: {userState.name}</span>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Current Balance: ₱{wallet.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Management ({withdrawalTransactions.length} transactions)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-y-auto max-h-80 mb-4 border rounded-lg p-4">
                {withdrawalTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No withdrawal transactions found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {withdrawalTransactions.map(txn => (
                      <div
                        key={txn.id}
                        onClick={() => handleSelectTransaction(txn.id)}
                        className={`cursor-pointer p-4 rounded-lg border transition-all hover:shadow-md ${
                          txn.id === selectedTransactionId 
                            ? 'border-blue-600 bg-blue-50 shadow-md' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><strong>ID:</strong> {txn.id}</div>
                          <div><strong>Status:</strong> 
                            <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                              txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              txn.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              txn.status === 'completed' ? 'bg-green-100 text-green-800' :
                              txn.status === 'declined' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {txn.status}
                            </span>
                          </div>
                          <div><strong>Amount:</strong> ₱{txn.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
                          <div><strong>Date:</strong> {new Date(txn.date).toLocaleDateString('en-PH')}</div>
                          <div className="col-span-2"><strong>Description:</strong> {txn.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedTransactionId && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Edit Transaction: {selectedTransactionId}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Select value={statusEdit} onValueChange={setStatusEdit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Instructions / Notes</Label>
                    <Textarea
                      value={instructionEdit}
                      onChange={e => setInstructionEdit(e.target.value)}
                      placeholder="Additional notes or instructions..."
                      rows={3}
                    />
                  </div>

                  <Button onClick={saveTransactionUpdates} className="w-full">
                    Update Transaction
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Management Tab */}
        <TabsContent value="balance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Credit Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-green-600" />
                  Credit Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Amount (₱)</Label>
                  <Input
                    type="number"
                    value={creditAmount}
                    onChange={e => setCreditAmount(e.target.value)}
                    placeholder="Enter amount to credit"
                  />
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Input
                    value={creditDescription}
                    onChange={e => setCreditDescription(e.target.value)}
                    placeholder="e.g., Trading bonus, Refund"
                  />
                </div>
                <Button onClick={creditBalance} className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Credit Balance
                </Button>
              </CardContent>
            </Card>

            {/* Debit Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Minus className="h-5 w-5 mr-2 text-red-600" />
                  Debit Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Amount (₱)</Label>
                  <Input
                    type="number"
                    value={debitAmount}
                    onChange={e => setDebitAmount(e.target.value)}
                    placeholder="Enter amount to debit"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Available Balance: ₱{wallet.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </div>
                <Button onClick={debitBalance} className="w-full bg-red-600 hover:bg-red-700">
                  <Minus className="h-4 w-4 mr-2" />
                  Debit Balance
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Reset Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <RefreshCw className="h-5 w-5 mr-2" />
                Reset Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                This will permanently clear all balance and transaction history. This action cannot be undone.
              </p>
              <Button onClick={resetAccount} variant="destructive" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Account to Zero
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Default Withdrawal Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Status for New Withdrawals</Label>
                <Select value={defaultStatus} onValueChange={setDefaultStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Default Instructions</Label>
                <Textarea
                  value={defaultInstructions}
                  onChange={e => setDefaultInstructions(e.target.value)}
                  placeholder="Default message for withdrawal receipts..."
                  rows={3}
                />
              </div>

              <Button onClick={saveDefaultSettings} className="w-full">
                Save Default Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Management Tab */}
        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Trading ID Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Trading ID</Label>
                <Input value={userState?.tradingId || ''} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label>New Trading ID</Label>
                <Input
                  value={newTradingId}
                  onChange={e => setNewTradingId(e.target.value)}
                  placeholder="Enter new trading ID"
                />
              </div>

              <Button onClick={updateTradingId} className="w-full">
                Update Trading ID
              </Button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Changing the Trading ID will require users to login with the new ID. 
                  Make sure to communicate this change to the account holder.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multi-User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                User Management (Optional Feature)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current User Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Current Active User</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{userState?.name || 'Celberto Gualin Zamora'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Trading ID:</span>
                    <span className="ml-2 font-mono">{userState?.tradingId || 'INVESTOR001'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2">{userState?.email || 'celbrtozamora@gmail.com'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mobile:</span>
                    <span className="ml-2">{userState?.mobile || '+639468639470'}</span>
                  </div>
                </div>
              </div>

              {/* New User Creation Form */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4">Create New User Account</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label>Trading ID</Label>
                    <Input placeholder="e.g., INVESTOR002" />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="user@example.com" />
                  </div>
                  <div>
                    <Label>Mobile Number</Label>
                    <Input placeholder="+639XXXXXXXXX" />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input placeholder="e.g., Philippines 🇵🇭" />
                  </div>
                  <div>
                    <Label>Initial Balance</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Maya Wallet Account Name</Label>
                    <Input placeholder="Account holder name" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Maya Wallet Account Number</Label>
                    <Input placeholder="Account number" />
                  </div>
                </div>

                <Button 
                  onClick={() => toast.info('Multi-user creation feature is in development. Coming soon!')}
                  className="w-full mt-4"
                  disabled
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Create New User Account (Coming Soon)
                </Button>
              </div>

              {/* Feature Description */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">📋 Multi-User Feature Overview</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Create multiple user accounts with unique Trading IDs</li>
                  <li>• Each user has separate wallet balance and transaction history</li>
                  <li>• Independent profile management and settings</li>
                  <li>• Centralized admin control over all user accounts</li>
                  <li>• Individual login access with unique credentials</li>
                </ul>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Development Note:</strong> This feature requires database integration 
                    for proper multi-user support. Currently, the app operates in single-user mode.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;