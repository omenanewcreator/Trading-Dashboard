import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter,
  Eye,
  Download,
  Calendar
} from 'lucide-react';
import { storageUtils } from '@/utils/storage';
import { WalletData, Transaction } from '@/types';
import MayaReceipt from './MayaReceipt';

const TransactionHistory = () => {
  const [walletData] = useState<WalletData>(storageUtils.getWallet());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const filteredTransactions = walletData.transactions
    .filter(transaction => {
      const matchesSearch = transaction.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const viewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsDialog(true);
  };

  const viewReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowReceiptDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'on hold':
        return 'bg-orange-100 text-orange-800';
      case 'ongoing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalDeposits = walletData.transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = walletData.transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingTransactions = walletData.transactions
    .filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total</p>
                <p className="text-lg sm:text-2xl font-bold">{walletData.transactions.length}</p>
              </div>
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                <Calendar className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Deposits</p>
                <p className="text-sm sm:text-xl font-bold text-green-600">{formatCurrency(totalDeposits)}</p>
              </div>
              <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg">
                <ArrowDownRight className="h-3 w-3 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Withdrawals</p>
                <p className="text-sm sm:text-xl font-bold text-red-600">{formatCurrency(totalWithdrawals)}</p>
              </div>
              <div className="bg-red-100 p-1.5 sm:p-2 rounded-lg">
                <ArrowUpRight className="h-3 w-3 sm:h-5 sm:w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">{pendingTransactions}</p>
              </div>
              <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-lg">
                <Filter className="h-3 w-3 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile-Optimized Transaction List */}
          <div className="space-y-2 sm:space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} 
                     className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                     onClick={() => viewTransactionDetails(transaction)}>
                  
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-full ${
                          transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'deposit' ? 
                            <ArrowDownRight className="h-3 w-3 text-green-600" /> :
                            <ArrowUpRight className="h-3 w-3 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-semibold capitalize">{transaction.type}</p>
                          <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{formatDateShort(transaction.date)}</span>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewTransactionDetails(transaction);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {transaction.type === 'withdrawal' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewReceipt(transaction);
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {transaction.description && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{transaction.description}</p>
                    )}
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'deposit' ? 
                          <ArrowDownRight className="h-4 w-4 text-green-600" /> :
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        }
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold capitalize">{transaction.type}</p>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                        {transaction.method && (
                          <p className="text-sm text-gray-400">via {transaction.method}</p>
                        )}
                        {transaction.description && (
                          <p className="text-sm text-gray-400 truncate max-w-xs">{transaction.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewTransactionDetails(transaction);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {transaction.type === 'withdrawal' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewReceipt(transaction);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 sm:py-12 text-gray-500">
                <Calendar className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">No transactions found</p>
                <p className="text-xs sm:text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg">Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="text-center">
                <div className={`inline-flex p-3 rounded-full mb-3 ${
                  selectedTransaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {selectedTransaction.type === 'deposit' ? 
                    <ArrowDownRight className="h-6 w-6 text-green-600" /> :
                    <ArrowUpRight className="h-6 w-6 text-red-600" />
                  }
                </div>
                <h3 className="text-lg font-semibold capitalize">{selectedTransaction.type}</h3>
                <p className={`text-xl sm:text-2xl font-bold ${
                  selectedTransaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(selectedTransaction.amount)}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status}
                  </Badge>
                </div>

                {selectedTransaction.referenceNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference</span>
                    <span className="font-mono text-xs">{selectedTransaction.referenceNumber}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="text-xs">{formatDate(selectedTransaction.date)}</span>
                </div>

                {selectedTransaction.accountName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name</span>
                    <span className="text-xs">{selectedTransaction.accountName}</span>
                  </div>
                )}

                {selectedTransaction.accountNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number</span>
                    <span className="font-mono text-xs">{selectedTransaction.accountNumber}</span>
                  </div>
                )}

                {selectedTransaction.method && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="text-xs">{selectedTransaction.method}</span>
                  </div>
                )}

                {selectedTransaction.description && (
                  <div>
                    <span className="text-gray-600">Description</span>
                    <p className="text-xs mt-1 p-3 bg-gray-50 rounded">{selectedTransaction.description}</p>
                  </div>
                )}
              </div>

              {selectedTransaction.type === 'withdrawal' && (
                <Button 
                  onClick={() => {
                    setShowDetailsDialog(false);
                    viewReceipt(selectedTransaction);
                  }}
                  className="w-full mt-4"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  View Receipt
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-lg max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg">Transaction Receipt</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <MayaReceipt 
              transaction={selectedTransaction} 
              onClose={() => setShowReceiptDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionHistory;