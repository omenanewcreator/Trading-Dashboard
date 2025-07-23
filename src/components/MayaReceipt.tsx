import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle, Clock, AlertTriangle, XCircle, Loader, Pause } from 'lucide-react';
import { Transaction } from '@/types';
import { toast } from 'sonner';

interface MayaReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}

const MayaReceipt = ({ transaction, onClose }: MayaReceiptProps) => {
  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const downloadReceipt = () => {
    // Create HTML content for the receipt
    const receiptContent = document.getElementById('maya-receipt-content');
    if (!receiptContent) return;

    // Create a new window for printing/downloading
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Maya Transaction Receipt - ${transaction.referenceNumber}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
            line-height: 1.6;
          }
          .receipt-container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }
          .receipt-header {
            background: linear-gradient(135deg, #00d4aa, #00b894);
            color: white;
            padding: 24px;
            text-align: center;
          }
          .receipt-body {
            padding: 24px;
          }
          .status-pending { color: #f59e0b; background: #fef3cd; }
          .status-processing { color: #3b82f6; background: #dbeafe; }
          .status-completed { color: #10b981; background: #d1fae5; }
          .status-failed, .status-declined { color: #ef4444; background: #fee2e2; }
          .status-hold { color: #f97316; background: #fed7aa; }
          .status-ongoing { color: #8b5cf6; background: #ede9fe; }
          .amount { font-size: 28px; font-weight: bold; }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
          }
          .status-box {
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
          }
          .status-title {
            font-weight: bold;
            margin-bottom: 8px;
          }
          .status-text {
            font-size: 14px;
            line-height: 1.5;
          }
          .instructions {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 16px;
            margin-top: 16px;
          }
          .instructions-title {
            color: #0c4a6e;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .instructions-text {
            color: #0c4a6e;
            font-size: 14px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        ${receiptContent.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
    toast.success('Receipt downloaded successfully!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
      case 'declined':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'on hold':
        return <Pause className="h-5 w-5 text-orange-500" />;
      case 'ongoing':
        return <AlertTriangle className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Transaction has been successfully processed and completed.';
      case 'pending':
        return 'Your withdrawal request is pending review and approval.';
      case 'processing':
        return 'Your withdrawal is currently being processed by our financial team.';
      case 'failed':
        return 'Transaction failed due to technical issues. Please contact support.';
      case 'declined':
        return 'Transaction was declined. Please contact support for more information.';
      case 'on hold':
        return 'Transaction is temporarily on hold pending verification.';
      case 'ongoing':
        return 'Transaction is in progress and being actively processed.';
      default:
        return 'Transaction status is being updated.';
    }
  };

  return (
    <div className="space-y-4">
      <div id="maya-receipt-content">
        <Card className="receipt-container overflow-hidden">
          {/* Maya Header */}
          <div className="bg-gradient-to-r from-[#00d4aa] to-[#00b894] text-white p-6 text-center">
            <div className="text-2xl font-bold mb-2">Maya</div>
            <div className="text-sm opacity-90">Official Transaction Receipt</div>
            <div className="text-xs opacity-75 mt-1">Trading Wallet Platform</div>
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Status */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              {getStatusIcon(transaction.status)}
              <Badge 
                className={`text-sm font-medium px-3 py-1 ${getStatusColor(transaction.status)}`}
              >
                {transaction.status.toUpperCase()}
              </Badge>
            </div>

            {/* Amount */}
            <div className="text-center border-b pb-4 mb-4">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(transaction.amount)}
              </div>
              <div className="text-gray-500 capitalize font-medium">{transaction.type} Transaction</div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Reference Number</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {transaction.referenceNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Transaction Date</span>
                <span className="text-right text-sm">{formatDate(transaction.date)}</span>
              </div>

              {transaction.accountName && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Account Name</span>
                  <span className="text-right font-medium">{transaction.accountName}</span>
                </div>
              )}

              {transaction.accountNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Account Number</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {transaction.accountNumber}
                  </span>
                </div>
              )}

              {transaction.method && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Payment Method</span>
                  <span className="font-medium">{transaction.method}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Transaction Type</span>
                <span className="capitalize font-medium">{transaction.type}</span>
              </div>
            </div>

            {/* Status Information */}
            <div className={`rounded-lg p-4 mt-6 ${
              transaction.status === 'completed' ? 'bg-green-50 border border-green-200' :
              transaction.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
              transaction.status === 'processing' ? 'bg-blue-50 border border-blue-200' :
              transaction.status === 'failed' || transaction.status === 'declined' ? 'bg-red-50 border border-red-200' :
              transaction.status === 'on hold' ? 'bg-orange-50 border border-orange-200' :
              transaction.status === 'ongoing' ? 'bg-purple-50 border border-purple-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-start space-x-3">
                {getStatusIcon(transaction.status)}
                <div>
                  <div className={`font-semibold mb-1 ${
                    transaction.status === 'completed' ? 'text-green-800' :
                    transaction.status === 'pending' ? 'text-yellow-800' :
                    transaction.status === 'processing' ? 'text-blue-800' :
                    transaction.status === 'failed' || transaction.status === 'declined' ? 'text-red-800' :
                    transaction.status === 'on hold' ? 'text-orange-800' :
                    transaction.status === 'ongoing' ? 'text-purple-800' :
                    'text-gray-800'
                  }`}>
                    {transaction.status === 'completed' ? 'Transaction Completed' :
                     transaction.status === 'pending' ? 'Pending Approval' :
                     transaction.status === 'processing' ? 'Processing Transaction' :
                     transaction.status === 'failed' ? 'Transaction Failed' :
                     transaction.status === 'declined' ? 'Transaction Declined' :
                     transaction.status === 'on hold' ? 'Transaction On Hold' :
                     transaction.status === 'ongoing' ? 'Transaction In Progress' :
                     'Status Update'}
                  </div>
                  <div className={`text-sm ${
                    transaction.status === 'completed' ? 'text-green-700' :
                    transaction.status === 'pending' ? 'text-yellow-700' :
                    transaction.status === 'processing' ? 'text-blue-700' :
                    transaction.status === 'failed' || transaction.status === 'declined' ? 'text-red-700' :
                    transaction.status === 'on hold' ? 'text-orange-700' :
                    transaction.status === 'ongoing' ? 'text-purple-700' :
                    'text-gray-700'
                  }`}>
                    {getStatusMessage(transaction.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Instructions */}
            {transaction.description && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-100 p-1 rounded">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">
                      Important Instructions
                    </div>
                    <div className="text-sm text-blue-700 leading-relaxed">
                      {transaction.description}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Charges (if any) */}
            {transaction.dutyCharge && transaction.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-yellow-800 mb-2">
                      Additional Charges Required
                    </div>
                    <div className="text-sm text-yellow-700 space-y-2">
                      <p><strong>Duty Charge:</strong> {formatCurrency(transaction.dutyCharge)}</p>
                      <p className="font-medium">
                        Please complete the duty charge payment to proceed with your withdrawal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t space-y-1">
              <p>© 2024 Trading Wallet Platform</p>
              <p>This is an official transaction receipt</p>
              <p>Generated on {new Date().toLocaleDateString('en-PH')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button 
          onClick={downloadReceipt}
          className="flex-1 bg-[#00d4aa] hover:bg-[#00b894] text-white shadow-md hover:shadow-lg transition-all"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
        <Button 
          onClick={onClose}
          variant="outline"
          className="flex-1 border-gray-300 hover:border-gray-400"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default MayaReceipt;