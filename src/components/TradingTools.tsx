import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  LineChart, 
  PieChart,
  DollarSign,
  Globe,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  BookOpen
} from 'lucide-react';

const TradingTools = () => {
  const marketData = [
    { symbol: 'USD/PHP', price: 56.85, change: -0.25, changePercent: -0.44 },
    { symbol: 'BTC/USD', price: 43250.00, change: 850.50, changePercent: 2.01 },
    { symbol: 'ETH/USD', price: 2650.25, change: -45.75, changePercent: -1.70 },
    { symbol: 'GOLD', price: 2025.80, change: 12.30, changePercent: 0.61 }
  ];

  const tradingRecords = [
    { date: '2024-01-22', pair: 'USD/PHP', action: 'BUY', amount: 5000, profit: 150.00, status: 'completed' },
    { date: '2024-01-21', pair: 'BTC/USD', action: 'SELL', amount: 0.5, profit: -25.50, status: 'completed' },
    { date: '2024-01-20', pair: 'ETH/USD', action: 'BUY', amount: 2, profit: 85.25, status: 'completed' },
    { date: '2024-01-19', pair: 'GOLD', action: 'BUY', amount: 10, profit: 45.80, status: 'pending' },
  ];

  const newsData = [
    {
      title: "Philippine Peso Strengthens Against US Dollar",
      summary: "BSP's monetary policy supports peso recovery amid global market volatility.",
      time: "2 hours ago",
      category: "Forex"
    },
    {
      title: "Bitcoin Reaches New Monthly High",
      summary: "Cryptocurrency market shows strong momentum following institutional adoption.",
      time: "4 hours ago",
      category: "Crypto"
    },
    {
      title: "Gold Prices Surge on Inflation Concerns",
      summary: "Safe-haven demand increases as investors hedge against economic uncertainty.",
      time: "6 hours ago",
      category: "Commodities"
    },
    {
      title: "Philippine Stock Market Updates",
      summary: "PSEi shows positive momentum with banking and property sectors leading gains.",
      time: "8 hours ago",
      category: "Stocks"
    }
  ];

  const formatCurrency = (amount: number, currency = 'USD') => {
    if (currency === 'PHP') {
      return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Trading Tools & Analytics</h1>
        <p className="text-purple-100">Monitor markets, analyze trends, and manage your trades</p>
      </div>

      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Live Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.map((market, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{market.symbol}</span>
                  <div className={`flex items-center space-x-1 ${
                    market.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {market.change >= 0 ? 
                      <ArrowUpRight className="h-3 w-3" /> : 
                      <ArrowDownRight className="h-3 w-3" />
                    }
                    <span className="text-xs">{Math.abs(market.changePercent)}%</span>
                  </div>
                </div>
                <p className="text-lg font-bold">{formatCurrency(market.price)}</p>
                <p className={`text-sm ${market.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {market.change >= 0 ? '+' : ''}{formatCurrency(market.change)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Trading Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tradingRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      record.action === 'BUY' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {record.action === 'BUY' ? 
                        <TrendingUp className="h-4 w-4 text-green-600" /> :
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold">{record.pair}</p>
                      <p className="text-sm text-gray-500">{record.date} • {record.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      record.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.profit >= 0 ? '+' : ''}₱{Math.abs(record.profit).toLocaleString()}
                    </p>
                    <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Trades</span>
                <span className="font-semibold">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Winning Rate</span>
                <span className="font-semibold text-green-600">68.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Profit</span>
                <span className="font-semibold text-green-600">₱98,880</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Risk Score</span>
                <Badge variant="default" className="bg-blue-600">Moderate</Badge>
              </div>
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              View Detailed Analysis
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Market News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Market News & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsData.map((news, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {news.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{news.time}</span>
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">{news.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{news.summary}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <LineChart className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Technical Analysis</h3>
            <p className="text-sm text-gray-500">Chart patterns & indicators</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Risk Management</h3>
            <p className="text-sm text-gray-500">Position sizing & stops</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Signal Alerts</h3>
            <p className="text-sm text-gray-500">Real-time notifications</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-semibold mb-2">Economic Calendar</h3>
            <p className="text-sm text-gray-500">Market-moving events</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingTools;