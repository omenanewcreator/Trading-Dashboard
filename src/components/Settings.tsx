import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  User,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { storageUtils } from '@/utils/storage';
import { toast } from 'sonner';
import AdminPanel from './AdminPanel';

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      transactions: true,
      security: true,
      marketing: false,
      system: true
    },
    security: {
      twoFactor: false,
      loginNotifications: true,
      sessionTimeout: '30'
    },
    preferences: {
      currency: 'PHP',
      language: 'English',
      timezone: 'Asia/Manila',
      theme: 'light'
    }
  });

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
    toast.success('Notification preferences updated');
  };

  const handleSecurityChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
    toast.success('Security settings updated');
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
    toast.success('Preferences updated');
  };

  const exportData = () => {
    const userData = storageUtils.getUser();
    const walletData = storageUtils.getWallet();
    const notifications = storageUtils.getNotifications();

    const exportData = {
      user: userData,
      wallet: walletData,
      notifications,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `trading_wallet_data_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success('Data exported successfully');
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      storageUtils.clearAll();
      toast.success('All data cleared successfully');
      // Redirect to login
      window.location.reload();
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tradingId">Trading ID</Label>
              <div className="flex items-center space-x-2">
                <Input id="tradingId" value="INVESTOR001" disabled className="bg-gray-50" />
                <Badge variant="default" className="bg-green-600">Verified</Badge>
              </div>
            </div>
            <div>
              <Label htmlFor="accountStatus">Account Status</Label>
              <div className="flex items-center space-x-2">
                <Input id="accountStatus" value="Active" disabled className="bg-gray-50" />
                <Badge className="bg-green-100 text-green-800">Premium</Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="memberSince">Member Since</Label>
              <Input id="memberSince" value="January 2024" disabled className="bg-gray-50" />
            </div>

            <div>
              <Label htmlFor="lastLogin">Last Login</Label>
              <Input id="lastLogin" value={new Date().toLocaleString()} disabled className="bg-gray-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <Switch 
              checked={settings.security.twoFactor}
              onCheckedChange={(checked) => handleSecurityChange('twoFactor', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Login Notifications</h3>
              <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
            </div>
            <Switch 
              checked={settings.security.loginNotifications}
              onCheckedChange={(checked) => handleSecurityChange('loginNotifications', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
              className="w-32"
            />
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full md:w-auto">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Transaction Updates</h3>
              <p className="text-sm text-gray-500">Notifications for deposits, withdrawals, and transfers</p>
            </div>
            <Switch 
              checked={settings.notifications.transactions}
              onCheckedChange={(checked) => handleNotificationChange('transactions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Security Alerts</h3>
              <p className="text-sm text-gray-500">Important security and account access notifications</p>
            </div>
            <Switch 
              checked={settings.notifications.security}
              onCheckedChange={(checked) => handleNotificationChange('security', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">System Updates</h3>
              <p className="text-sm text-gray-500">Platform updates and maintenance notifications</p>
            </div>
            <Switch 
              checked={settings.notifications.system}
              onCheckedChange={(checked) => handleNotificationChange('system', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing Communications</h3>
              <p className="text-sm text-gray-500">Promotional offers and trading insights</p>
            </div>
            <Switch 
              checked={settings.notifications.marketing}
              onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Input
                id="currency"
                value={settings.preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={settings.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={settings.preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={settings.preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button onClick={exportData} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={clearAllData} variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Data Privacy Notice</p>
                <p className="text-yellow-700 mt-1">
                  Your data is stored locally on your device. Clearing data will permanently remove all your 
                  trading history, settings, and account information from this device.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secret Restore Button at bottom */}
      <div className="mt-8">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setShowAdminPanel(true)}
        >
          Restore (Secret Admin Panel)
        </Button>
      </div>

      {showAdminPanel && <AdminPanel />}
    </div>
  );
};

export default Settings;