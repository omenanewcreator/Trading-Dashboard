import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  Settings,
  Trash2,
  BellRing,
  CreditCard,
  Shield,
  TrendingUp,
  User,
  Archive
} from 'lucide-react';
import { storageUtils } from '@/utils/storage';
import { NotificationData } from '@/types';
import { toast } from 'sonner';

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Load notifications from storage with more frequent updates
    const loadNotifications = () => {
      const stored = storageUtils.getNotifications();
      setNotifications(stored);
    };

    // Initial load
    loadNotifications();

    // Real-time updates every 500ms for more active notifications
    const interval = setInterval(loadNotifications, 500);
    return () => clearInterval(interval);
  }, []);

  // Add sample notifications for demonstration if none exist
  useEffect(() => {
    if (notifications.length === 0) {
      const sampleNotifications: NotificationData[] = [
        {
          id: 'sample_1',
          title: 'Welcome to Trading Wallet',
          message: 'Your account has been successfully set up. Start exploring our trading features!',
          type: 'success',
          timestamp: new Date().toISOString(),
          read: false,
          category: 'account'
        },
        {
          id: 'sample_2',
          title: 'Market Alert',
          message: 'NASDAQ is up 1.5% today. Consider reviewing your portfolio positions.',
          type: 'info',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          category: 'market'
        }
      ];
      
      storageUtils.setNotifications(sampleNotifications);
      setNotifications(sampleNotifications);
    }
  }, []);

  const markAsRead = (notificationId: string) => {
    const updated = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    setNotifications(updated);
    storageUtils.setNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updated);
    storageUtils.setNotifications(updated);
    toast.success('All notifications marked as read');
  };
  const deleteNotification = (notificationId: string) => {
    const updated = notifications.filter(notif => notif.id !== notificationId);
    setNotifications(updated);
    storageUtils.setNotifications(updated);
    toast.success('Notification deleted');
  };

  const clearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      setNotifications([]);
      storageUtils.setNotifications([]);
      toast.success('All notifications cleared');
    }
  };

  const getNotificationIcon = (type: string, category?: string) => {
    if (category) {
      switch (category) {
        case 'transaction':
          return <CreditCard className="h-5 w-5 text-blue-600" />;
        case 'security':
          return <Shield className="h-5 w-5 text-red-600" />;
        case 'market':
          return <TrendingUp className="h-5 w-5 text-green-600" />;
        case 'account':
          return <User className="h-5 w-5 text-purple-600" />;
        default:
          break;
      }
    }
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean, priority?: 'high' | 'medium' | 'low') => {
    let baseColor = '';
    const intensity = read ? '30' : priority === 'high' ? '70' : '50';
    
    switch (type) {
      case 'success':
        baseColor = `bg-green-${intensity} border-green-300`;
        break;
      case 'warning':
        baseColor = `bg-yellow-${intensity} border-yellow-300`;
        break;
      case 'error':
        baseColor = `bg-red-${intensity} border-red-300`;
        break;
      case 'info':
      default:
        baseColor = `bg-blue-${intensity} border-blue-300`;
        break;
    }

    if (priority === 'high' && !read) {
      baseColor += ' ring-2 ring-red-400 ring-opacity-50';
    }

    return baseColor;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;
  const recentNotifications = notifications
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filterNotifications = (filter: string) => {
    switch (filter) {
      case 'unread':
        return recentNotifications.filter(n => !n.read);
      case 'transaction':
        return recentNotifications.filter(n => n.category === 'transaction' || n.title.toLowerCase().includes('withdrawal') || n.title.toLowerCase().includes('deposit') || n.title.toLowerCase().includes('balance'));
      case 'security':
        return recentNotifications.filter(n => n.category === 'security' || n.title.toLowerCase().includes('login') || n.title.toLowerCase().includes('access'));
      case 'market':
        return recentNotifications.filter(n => n.category === 'market' || n.title.toLowerCase().includes('market') || n.title.toLowerCase().includes('trading'));
      case 'all':
      default:
        return recentNotifications;
    }
  };

  const filteredNotifications = filterNotifications(activeTab);

  const getCategoryStats = () => {
    return {
      all: notifications.length,
      unread: unreadCount,
      transaction: notifications.filter(n => n.category === 'transaction' || n.title.toLowerCase().includes('withdrawal') || n.title.toLowerCase().includes('deposit')).length,
      security: notifications.filter(n => n.category === 'security' || n.title.toLowerCase().includes('login') || n.title.toLowerCase().includes('access')).length,
      market: notifications.filter(n => n.category === 'market' || n.title.toLowerCase().includes('market')).length
    };
  };

  const stats = getCategoryStats();
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <BellRing className="h-6 w-6 text-blue-600" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  All caught up!
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.all}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
            <div className="text-sm text-gray-600">Unread</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.transaction}</div>
            <div className="text-sm text-gray-600">Transactions</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.security}</div>
            <div className="text-sm text-gray-600">Security</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.market}</div>
            <div className="text-sm text-gray-600">Market</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs">
                All ({stats.all})
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread ({stats.unread})
              </TabsTrigger>
              <TabsTrigger value="transaction" className="text-xs">
                💰 Transactions
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs">
                🔒 Security
              </TabsTrigger>
              <TabsTrigger value="market" className="text-xs">
                📈 Market
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border rounded-lg p-4 transition-all duration-300 hover:shadow-md ${
                        getNotificationBg(notification.type, notification.read)
                      } ${!notification.read ? 'border-l-4 animate-pulse' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getNotificationIcon(notification.type, notification.category)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                              )}
                              {notification.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {notification.category}
                                </Badge>
                              )}
                            </div>
                            <p className={`text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </p>
                              {!notification.read && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs animate-pulse">
                                  NEW
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0 hover:bg-green-100"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                            title="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications in this category</p>
                  <p className="text-sm">
                    {activeTab === 'unread' ? "All notifications have been read" : "No notifications found"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Transaction Updates</p>
                  <p className="text-sm text-gray-500">Deposits, withdrawals & balance changes</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">✓ Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Security Alerts</p>
                  <p className="text-sm text-gray-500">Login attempts & account access</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">✓ Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Market Updates</p>
                  <p className="text-sm text-gray-500">Trading signals & market movements</p>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-800">✓ Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">System Maintenance</p>
                  <p className="text-sm text-gray-500">Scheduled maintenance alerts</p>
                </div>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Real-time Notifications</p>
                <p className="text-blue-700 mt-1">
                  Your notifications update automatically every 500ms to ensure you never miss important updates about your account, transactions, and market movements.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;