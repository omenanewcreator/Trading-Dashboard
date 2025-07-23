import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowUp, CheckCircle, ArrowDown, Bell, Eye, EyeOff
} from 'lucide-react';
import { storageUtils } from '@/utils/storage';
import { WalletData, Transaction, User } from '@/types';
import { toast } from 'sonner';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard = ({ onPageChange }: DashboardProps) => {
  const [walletData, setWalletData] = useState<WalletData>(storageUtils.getWallet());
  const [user] = useState<User>(storageUtils.getUser() as User);
  const [showBalance, setShowBalance] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setWalletData(storageUtils.getWallet());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  const recentTransactions = walletData.transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const handleDeposit = () => {
    toast.info('Kindly Contact the company headline management For payment Details To proceed Thank You!', {
      duration: 5000,
    });
  };

  const handleWithdraw = () => {
    onPageChange('wallet');
  };

  const greetingText = `Welcome Celberto`;

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === 'deposit') {
      return <ArrowDown className="h-3 w-3 text-green-600" />;
    } else if (transaction.description?.toLowerCase().includes('investment')) {
      return <CheckCircle className="h-3 w-3 text-blue-600" />;
    } else {
      return <ArrowUp className="h-3 w-3 text-red-600" />;
    }
  };

  const getTransactionColor = (transaction: Transaction) => {
    if (transaction.type === 'deposit') {
      return 'text-green-600';
    } else if (transaction.description?.toLowerCase().includes('investment')) {
      return 'text-blue-600';
    } else {
      return 'text-red-600';
    }
  };

  const formatTransactionAmount = (transaction: Transaction) => {
    const sign = transaction.type === 'deposit' ? '+' : '-';
    return `${sign}${formatCurrency(transaction.amount).replace('₱', '')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 pt-5">
      {/* Header area with profile pic and greeting text */}
      <div className="flex items-center justify-between mb-4 px-2 md:px-4 lg:px-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarImage src={user?.profileImage} alt={user?.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-base sm:text-lg font-semibold">
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              {greetingText}
            </h1>
          </div>
        </div>
        <div>
          <Button variant="ghost" className="rounded-full p-1">
            <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
          </Button>
        </div>
      </div>

      {/* Blue balance card */}
      <div className="bg-blue-600 rounded-2xl p-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto text-white shadow-lg">
        <div className="flex justify-between items-center mb-3 px-1">
          <div className="text-sm sm:text-base font-semibold tracking-tight">Total Balance</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            className="text-white hover:bg-white/20 p-1"
          >
            {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tighter">
          {showBalance ? formatCurrency(walletData.balance) : '₱ ••••••'}
        </div>

        {/* Deposit/Withdraw buttons on same row */}
        <div className="flex justify-center gap-4 mt-4 px-2">
          <Button
            onClick={handleDeposit}
            className="bg-white text-black py-2 px-4 sm:py-3 sm:px-6 rounded-md font-semibold text-sm sm:text-base"
          >
            Deposit
          </Button>
          <Button
            onClick={handleWithdraw}
            className="bg-white text-black py-2 px-4 sm:py-3 sm:px-6 rounded-md font-semibold text-sm sm:text-base"
          >
            Withdraw
          </Button>
        </div>
      </div>

      {/* Recent Transactions section */}
      <div className="mt-5 mb-5 px-2 md:px-4 lg:px-6 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <div className="flex justify-between items-center mb-3 px-1">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Quick Send</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange('transactions')}
            className="text-blue-600 hover:text-blue-700"
          >
            See All
          </Button>
        </div>

        {/* Transactions list */}
        <div className="space-y-2">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onPageChange('transactions')}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {getTransactionIcon(transaction)}
                  </div>
                  <div className="max-w-[140px] sm:max-w-[180px]">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate text-sm">
                        {transaction.description?.toLowerCase().includes('investment') ? 'Investment Approved' : 
                         transaction.description?.toLowerCase().includes('credited') ? 'Balance Credit' :
                         transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </p>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        transaction.status === 'failed' || transaction.status === 'declined' ? 'bg-red-100 text-red-800' :
                        transaction.status === 'on hold' ? 'bg-orange-100 text-orange-800' :
                        transaction.status === 'ongoing' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-600">
                        {new Date(transaction.date).toLocaleDateString('en-PH', {
                          weekday: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {transaction.method && (
                        <span className="text-xs text-gray-400">• {transaction.method}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-sm ${getTransactionColor(transaction)}`}>
                    {formatTransactionAmount(transaction)}
                  </div>
                  {transaction.referenceNumber && (
                    <div className="text-xs text-gray-400 font-mono">
                      {transaction.referenceNumber}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-2">💼</div>
              <p className="text-gray-600 text-sm">No recent transactions</p>
              <p className="text-gray-400 text-xs">Your transaction history will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Market Analysis and Trading News */}
      <div className="mt-8 mb-8 px-2 md:px-4 lg:px-6 max-w-full">
        {/* Stock Market Overview */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              📈 Market Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="font-bold text-green-600 text-lg">S&P 500</p>
                <p className="text-sm text-green-600">+0.85%</p>
                <p className="text-xs text-gray-600">4,587.44</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="font-bold text-blue-600 text-lg">NASDAQ</p>
                <p className="text-sm text-blue-600">+1.12%</p>
                <p className="text-xs text-gray-600">14,239.88</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="font-bold text-green-600 text-lg">DOW</p>
                <p className="text-sm text-green-600">+0.34%</p>
                <p className="text-xs text-gray-600">37,863.80</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="font-bold text-yellow-600 text-lg">GOLD</p>
                <p className="text-sm text-yellow-600">-0.15%</p>
                <p className="text-xs text-gray-600">$2,034.20</p>
              </div>
            </div>

            {/* Top Movers */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 text-sm">📊 Top Performers Today</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-green-50 rounded">
                  <p className="font-bold text-green-600">NVDA</p>
                  <p className="text-green-600">+3.45%</p>
                  <p className="text-gray-600">$875.28</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <p className="font-bold text-green-600">AAPL</p>
                  <p className="text-green-600">+2.17%</p>
                  <p className="text-gray-600">$189.95</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="font-bold text-red-600">TSLA</p>
                  <p className="text-red-600">-1.84%</p>
                  <p className="text-gray-600">$248.42</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market News */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              📰 Trading News & Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h5 className="font-semibold text-sm text-green-700">📈 Bullish Trend Alert</h5>
                <p className="text-xs text-gray-700 mt-1">
                  Tech stocks surge as AI companies report strong quarterly earnings. NVIDIA leads with 15% gain this week.
                </p>
                <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h5 className="font-semibold text-sm text-blue-700">💼 Market Analysis</h5>
                <p className="text-xs text-gray-700 mt-1">
                  Federal Reserve maintains interest rates as inflation shows signs of cooling. Market responds positively.
                </p>
                <p className="text-xs text-gray-500 mt-2">4 hours ago</p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h5 className="font-semibold text-sm text-yellow-700">⚠️ Risk Assessment</h5>
                <p className="text-xs text-gray-700 mt-1">
                  Energy sector volatility continues amid geopolitical tensions. Oil prices fluctuate between $82-87 range.
                </p>
                <p className="text-xs text-gray-500 mt-2">6 hours ago</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h5 className="font-semibold text-sm text-purple-700">🏦 Sector Spotlight</h5>
                <p className="text-xs text-gray-700 mt-1">
                  Financial sector shows strength as major banks report better-than-expected loan growth and credit quality.
                </p>
                <p className="text-xs text-gray-500 mt-2">8 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Tools Quick Access */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              🛠️ Trading Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col space-y-1" 
                onClick={() => onPageChange('trading')}
              >
                <span className="text-lg">📊</span>
                <span className="text-xs">Market Analysis</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col space-y-1"
                onClick={() => toast.info('Portfolio tracker coming soon!')}
              >
                <span className="text-lg">📈</span>
                <span className="text-xs">Portfolio Tracker</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col space-y-1"
                onClick={() => toast.info('Risk calculator coming soon!')}
              >
                <span className="text-lg">⚖️</span>
                <span className="text-xs">Risk Calculator</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col space-y-1"
                onClick={() => toast.info('Economic calendar coming soon!')}
              >
                <span className="text-lg">📅</span>
                <span className="text-xs">Economic Calendar</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col space-y-1"
                onClick={() => toast.info('Trading signals coming soon!')}
              >
                <span className="text-lg">🎯</span>
                <span className="text-xs">Trading Signals</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col space-y-1"
                onClick={() => toast.info('News alerts coming soon!')}
              >
                <span className="text-lg">📢</span>
                <span className="text-xs">News Alerts</span>
              </Button>
            </div>

            {/* Market Sentiment Indicator */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-sm">Market Sentiment</h5>
                <span className="text-green-600 font-bold">Bullish 📈</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '72%'}}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Bearish</span>
                <span>72% Bullish</span>
                <span>Very Bullish</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;